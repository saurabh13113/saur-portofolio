"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { CanvasTexture, MeshLambertMaterial, NearestFilter, SRGBColorSpace } from "three";

// A Minecraft-style me, built like a real skin: boxes in skin-pixel units
// (head 8x8x8, body 8x12x4, limbs 4x12x4) with 8x8 pixel-art textures.
// The head turns and the pupils slide toward the cursor anywhere on the page.

const PAL = {
  H: "#17110e", h: "#2a1d17", // hair
  B: "#120c0a", // eyebrows
  S: "#8d5a3b", s: "#6e452c", E: "#7a4c31", // skin, stubble/shadow, ear
  W: "#f2efe8", M: "#3a1a14", T: "#f7f4ee", // eye white, mouth, teeth
  K: "#1d1d23", k: "#121216", g: "#3a3a44", // blazer, lapel shade, button
  Q: "#f0ede6", q: "#cfcac0", // white shirt, shirt shade
  J: "#2a3348", j: "#222a3c", F: "#e8e8e8", f: "#bdbdc4", // jeans, shoes
};

const FACE = ["HHHHHHHH", "HhHHhHhH", "SBBSSBBS", "SWWSSWWS", "SSSssSSS", "sMTTTTMs", "ssssssss", "ssssssss"];
const SIDE = ["HHHHHHHH", "HHHHHHHH", "SHHHHHHH", "SSHHHHHH", "SSSEHHHH", "sSSEHHHH", "ssSSHHHH", "ssSSSHHH"];
const TOP = ["HhHHhHHh", "hHHhHHhH", "HHhHHhHH", "hHHHhHHh", "HhHHHhHH", "HHhHhHHh", "hHHhHHhH", "HhHHhHHH"];
const BACK = ["HHhHHhHH", "HhHHHHhH", "HHHhHHHH", "hHHHHhHH", "HHHHHHHh", "HhHHhHHH", "HHHHHHHH", "sHHHHHHs"];
// Outer "hat" layer for curl volume ('.' = see-through)
const CURL_TOP = ["hHhHHhHh", "HhH.hHhH", "hHhHHhHh", "H.hHhH.H", "hHhHHhHh", "HhHhH.hH", "hH.HhHhH", "HhHhHHhH"];
const CURL_FRONT = ["hHhHHhHh", ".H.hH.H.", "........", "........", "........", "........", "........", "........"];
const CURL_SIDE = ["HhHHhHHh", "hH.HhHhH", ".h..HhHH", "....hHHh", ".....HhH", "......Hh", "........", "........"];
const CURL_BACK = ["hHhHHhHh", "HhHhHHhH", "hH.HhHhH", "HhHh.hHh", ".hHhH.Hh", "..h..h..", "........", "........"];
// black blazer over an open-collar white shirt, like my photo
const BODY_FRONT = ["KqQQQQqK", "KkQQQQkK", "KKkQQkKK", "KKKqqKKK", "KKKKgKKK", "KKKKKKKK", "KkKKKKkK", "KKKKgKKK", "KKKKKKKK", "KKKKKKKK", "kkkkkkkk", "JJJJJJJJ"];
const BODY_BACK = ["kKKKKKKk", ...Array(9).fill("KKKKKKKK"), "kkkkkkkk", "JJJJJJJJ"];
const BODY_SIDE = ["kKKK", ...Array(9).fill("KKKK"), "kkkk", "JJJJ"];
const ARM = ["kKKk", ...Array(8).fill("KKKK"), "QQQQ", "SSSS", "SSSs"]; // blazer sleeve, shirt cuff, hand
const LEG = [...Array(9).fill("JJJj"), "jjjj", "FFFF", "ffff"]; // jeans with a side seam, white shoes
const fill = (ch, w, h) => Array.from({ length: h }, () => ch.repeat(w));
const mirror = (rows) => rows.map((r) => [...r].reverse().join(""));

function texture(rows) {
  const c = document.createElement("canvas");
  c.width = rows[0].length;
  c.height = rows.length;
  const g = c.getContext("2d");
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (!PAL[ch]) return;
      g.fillStyle = PAL[ch];
      g.fillRect(x, y, 1, 1);
    })
  );
  const t = new CanvasTexture(c);
  t.magFilter = t.minFilter = NearestFilter;
  t.generateMipmaps = false;
  t.colorSpace = SRGBColorSpace;
  return t;
}

// Box with one texture per face, in three's order: +x, -x, +y, -y, +z (front), -z.
function Part({ size, position, faces, see = false }) {
  const mats = useMemo(
    () => faces.map((rows) => new MeshLambertMaterial({ map: texture(rows), transparent: see, alphaTest: see ? 0.5 : 0 })),
    [faces, see]
  );
  return (
    <mesh position={position} material={mats}>
      <boxGeometry args={size} />
    </mesh>
  );
}

const flat = (color) => <meshLambertMaterial color={color} />;
const clamp = (v) => Math.max(-1, Math.min(1, v));

function Me({ pointer, waveAt }) {
  const head = useRef();
  const body = useRef();
  const armR = useRef();
  const armL = useRef();
  const pupils = useRef([]);
  const lids = useRef();
  const look = useRef({ x: 0, y: 0 });

  const parts = useMemo(
    () => ({
      // side maps are drawn front-to-back for +x; three reads -x back-to-front, hence mirror
      head: [SIDE, mirror(SIDE), TOP, fill("s", 8, 8), FACE, BACK],
      curls: [CURL_SIDE, mirror(CURL_SIDE), CURL_TOP, fill(".", 8, 8), CURL_FRONT, CURL_BACK],
      body: [BODY_SIDE, BODY_SIDE, ["kQQQQQQk", ...fill("k", 8, 3)], fill("J", 8, 4), BODY_FRONT, BODY_BACK],
      arm: [ARM, ARM, fill("K", 4, 4), fill("S", 4, 4), ARM, ARM],
      leg: [LEG, LEG, fill("J", 4, 4), fill("f", 4, 4), LEG, LEG],
    }),
    []
  );

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const p = pointer.current;
    // follow the cursor; drift around idly if it hasn't moved for a while
    const idle = t - p.at > 4;
    const tx = idle ? 0.5 * Math.sin(t * 0.5) : p.x;
    const ty = idle ? 0.25 * Math.sin(t * 0.7) : p.y;
    const k = Math.min(1, dt * 8);
    look.current.x += (tx - look.current.x) * k;
    look.current.y += (ty - look.current.y) * k;
    const { x, y } = look.current;

    head.current.rotation.set(y * 0.35, x * 0.6, 0);
    body.current.rotation.y = x * 0.15;
    body.current.position.y = Math.sin(t * 2) * 0.15;
    // pupils slide across their 2-pixel eye whites
    pupils.current.forEach((m, i) => m && (m.position.x = (i ? 1.5 : -2.5) + (x + 1) / 2));
    // blink roughly every 4 seconds
    lids.current.visible = t % 4 < 0.12;

    const waving = t - (waveAt.current ?? -9) < 1.6;
    armR.current.rotation.z = waving ? 2.6 + 0.35 * Math.sin(t * 14) : 0.04 * Math.sin(t * 1.5);
    armL.current.rotation.z = -0.04 * Math.sin(t * 1.5);
  });

  return (
    <group ref={body}>
      <Part size={[4, 12, 4]} position={[-2, 6, 0]} faces={parts.leg} />
      <Part size={[4, 12, 4]} position={[2, 6, 0]} faces={parts.leg} />
      <Part size={[8, 12, 4]} position={[0, 18, 0]} faces={parts.body} />
      <group ref={armR} position={[6, 22, 0]}>
        <Part size={[4, 12, 4]} position={[0, -4, 0]} faces={parts.arm} />
      </group>
      <group ref={armL} position={[-6, 22, 0]}>
        <Part size={[4, 12, 4]} position={[0, -4, 0]} faces={parts.arm} />
      </group>

      {/* head pivots at the neck */}
      <group ref={head} position={[0, 24, 0]}>
        <Part size={[8, 8, 8]} position={[0, 4, 0]} faces={parts.head} />
        <Part size={[9, 9, 9]} position={[0, 4.4, 0]} faces={parts.curls} see />
        {[0, 1].map((i) => (
          <mesh key={i} ref={(m) => (pupils.current[i] = m)} position={[i ? 2 : -2, 4.5, 4.05]}>
            <boxGeometry args={[1, 1, 0.1]} />
            {flat("#1a1210")}
          </mesh>
        ))}
        <group ref={lids}>
          {[-2, 2].map((x) => (
            <mesh key={x} position={[x, 4.5, 4.12]}>
              <boxGeometry args={[2, 1, 0.1]} />
              {flat(PAL.S)}
            </mesh>
          ))}
        </group>
        {/* headphones */}
        <mesh position={[0, 9.2, 0]}>
          <boxGeometry args={[10, 0.7, 1.2]} />
          {flat("#2a2a33")}
        </mesh>
        {[-1, 1].map((sgn) => (
          <group key={sgn}>
            <mesh position={[sgn * 4.9, 7, 0]}>
              <boxGeometry args={[0.6, 4, 0.8]} />
              {flat("#2a2a33")}
            </mesh>
            <mesh position={[sgn * 4.9, 3.6, 0]}>
              <boxGeometry args={[1.2, 3.2, 3]} />
              {flat("#555b6a")}
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function Shadow() {
  return (
    <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[7, 24]} />
      <meshBasicMaterial color="#000000" transparent opacity={0.35} depthWrite={false} />
    </mesh>
  );
}

const TIPS = [
  "Hi, I'm Saurabh! 👋",
  "Everything in my room is clickable.",
  "Psst, try the light switch by the door.",
  "The cat doesn't bite. Mostly.",
  "Click the keyboard for some music 🎹",
];

export default function Avatar3D() {
  const wrap = useRef(null);
  const pointer = useRef({ x: 0, y: 0, at: -99 });
  const clock = useRef(null);
  const waveAt = useRef(null);
  const [tip, setTip] = useState(null);
  const tipIdx = useRef(0);
  const timer = useRef(null);

  // Track the cursor anywhere on the page, relative to the avatar, in -1..1.
  useEffect(() => {
    const onMove = (e) => {
      const r = wrap.current?.getBoundingClientRect();
      if (!r) return;
      pointer.current.x = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2));
      pointer.current.y = clamp((e.clientY - (r.top + r.height * 0.3)) / (window.innerHeight / 2));
      pointer.current.at = clock.current?.elapsedTime ?? 0;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, []);

  function greet() {
    waveAt.current = clock.current?.elapsedTime ?? 0;
    setTip(TIPS[tipIdx.current++ % TIPS.length]);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setTip(null), 2600);
  }

  return (
    <div ref={wrap} className="relative w-full h-full">
      <Canvas
        camera={{ fov: 32, position: [16, 26, 62], near: 1, far: 200 }}
        onCreated={(s) => {
          clock.current = s.clock;
          s.camera.lookAt(0, 16, 0);
        }}
        dpr={0.5}
        gl={{ antialias: false, alpha: true }}
        flat
        className="avatar3d"
      >
        <ambientLight intensity={1.1} color="#fff4e6" />
        <directionalLight position={[-20, 40, 40]} intensity={1.6} color="#ffe2b8" />
        <directionalLight position={[30, 20, -30]} intensity={1.2} color="#6d8cff" />
        <Me pointer={pointer} waveAt={waveAt} />
        <Shadow />
      </Canvas>
      <button type="button" onClick={greet} aria-label="Say hi to Saurabh" className="absolute inset-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f4d27a]" />
      {tip ? (
        <div role="status" className="room-label absolute left-1/2 top-0 opacity-100 whitespace-normal w-max max-w-[220px] text-center" style={{ transform: "translate(-50%, -30%)", bottom: "auto" }}>
          {tip}
        </div>
      ) : null}
    </div>
  );
}

"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { B, Obj, Merge, Shadow, Pic } from "./parts";
import { FAMILY_ART, MESSI_ART, BLEACH_ART } from "./art";

// Room: floor 6 x 6 (metres-ish), walls 2.8 tall. Back corner at the origin.
// Left wall = plane x=0 (door, bookshelf, bed); right wall = plane z=0 (desk, window).
const RW = 6;
const RD = 6;
const RH = 2.8;

const C = {
  wallL: "#c9bca4", wallR: "#c2b59d", trim: "#5a3d27",
  wood: "#7a4f2f", darkWood: "#5e3c22", deskTop: "#8b5a34",
  metal: "#1d1e24", navy: "#2c3d66", sweater: "#2c5a45", rib: "#224736", hair: "#1a1412", skin: "#9a6242", jeans: "#2a3348",
  amber: "#f4d27a", glow: "#ffb347", screen: "#0c1d33", blue: "#2d7bff",
};
const BOOKS = ["#b03a2e", "#2e6b57", "#c9973f", "#34598f", "#6d4c8f", "#c65a1e", "#1f7a70", "#e6dcc4", "#8a2f3f"];

const wave = (t, speed, phase = 0) => Math.sin(t * speed + phase);

function Shell() {
  const planks = ["#8a5a35", "#7d5030", "#94623a", "#83552f"];
  return (
    <>
      <B p={[-0.2, -0.3, -0.2]} s={[RW + 0.2, 0.2, RD + 0.2]} c="#2a1c12" />
      {Array.from({ length: RD / 0.5 }, (_, i) => (
        <B key={i} p={[0, -0.1, i * 0.5]} s={[RW, 0.1, 0.5]} c={planks[(i * 3) % 4]} />
      ))}
      {/* left wall, baseboard */}
      <B p={[-0.2, -0.1, -0.2]} s={[0.2, RH + 0.1, RD + 0.2]} c={C.wallL} />
      <B p={[0, 0, 0]} s={[0.03, 0.12, RD]} c={C.trim} />
      {/* right wall, built around the window hole (x 3.6-5.2, y 1.0-2.3) */}
      <B p={[0, -0.1, -0.2]} s={[3.6, RH + 0.1, 0.2]} c={C.wallR} />
      <B p={[5.2, -0.1, -0.2]} s={[0.8, RH + 0.1, 0.2]} c={C.wallR} />
      <B p={[3.6, -0.1, -0.2]} s={[1.6, 1.1, 0.2]} c={C.wallR} />
      <B p={[3.6, 2.3, -0.2]} s={[1.6, 0.5, 0.2]} c={C.wallR} />
      <B p={[0, 0, 0]} s={[RW, 0.12, 0.03]} c={C.trim} />
    </>
  );
}

// The view out of the window: a flat backdrop sitting just behind the glass
// (a diorama trick; anything deeper would show up outside the room).
// Rain or snow falls only when it's actually raining or snowing in Toronto
// (weather from Room3D); crescent = a crescent moon for Eid. During a storm,
// lightningAt (a ref, set by Room3D on each strike) briefly flashes the sky pane.
const dropX = (i) => 3.66 + ((i * 0.37) % 1.48);
function WindowView({ reduce, day, weather, crescent, lightningAt }) {
  const drops = useRef([]);
  const sky = useRef();
  const snow = weather === "snow";
  const grey = day && weather !== "clear"; // overcast: no sun, and rain dark enough to see
  useFrame(({ clock }, dt) => {
    if (reduce || weather === "clear") return;
    const t = clock.elapsedTime;
    drops.current.forEach((m, i) => {
      if (!m) return;
      m.position.y -= dt * (snow ? 0.25 + (i % 3) * 0.08 : 1.6 + (i % 3) * 0.4);
      if (snow) m.position.x = dropX(i) + 0.03 * Math.sin(t * 1.5 + i);
      if (m.position.y < 1.05) m.position.y = 2.25;
    });
    if (weather === "storm" && sky.current) {
      const since = t - (lightningAt?.current ?? -99);
      const flash = since >= 0 && since < 0.15 ? 1 - since / 0.15 : 0;
      sky.current.material.emissiveIntensity = 1 + flash * 8;
    }
  });
  const towers = [[3.62, 0.34, 0.5], [3.98, 0.28, 0.75], [4.28, 0.36, 0.4], [4.66, 0.3, 0.85], [4.98, 0.22, 0.55]];
  return (
    <group userData={{ live: true }}>
      <B mref={(m) => (sky.current = m)} p={[3.6, 1.0, -0.2]} s={[1.6, 1.3, 0.02]} c={grey ? "#aab4c0" : day ? "#8ec5ff" : "#0e1735"} e={grey ? "#8e99a6" : day ? "#7ab8f0" : "#111d48"} />
      {grey ? null : day ? (
        <B p={[4.75, 1.9, -0.175]} s={[0.18, 0.18, 0.01]} c="#fff1a8" e="#ffe27a" />
      ) : (
        <>
          <B p={[4.85, 1.95, -0.175]} s={[0.12, 0.12, 0.01]} c="#f3edc8" e="#f3edc8" />
          {crescent ? <B p={[4.88, 1.98, -0.172]} s={[0.1, 0.1, 0.01]} c="#0e1735" e="#111d48" /> : null}
          {[[3.8, 2.15], [4.1, 2.05], [4.45, 2.2], [5.05, 2.1], [3.7, 1.9]].map(([x, y]) => (
            <B key={x} p={[x, y, -0.176]} s={[0.02, 0.02, 0.005]} c="#e8e4ff" e="#e8e4ff" />
          ))}
        </>
      )}
      {towers.map(([x, w, h], i) => (
        <group key={x}>
          <B p={[x, 1.0, -0.17]} s={[w, h, 0.02]} c={day ? "#8792a8" : "#0a0f22"} e={day ? "#3a4252" : undefined} />
          {!day &&
            Array.from({ length: Math.floor(h / 0.12) }, (_, r) =>
              [0, 1, 2].map((k) =>
                (i + r * 2 + k) % 3 === 0 && 0.05 + k * 0.1 < w - 0.04 ? (
                  <B key={`${r}-${k}`} p={[x + 0.05 + k * 0.1, 1.05 + r * 0.12, -0.149]} s={[0.04, 0.05, 0.004]} c={C.amber} e={C.amber} ei={0.9} />
                ) : null
              )
            )}
        </group>
      ))}
      <B p={[3.6, 1.0, -0.14]} s={[1.6, 0.16, 0.02]} c={day ? "#3f8a4a" : "#10301c"} e={day ? "#1c3d20" : undefined} />
      {[3.7, 4.1, 4.5, 4.9].map((x) => (
        <B key={x} p={[x, 1.16, -0.14]} s={[0.22, 0.08, 0.02]} c={day ? "#3f8a4a" : "#10301c"} e={day ? "#1c3d20" : undefined} />
      ))}
      {weather !== "clear" &&
        Array.from({ length: snow ? 16 : 12 }, (_, i) => (
          <B
            key={`${weather}-${i}`}
            mref={(m) => (drops.current[i] = m)}
            p={[dropX(i), 1.05 + ((i * 0.53) % 1.2), -0.12]}
            s={snow ? [0.032, 0.032, 0.006] : [0.02, 0.1, 0.006]}
            c={snow ? "#ffffff" : day ? "#3f5f8f" : "#9fb4ff"}
            e={snow ? "#dfe8ff" : day ? "#2c4570" : "#6d86d8"}
            ei={snow ? 0.8 : 0.7}
          />
        ))}
    </group>
  );
}

// The cat's pivot (middle of its body on the sill); every part is placed relative to it.
const CAT = [4.785, 0, 0.105];
const WALK = 0.5; // how far along the sill it strolls
const lerp = (a, b, k) => a + (b - a) * k;

// Awake, it watches your cursor and now and then strolls along the sill and back.
// At night it sleeps (eyes shut, z's floating up) unless you've just petted it.
function Window({ catJumpAt, reduce, day }) {
  const tail = useRef();
  const cat = useRef();
  const head = useRef();
  const eyes = useRef([]);
  const lids = useRef([]);
  const zs = useRef([]);
  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;
    const since = t - (catJumpAt.current ?? -99);
    const asleep = !day && since > 6;
    if (tail.current && !reduce) tail.current.rotation.x = asleep ? 0.1 * wave(t, 0.8) : 0.35 * wave(t, 2);
    eyes.current.forEach((m) => m && (m.visible = !asleep));
    lids.current.forEach((m) => m && (m.visible = asleep));
    zs.current.forEach((m, i) => {
      if (!m) return;
      m.visible = asleep && !reduce;
      const k = (t * 0.35 + i / 2) % 1;
      m.position.set(0.12 + k * 0.05, 0.12 + k * 0.22, 0);
      m.scale.setScalar(0.6 + k * 0.6);
    });
    if (!cat.current) return;
    // stroll schedule (24s loop): sit, walk left, sit, walk back
    const ph = reduce || asleep ? 0 : t % 24;
    const walkOut = ph >= 14 && ph < 17;
    const walkBack = ph >= 20 && ph < 23;
    const off = walkOut ? -WALK * ((ph - 14) / 3) : ph >= 17 && ph < 20 ? -WALK : walkBack ? -WALK * (1 - (ph - 20) / 3) : 0;
    const facingLeft = ph >= 14 && ph < 20;
    const walking = walkOut || walkBack;
    cat.current.position.x = CAT[0] + off;
    cat.current.rotation.y = facingLeft ? Math.PI : 0;
    const hop = since < 0.45 ? Math.sin((since / 0.45) * Math.PI) * 0.18 : 0;
    cat.current.position.y = hop + (walking ? Math.abs(Math.sin(t * 12)) * 0.012 : 0);
    // head: droops when asleep, otherwise follows the cursor (pointer is -1..1 over the room)
    if (head.current) {
      const r = head.current.rotation;
      const look = !asleep && !walking && !facingLeft;
      r.y = lerp(r.y, look ? 0.6 * pointer.x : 0, 0.1);
      r.z = lerp(r.z, asleep ? -0.35 : look ? 0.3 * pointer.y : 0, 0.1);
      head.current.position.y = asleep ? 1.15 : 1.19;
    }
  });
  return (
    <>
      {/* frame + sill */}
      <B p={[3.55, 0.95, -0.2]} s={[1.7, 0.06, 0.46]} c="#d8d0c0" />
      <B p={[3.55, 2.28, -0.22]} s={[1.7, 0.07, 0.26]} c="#d8d0c0" />
      <B p={[3.55, 1.0, -0.22]} s={[0.07, 1.3, 0.26]} c="#d8d0c0" />
      <B p={[5.18, 1.0, -0.22]} s={[0.07, 1.3, 0.26]} c="#d8d0c0" />
      <B p={[4.37, 1.0, -0.12]} s={[0.05, 1.3, 0.05]} c="#d8d0c0" />
      <B p={[3.6, 1.62, -0.12]} s={[1.6, 0.05, 0.05]} c="#d8d0c0" />
      {/* sill plant */}
      <B p={[3.68, 1.01, 0.02]} s={[0.12, 0.12, 0.12]} c="#e8e4dc" />
      <B p={[3.64, 1.13, -0.02]} s={[0.2, 0.16, 0.2]} c="#3f8a4a" />
      {/* the cat */}
      <Obj id="cat">
        <group ref={cat} position={CAT} userData={{ live: true }}>
          <B p={[-0.185, 1.01, -0.085]} s={[0.3, 0.15, 0.17]} c="#8f8f95" />
          <B p={[-0.155, 1.161, -0.075]} s={[0.04, 0.001, 0.15]} c="#5e5e64" />
          <B p={[-0.065, 1.161, -0.075]} s={[0.04, 0.001, 0.15]} c="#5e5e64" />
          <B p={[0.015, 1.03, 0.086]} s={[0.1, 0.11, 0.004]} c="#eeeeee" />
          {/* head pivots at its centre */}
          <group ref={head} position={[0.11, 1.19, 0]} userData={{ live: true }}>
            <B p={[-0.075, -0.07, -0.075]} s={[0.15, 0.14, 0.15]} c="#8f8f95" />
            <B p={[-0.065, 0.07, -0.065]} s={[0.04, 0.05, 0.04]} c="#8f8f95" />
            <B p={[-0.065, 0.07, 0.025]} s={[0.04, 0.05, 0.04]} c="#8f8f95" />
            {[-0.045, 0.015].map((z, i) => (
              <group key={z}>
                <B mref={(m) => (eyes.current[i] = m)} p={[0.075, -0.02, z]} s={[0.004, 0.025, 0.025]} c="#9be15d" e="#9be15d" ei={0.7} />
                <B mref={(m) => (lids.current[i] = m)} p={[0.075, -0.01, z]} s={[0.004, 0.006, 0.025]} c="#3a3a40" />
              </group>
            ))}
            {[0, 1].map((i) => (
              <B key={i} mref={(m) => (zs.current[i] = m)} p={[0, 0, 0]} s={[0.03, 0.03, 0.004]} c="#e8e4ff" e="#b8b4ff" ei={0.8} />
            ))}
          </group>
          <group ref={tail} position={[-0.175, 1.05, -0.005]} userData={{ live: true }}>
            <B p={[-0.02, -0.28, -0.02]} s={[0.04, 0.3, 0.04]} c="#7a7a80" />
          </group>
        </group>
      </Obj>
    </>
  );
}

function Piano({ playing, reduce }) {
  const keys = useRef([]);
  useFrame(({ clock }) => {
    const step = Math.floor(clock.elapsedTime * 6);
    keys.current.forEach((m, i) => {
      if (!m) return;
      const on = playing && (reduce ? i % 4 === 0 : (step + i * 3) % 7 < 2);
      m.material.emissive.set(on ? "#ffb347" : "#000000");
      m.material.emissiveIntensity = on ? 0.9 : 1;
    });
  });
  const black = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12];
  return (
    <Obj id="music">
      <B p={[3.95, 0, 0.28]} s={[0.04, 0.72, 0.04]} c={C.metal} />
      <B p={[4.85, 0, 0.28]} s={[0.04, 0.72, 0.04]} c={C.metal} />
      <B p={[3.95, 0.35, 0.28]} s={[0.94, 0.03, 0.04]} c={C.metal} />
      <B p={[3.8, 0.72, 0.12]} s={[1.2, 0.08, 0.34]} c="#1f1f25" />
      <B p={[3.84, 0.8, 0.14]} s={[0.3, 0.01, 0.08]} c="#2c2c34" />
      <B p={[3.87, 0.811, 0.16]} s={[0.03, 0.005, 0.03]} c="#2ecc71" e="#2ecc71" ei={0.8} />
      <B p={[3.93, 0.811, 0.16]} s={[0.03, 0.005, 0.03]} c={C.amber} e={C.amber} ei={0.8} />
      {Array.from({ length: 14 }, (_, i) => (
        <B key={i} mref={(m) => (keys.current[i] = m)} p={[3.84 + i * 0.08, 0.8, 0.25]} s={[0.075, 0.02, 0.19]} c="#f2efe8" />
      ))}
      {black.map((i) => (
        <B key={`b${i}`} p={[3.84 + i * 0.08 + 0.055, 0.82, 0.25]} s={[0.045, 0.02, 0.11]} c="#141418" />
      ))}
    </Obj>
  );
}

function Monitor({ p, w, h = 0.42, rotY = 0, seed = 0, reduce }) {
  const lines = useRef([]);
  const colors = ["#2ecc71", "#7fd4ff", C.amber, "#ff8fab", "#c7d2fe"];
  const n = Math.floor((h - 0.08) / 0.035);
  useFrame(({ clock }) => {
    if (reduce) return;
    const shift = clock.elapsedTime * 0.06;
    lines.current.forEach((m, i) => {
      if (m) m.position.y = 0.04 + ((i * 0.035 + shift) % (n * 0.035));
    });
  });
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <B p={[0, 0, 0]} s={[w, h, 0.04]} c="#141418" />
      <B p={[0.02, 0.02, 0.041]} s={[w - 0.04, h - 0.04, 0.004]} c={C.screen} e={C.screen} />
      {Array.from({ length: n }, (_, i) => {
        const indent = ((i + seed) % 4) * 0.03;
        const len = 0.08 + (((i * 7 + seed * 3) % 9) / 9) * (w - 0.2);
        return (
          <mesh key={i} ref={(m) => (lines.current[i] = m)} position={[0.05 + indent + len / 2, 0.05 + i * 0.035, 0.047]}>
            <boxGeometry args={[len, 0.014, 0.002]} />
            <meshBasicMaterial color={colors[(i + seed) % colors.length]} />
          </mesh>
        );
      })}
      <B p={[w / 2 - 0.035, -0.18, 0]} s={[0.07, 0.18, 0.05]} c="#141418" />
      <B p={[w / 2 - 0.15, -0.2, -0.08]} s={[0.3, 0.02, 0.18]} c="#141418" />
    </group>
  );
}

// seconds since an object was last clicked (acts comes from Room3D)
const since = (acts, id, t) => t - (acts.current[id] ?? -99);

function Desk({ reduce, songPlaying, day, acts, lampOn }) {
  const lamp = useRef();
  const leds = useRef([]);
  const steam = useRef([]);
  const cone = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (lamp.current) lamp.current.intensity = lampOn ? (day ? 0.8 : 5) * (reduce ? 1 : 1 + 0.04 * wave(t, 7) + 0.03 * wave(t, 23)) : 0;
    leds.current.forEach((m, i) => {
      if (!m) return;
      m.material.emissiveIntensity = songPlaying ? 0.6 + 0.6 * Math.abs(wave(t, 6, i)) : 0.7 + (reduce ? 0 : 0.15 * wave(t, 1.5, i));
    });
    if (cone.current) cone.current.scale.setScalar(songPlaying && !reduce ? 1 + 0.15 * Math.abs(wave(t, 9)) : 1);
    // clicking the coffee sends up a big puff for a couple of seconds
    const puff = since(acts, "coffee", t) < 2.5;
    steam.current.forEach((m, i) => {
      if (!m || reduce) return;
      const k = (t * (puff ? 1.4 : 0.5) + i / 3) % 1;
      m.position.y = 0.92 + k * (puff ? 0.4 : 0.25);
      m.scale.setScalar((1 - k * 0.6) * (puff ? 1.8 : 1));
    });
  });
  return (
    <>
      <Obj id="work">
        <B p={[0, 0.72, 0]} s={[2.6, 0.05, 0.75]} c={C.deskTop} />
        <B p={[0.02, 0, 0.05]} s={[0.45, 0.72, 0.62]} c={C.wood} />
        <B p={[0.06, 0.45, 0.671]} s={[0.37, 0.015, 0.005]} c={C.darkWood} />
        <B p={[0.06, 0.22, 0.671]} s={[0.37, 0.015, 0.005]} c={C.darkWood} />
        <B p={[2.48, 0, 0.05]} s={[0.06, 0.72, 0.65]} c={C.wood} />
        <Monitor p={[0.25, 0.97, 0.36]} w={0.5} rotY={0.35} seed={2} reduce={reduce} />
        <Monitor p={[0.92, 0.97, 0.12]} w={0.74} seed={0} reduce={reduce} />
        <Monitor p={[1.74, 0.97, 0.14]} w={0.5} rotY={-0.35} seed={5} reduce={reduce} />
        <B p={[1.0, 0.77, 0.38]} s={[0.5, 0.025, 0.16]} c="#1c1c22" />
        <B p={[1.02, 0.795, 0.4]} s={[0.46, 0.006, 0.12]} c="#3a3a44" />
        <B p={[1.6, 0.77, 0.45]} s={[0.06, 0.025, 0.09]} c="#1c1c22" />
        <B p={[0.08, 0.77, 0.45]} s={[0.3, 0.06, 0.22]} c="#34598f" />
        <B p={[0.1, 0.83, 0.46]} s={[0.27, 0.05, 0.2]} c="#1f2a44" />
      </Obj>
      {/* desk lamp: click to switch it off and on */}
      <Obj id="lamp">
        <B p={[0.1, 0.77, 0.12]} s={[0.14, 0.03, 0.14]} c={C.metal} />
        <B p={[0.16, 0.8, 0.18]} s={[0.025, 0.35, 0.025]} c={C.metal} />
        <B p={[0.08, 1.12, 0.1]} s={[0.22, 0.12, 0.22]} c={lampOn ? C.amber : "#6b6250"} e={lampOn ? C.glow : "#000000"} ei={day ? 0.25 : 0.9} />
      </Obj>
      <pointLight ref={lamp} position={[0.3, 1.0, 0.35]} color="#ffb35c" intensity={5} distance={4.5} decay={1.6} />
      <pointLight position={[1.3, 1.15, 0.75]} color="#7cc0ff" intensity={4} distance={3} decay={1.6} />
      {/* PC tower: its LEDs pulse along with the speaker */}
      <B p={[2.62, 0, 0.1]} s={[0.26, 0.52, 0.5]} c="#1b1c22" />
      <B mref={(m) => (leds.current[0] = m)} p={[2.66, 0.04, 0.6]} s={[0.03, 0.44, 0.012]} c={C.blue} e={C.blue} />
      <B mref={(m) => (leds.current[1] = m)} p={[2.881, 0.3, 0.2]} s={[0.005, 0.15, 0.15]} c="#3aa0ff" e="#3aa0ff" />
      <B mref={(m) => (leds.current[2] = m)} p={[2.881, 0.1, 0.2]} s={[0.005, 0.15, 0.15]} c="#3aa0ff" e="#3aa0ff" />
      {/* desk speaker: the playlist */}
      <Obj id="song">
        <B p={[2.46, 0.77, 0.03]} s={[0.12, 0.22, 0.12]} c="#26262d" />
        <group ref={cone} position={[2.52, 0.845, 0.152]} userData={{ live: true }}>
          <B p={[-0.035, -0.035, 0]} s={[0.07, 0.07, 0.004]} c="#111114" />
          <B p={[-0.012, -0.012, 0.004]} s={[0.024, 0.024, 0.004]} c="#3a3a44" />
        </group>
        <B p={[2.508, 0.93, 0.151]} s={[0.024, 0.024, 0.004]} c="#3a3a44" />
        <B p={[2.47, 0.79, 0.151]} s={[0.012, 0.012, 0.003]} c={songPlaying ? "#2ecc71" : "#55555e"} e={songPlaying ? "#2ecc71" : undefined} />
      </Obj>
      {/* family photo on the wall above the monitors */}
      <Obj id="family">
        <B p={[0.9, 1.75, 0]} s={[0.8, 0.58, 0.03]} c={C.darkWood} />
        <Pic p={[0.94, 1.79, 0.032]} w={0.72} h={0.5} art={FAMILY_ART} />
      </Obj>
      {/* Bleach poster */}
      <Obj id="bleach">
        <B p={[1.96, 1.46, 0]} s={[0.56, 0.8, 0.02]} c="#141418" />
        <Pic p={[1.98, 1.48, 0.022]} w={0.52} h={0.76} art={BLEACH_ART} />
      </Obj>
      {/* photo, coffee, student ID */}
      <Obj id="photo">
        <B p={[2.3, 0.77, 0.06]} s={[0.13, 0.16, 0.02]} c="#141418" />
        <B p={[2.315, 0.785, 0.081]} s={[0.1, 0.13, 0.002]} c="#c9b79c" />
      </Obj>
      <Obj id="coffee">
        <B p={[2.3, 0.77, 0.45]} s={[0.09, 0.1, 0.09]} c="#eeeeee" />
        <B p={[2.31, 0.871, 0.46]} s={[0.07, 0.001, 0.07]} c="#3b2415" />
        <B p={[2.43, 0.77, 0.26]} s={[0.09, 0.13, 0.09]} c="#3b2415" />
        <B p={[2.425, 0.9, 0.255]} s={[0.1, 0.03, 0.1]} c="#b3261e" />
        {[0, 1, 2].map((i) => (
          <B key={i} mref={(m) => (steam.current[i] = m)} p={[2.33 + i * 0.01, 0.92, 0.48]} s={[0.025, 0.025, 0.025]} c="#dddddd" e="#888888" ei={0.5} />
        ))}
      </Obj>
      <Obj id="studentid">
        <B p={[1.95, 0.77, 0.55]} s={[0.1, 0.006, 0.07]} c="#f0f0f0" />
        <B p={[2.05, 0.77, 0.5]} s={[0.2, 0.007, 0.015]} c="#2d5bd1" />
      </Obj>
    </>
  );
}

function Me({ reduce }) {
  const hands = useRef([]);
  const head = useRef();
  useFrame(({ clock }) => {
    if (reduce) return;
    const t = clock.elapsedTime;
    hands.current.forEach((m, i) => m && (m.position.y = 0.82 + Math.max(0, wave(t, 16, i * 2.1)) * 0.02));
    if (head.current) head.current.position.y = Math.sin(t * 1.2) * 0.008;
  });
  return (
    <Obj id="contact">
      {/* chair */}
      <B p={[1.08, 0.03, 1.12]} s={[0.5, 0.04, 0.06]} c={C.metal} />
      <B p={[1.3, 0.03, 0.9]} s={[0.06, 0.04, 0.5]} c={C.metal} />
      <B p={[1.3, 0.07, 1.12]} s={[0.05, 0.35, 0.05]} c={C.metal} />
      <B p={[1.05, 0.42, 0.9]} s={[0.5, 0.08, 0.5]} c="#2d2f36" />
      <B p={[1.02, 0.6, 0.95]} s={[0.04, 0.03, 0.35]} c="#2d2f36" />
      <B p={[1.54, 0.6, 0.95]} s={[0.04, 0.03, 0.35]} c="#2d2f36" />
      {/* legs */}
      <B p={[1.12, 0.45, 0.62]} s={[0.36, 0.12, 0.4]} c={C.jeans} />
      <B p={[1.13, 0.05, 0.55]} s={[0.14, 0.4, 0.12]} c={C.jeans} />
      <B p={[1.35, 0.05, 0.55]} s={[0.14, 0.4, 0.12]} c={C.jeans} />
      <B p={[1.12, 0, 0.48]} s={[0.16, 0.06, 0.2]} c="#e8e8e8" />
      <B p={[1.34, 0, 0.48]} s={[0.16, 0.06, 0.2]} c="#e8e8e8" />
      {/* body in my green sweater; the arms sit outside the chair back so they show
          from behind: shoulders, upper arms down the sides, forearms out to the keyboard */}
      <B p={[1.12, 0.5, 0.98]} s={[0.36, 0.46, 0.26]} c={C.sweater} />
      <B p={[0.99, 0.64, 0.98]} s={[0.13, 0.3, 0.14]} c={C.sweater} />
      <B p={[1.48, 0.64, 0.98]} s={[0.13, 0.3, 0.14]} c={C.sweater} />
      <B p={[1.02, 0.74, 0.52]} s={[0.1, 0.1, 0.48]} c={C.sweater} />
      <B p={[1.45, 0.74, 0.52]} s={[0.1, 0.1, 0.48]} c={C.sweater} />
      <B p={[1.02, 0.74, 0.52]} s={[0.1, 0.1, 0.04]} c={C.rib} />
      <B p={[1.45, 0.74, 0.52]} s={[0.1, 0.1, 0.04]} c={C.rib} />
      <B mref={(m) => (hands.current[0] = m)} p={[1.07, 0.82, 0.43]} s={[0.08, 0.04, 0.1]} c={C.skin} />
      <B mref={(m) => (hands.current[1] = m)} p={[1.43, 0.82, 0.43]} s={[0.08, 0.04, 0.1]} c={C.skin} />
      <B p={[1.17, 0.9, 1.18]} s={[0.26, 0.08, 0.08]} c={C.rib} />
      {/* head, hair, headphones */}
      <group ref={head} userData={{ live: true }}>
        <B p={[1.16, 0.97, 0.95]} s={[0.28, 0.28, 0.27]} c={C.skin} />
        <B p={[1.14, 1.1, 0.96]} s={[0.32, 0.19, 0.29]} c={C.hair} />
        <B p={[1.14, 0.96, 1.15]} s={[0.32, 0.15, 0.08]} c={C.hair} />
        <B p={[1.2, 1.29, 1.0]} s={[0.1, 0.05, 0.12]} c={C.hair} />
        <B p={[1.32, 1.29, 1.08]} s={[0.08, 0.04, 0.1]} c="#2a211c" />
        <B p={[1.16, 1.2, 1.2]} s={[0.1, 0.06, 0.05]} c="#2a211c" />
        <B p={[1.22, 0.92, 1.1]} s={[0.16, 0.06, 0.08]} c={C.skin} />
        <B p={[1.13, 1.29, 1.03]} s={[0.34, 0.04, 0.06]} c="#555b6a" />
        <B p={[1.1, 1.02, 0.99]} s={[0.06, 0.15, 0.15]} c="#555b6a" />
        <B p={[1.42, 1.02, 0.99]} s={[0.06, 0.15, 0.15]} c="#555b6a" />
      </group>
      <B p={[1.07, 0.5, 1.36]} s={[0.46, 0.36, 0.07]} c="#2d2f36" />
    </Obj>
  );
}

function LeftWall() {
  const shelfBooks = [];
  [0.08, 0.45, 0.82, 1.19, 1.56].forEach((y, s) => {
    let z = 1.66;
    for (let i = s * 4; z < 2.4; i++) {
      const w = 0.05 + (i % 3) * 0.02;
      const h = 0.18 + ((i * 7) % 4) * 0.03;
      if (i % 9 !== 4) shelfBooks.push(<B key={`${s}-${i}`} p={[0.2, y, z]} s={[0.23, h, w]} c={BOOKS[(i * 5) % BOOKS.length]} />);
      z += w + 0.01;
    }
  });
  return (
    <>
      {/* floating shelves: trophy, medal, plant */}
      <Obj id="trophies">
        <B p={[0, 1.45, 0.05]} s={[0.28, 0.04, 1.05]} c={C.wood} />
        <B p={[0, 1.85, 0.05]} s={[0.28, 0.04, 1.05]} c={C.wood} />
        {Array.from({ length: 10 }, (_, i) => (
          <B key={i} p={[0.03, 1.49, 0.35 + i * 0.065]} s={[0.2, 0.2 + (i % 3) * 0.03, 0.055]} c={BOOKS[(i * 4) % BOOKS.length]} />
        ))}
        <B p={[0.05, 1.89, 0.1]} s={[0.14, 0.12, 0.14]} c="#e8e4dc" />
        <B p={[0.03, 2.0, 0.08]} s={[0.18, 0.12, 0.18]} c="#3f8a4a" />
        <B p={[0.2, 1.55, 0.12]} s={[0.05, 0.4, 0.05]} c="#3f8a4a" />
        <B p={[0.21, 1.65, 0.2]} s={[0.04, 0.3, 0.04]} c="#4fa05a" />
        <B p={[0.06, 1.89, 0.42]} s={[0.12, 0.05, 0.12]} c="#2a2a30" />
        <B p={[0.05, 1.94, 0.41]} s={[0.14, 0.16, 0.14]} c="#d4a82a" e="#5a4010" ei={0.6} />
        <B p={[0.02, 1.96, 0.72]} s={[0.02, 0.2, 0.06]} c="#2d5bd1" />
        <B p={[0.02, 1.88, 0.715]} s={[0.03, 0.08, 0.07]} c="#d4a82a" e="#5a4010" ei={0.6} />
        <B p={[0.02, 1.89, 0.88]} s={[0.03, 0.14, 0.14]} c="#e0dccf" />
      </Obj>
      {/* UTM pennant */}
      <Obj id="pennant">
        <B p={[0.02, 2.55, 1.25]} s={[0.02, 0.02, 0.4]} c={C.wood} />
        {Array.from({ length: 8 }, (_, i) => {
          const w = 0.36 - i * 0.045;
          return <B key={i} p={[0.01, 2.55 - 0.07 * (i + 1), 1.45 - w / 2]} s={[0.02, 0.07, w]} c="#1c2a55" />;
        })}
        <B p={[0.031, 2.36, 1.4]} s={[0.005, 0.1, 0.1]} c="#e8e8f0" />
        <B p={[0.031, 2.25, 1.35]} s={[0.005, 0.04, 0.2]} c="#e8e8f0" />
      </Obj>
      {/* bookshelf */}
      <Obj id="resume">
        <B p={[0, 0, 1.6]} s={[0.42, 1.9, 0.9]} c={C.wood} />
        {[0.08, 0.45, 0.82, 1.19, 1.56].map((y) => (
          <B key={y} p={[0.3, y, 1.65]} s={[0.121, 0.3, 0.8]} c="#2a1a10" />
        ))}
        {shelfBooks}
        <B p={[0.12, 1.9, 1.72]} s={[0.14, 0.12, 0.14]} c="#e8e4dc" />
        <B p={[0.1, 2.02, 1.7]} s={[0.18, 0.16, 0.18]} c="#3f8a4a" />
      </Obj>
      <Obj id="uae">
        <B p={[0.15, 1.9, 2.3]} s={[0.02, 0.32, 0.02]} c="#999999" />
        <B p={[0.15, 2.1, 2.32]} s={[0.012, 0.12, 0.05]} c="#ce1126" />
        <B p={[0.15, 2.18, 2.37]} s={[0.012, 0.04, 0.16]} c="#00732f" />
        <B p={[0.15, 2.14, 2.37]} s={[0.012, 0.04, 0.16]} c="#f4f4f4" />
        <B p={[0.15, 2.1, 2.37]} s={[0.012, 0.04, 0.16]} c="#111111" />
      </Obj>
      {/* hoodie on a hook, backpack */}
      <Obj id="hoodie">
        <B p={[0, 1.62, 2.68]} s={[0.06, 0.03, 0.03]} c="#999999" />
        <B p={[0.02, 1.05, 2.6]} s={[0.12, 0.58, 0.22]} c="#1b2440" />
        <B p={[0.03, 1.55, 2.63]} s={[0.1, 0.1, 0.16]} c="#1b2440" />
      </Obj>
      <Obj id="backpack">
        <B p={[0.4, 0, 2.55]} s={[0.28, 0.45, 0.2]} c="#1d1e24" />
        <B p={[0.42, 0.06, 2.75]} s={[0.24, 0.22, 0.03]} c="#26272e" />
        <B p={[0.5, 0.3, 2.751]} s={[0.07, 0.07, 0.005]} c="#e8e8f0" />
      </Obj>
      {/* door (Services) */}
      <Obj id="services">
        <B p={[0, 0, 2.85]} s={[0.06, 2.16, 0.95]} c="#2c2c30" />
        <B p={[0.02, 0, 2.9]} s={[0.05, 2.1, 0.85]} c="#3d3d44" />
        <B p={[0.071, 1.15, 2.98]} s={[0.005, 0.8, 0.69]} c="#35353b" />
        <B p={[0.071, 0.15, 2.98]} s={[0.005, 0.85, 0.69]} c="#35353b" />
        <B p={[0.07, 1.0, 3.6]} s={[0.05, 0.03, 0.1]} c="#b8b8c0" />
        <B p={[0.06, 0.001, 2.92]} s={[0.2, 0.002, 0.8]} c={C.amber} e={C.glow} ei={0.4} />
      </Obj>
    </>
  );
}

function BedCorner({ reduce, day }) {
  const lamp = useRef();
  useFrame(({ clock }) => {
    if (lamp.current) lamp.current.intensity = (day ? 0.3 : 2.5) * (reduce ? 1 : 1 + 0.05 * wave(clock.elapsedTime, 5, 1));
  });
  const blanketDots = Array.from({ length: 9 }, (_, i) => (
    <B key={i} p={[0.62 + ((i * 0.37) % 1.25), 0.541, 4.36 + ((i * 0.53) % 1.0)]} s={[0.12, 0.002, 0.12]} c="#1a2442" />
  ));
  return (
    <>
      <Obj id="nightstand">
        <B p={[0, 0, 3.85]} s={[0.42, 0.5, 0.42]} c={C.wood} />
        <B p={[0.421, 0.3, 3.9]} s={[0.005, 0.015, 0.32]} c={C.darkWood} />
        <B p={[0.1, 0.5, 3.95]} s={[0.1, 0.04, 0.1]} c="#e8e4dc" />
        <B p={[0.14, 0.54, 3.99]} s={[0.02, 0.06, 0.02]} c="#999999" />
        <B p={[0.07, 0.6, 3.92]} s={[0.16, 0.14, 0.16]} c={C.amber} e={C.glow} ei={day ? 0.25 : 0.9} />
        <B p={[0.2, 0.5, 4.05]} s={[0.18, 0.05, 0.2]} c="#1f2a44" />
        <B p={[0.21, 0.55, 4.06]} s={[0.16, 0.04, 0.18]} c="#6a6a70" />
      </Obj>
      <pointLight ref={lamp} position={[0.35, 0.8, 4.1]} color="#ffb35c" intensity={2.5} distance={3} decay={1.6} />
      {/* Messi's Argentina #10, framed over the bed */}
      <Obj id="messi">
        <B p={[0, 1.2, 4.45]} s={[0.03, 0.9, 0.8]} c="#141418" />
        <Pic p={[0.032, 1.24, 4.49]} w={0.72} h={0.82} art={MESSI_ART} face="x" />
      </Obj>
      <Obj id="bed">
        <B p={[0, 0, 4.3]} s={[2.0, 0.3, 1.15]} c="#6b4428" />
        <B p={[0, 0.3, 4.3]} s={[0.07, 0.55, 1.15]} c="#6b4428" />
        <B p={[0.07, 0.3, 4.33]} s={[1.9, 0.14, 1.09]} c="#e3e3e3" />
        <B p={[0.1, 0.44, 4.45]} s={[0.35, 0.1, 0.85]} c="#f0f0f0" />
        <B p={[0.55, 0.44, 4.3]} s={[1.47, 0.1, 1.17]} c="#26345a" />
        {blanketDots}
        <B p={[1.4, 0.54, 4.6]} s={[0.14, 0.04, 0.09]} c="#1a1a1f" />
        <B p={[1.44, 0.58, 4.6]} s={[0.06, 0.004, 0.01]} c={C.blue} e={C.blue} />
      </Obj>
      {/* rug */}
      <B p={[2.1, 0, 1.6]} s={[2.6, 0.012, 2.6]} c="#8a8d98" />
      <B p={[2.2, 0.001, 1.7]} s={[2.4, 0.012, 2.4]} c="#34406a" />
      <B p={[2.45, 0.002, 1.95]} s={[1.9, 0.012, 1.9]} c="#6c6f7a" />
      <B p={[2.5, 0.003, 2.0]} s={[1.8, 0.012, 1.8]} c="#34406a" />
    </>
  );
}

function RightSide({ acts, reduce }) {
  const ball = useRef();
  const pong = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // football: rolls off toward the bed and back (2.4s), with a little hop
    if (ball.current) {
      const k = reduce ? 1 : Math.min(1, since(acts, "soccer", t) / 2.4);
      const dx = -1.3 * Math.sin(Math.PI * k);
      ball.current.position.x = 3.51 + dx;
      ball.current.position.y = 0.11 + (k < 0.12 ? Math.sin((k / 0.12) * Math.PI) * 0.1 : 0);
      ball.current.rotation.z = -dx / 0.11;
    }
    // ping-pong ball: bounces on the dresser and settles
    if (pong.current) {
      const s = since(acts, "paddle", t);
      pong.current.position.y = 0.84 + (s < 1.8 && !reduce ? Math.abs(Math.sin(s * 9)) * 0.25 * (1 - s / 1.8) : 0);
    }
  });
  const towers = [[2.84, 0.18], [2.94, 0.3], [3.03, 0.22], [3.12, 0.46], [3.22, 0.26], [3.3, 0.16]];
  return (
    <>
      {/* Abu Dhabi skyline poster */}
      <Obj id="abudhabi">
        <B p={[2.72, 1.32, 0]} s={[0.76, 0.9, 0.03]} c="#1a1a1e" />
        <B p={[2.76, 1.36, 0.031]} s={[0.68, 0.82, 0.004]} c="#e8e2d4" />
        <B p={[2.8, 1.4, 0.036]} s={[0.6, 0.74, 0.004]} c="#f0a35e" e="#4a2610" ei={0.5} />
        <B p={[3.2, 1.86, 0.041]} s={[0.1, 0.1, 0.004]} c="#ffe08a" e="#ffe08a" ei={0.6} />
        {towers.map(([x, h]) => (
          <B key={x} p={[x, 1.46, 0.042]} s={[0.07, h, 0.004]} c="#2a2438" />
        ))}
        <B p={[2.8, 1.4, 0.046]} s={[0.6, 0.07, 0.004]} c="#2b4a7a" />
      </Obj>
      <Obj id="laundry">
        <B p={[5.4, 0, 0.2]} s={[0.42, 0.42, 0.38]} c="#24252b" />
        {[0, 1, 2, 3].map((i) => (
          <B key={i} p={[5.45 + i * 0.1, 0.05, 0.581]} s={[0.04, 0.32, 0.004]} c="#15151a" />
        ))}
        <B p={[5.43, 0.42, 0.23]} s={[0.36, 0.06, 0.32]} c="#d8d8dc" />
        <B p={[5.5, 0.48, 0.3]} s={[0.12, 0.03, 0.1]} c="#1f2a44" />
      </Obj>
      <Obj id="tvstand">
        <B p={[5.0, 0, 2.3]} s={[0.75, 0.4, 0.7]} c={C.darkWood} />
        <B p={[5.02, 0.18, 2.681]} s={[0.71, 0.012, 0.005]} c="#2a1a10" />
        <B p={[5.3, 0.18, 2.681]} s={[0.02, 0.14, 0.006]} c="#999999" />
      </Obj>
      {/* football: pivots at its centre so it can roll */}
      <Obj id="soccer">
        <group ref={ball} position={[3.51, 0.11, 4.66]} userData={{ live: true }}>
          <B p={[-0.11, -0.11, -0.11]} s={[0.22, 0.22, 0.22]} c="#f2f2f2" />
          <B p={[-0.04, 0.111, -0.04]} s={[0.08, 0.002, 0.08]} c="#111111" />
          <B p={[0.111, -0.04, -0.04]} s={[0.002, 0.08, 0.08]} c="#111111" />
          <B p={[-0.04, -0.04, 0.111]} s={[0.08, 0.08, 0.002]} c="#111111" />
        </group>
      </Obj>
      {/* dresser: skills books, paddle, bottle, cube */}
      <Obj id="skills">
        <B p={[4.9, 0, 3.7]} s={[1.0, 0.82, 0.55]} c="#6b4428" />
        {[0.27, 0.54].map((y) => (
          <B key={y} p={[4.95, y, 4.251]} s={[0.9, 0.015, 0.005]} c={C.darkWood} />
        ))}
        <B p={[5.35, 0.82, 3.75]} s={[0.4, 0.07, 0.3]} c="#2f5d5a" />
        <B p={[5.37, 0.89, 3.77]} s={[0.36, 0.06, 0.28]} c="#7a2a2a" />
        <B p={[5.36, 0.95, 3.76]} s={[0.38, 0.06, 0.29]} c="#2b3f66" />
        <B p={[5.78, 0.82, 3.8]} s={[0.08, 0.26, 0.08]} c="#23262e" />
        <B p={[5.78, 0.82, 4.1]} s={[0.08, 0.08, 0.08]} c="#d83a2e" />
        <B p={[5.781, 0.9, 4.101]} s={[0.078, 0.002, 0.078]} c="#f2d024" />
        <B p={[5.861, 0.83, 4.11]} s={[0.002, 0.06, 0.06]} c="#2e7bd8" />
      </Obj>
      {/* PS4: on its own stand, away from the skills dresser */}
      <Obj id="ps4">
        <B p={[5.15, 0.4, 2.45]} s={[0.3, 0.05, 0.25]} c="#18181c" />
        <B p={[5.15, 0.425, 2.701]} s={[0.3, 0.006, 0.002]} c={C.blue} e={C.blue} />
      </Obj>
      <Obj id="paddle">
        <B p={[4.95, 0.82, 4.02]} s={[0.17, 0.012, 0.15]} c="#c62828" />
        <B p={[5.12, 0.82, 4.07]} s={[0.12, 0.02, 0.05]} c="#b07a45" />
        <group ref={pong} position={[5.3, 0.84, 4.17]} userData={{ live: true }}>
          <B p={[-0.02, -0.02, -0.02]} s={[0.04, 0.04, 0.04]} c="#f5a623" />
        </group>
      </Obj>
    </>
  );
}

// Light switch by the door: flips the room between night and day.
function LightSwitch({ day }) {
  return (
    <Obj id="lights">
      <B p={[0, 1.1, 3.88]} s={[0.025, 0.18, 0.12]} c="#e8e4dc" />
      <B p={[0.026, day ? 1.2 : 1.13, 3.92]} s={[0.02, 0.05, 0.04]} c={day ? C.amber : "#77777f"} e={day ? C.glow : undefined} ei={0.5} />
    </Obj>
  );
}

// Seasonal touches, switched on by date (components/room/season.js): string
// lights in December, diyas and a rangoli by the door for Diwali, a lantern for
// Eid, a jack-o'-lantern at the end of October.
const BULBS = ["#ff5a5a", C.amber, "#5ee08a", "#6fb6ff"];
function Decorations({ deco, reduce }) {
  const bulbs = useRef([]);
  const flames = useRef([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    bulbs.current.forEach((m, i) => m && (m.material.emissiveIntensity = reduce ? 0.9 : (Math.floor(t * 2) + i) % 2 ? 1 : 0.25));
    flames.current.forEach((m, i) => m && !reduce && (m.scale.y = 1 + 0.25 * Math.sin(t * 11 + i * 2)));
  });
  return (
    <group userData={{ live: true }}>
      {deco.lights ? (
        <>
          <B p={[3.58, 2.265, 0.05]} s={[1.66, 0.006, 0.006]} c="#1d1e24" />
          {Array.from({ length: 21 }, (_, i) => (
            <B key={i} mref={(m) => (bulbs.current[i] = m)} p={[3.6 + i * 0.078, 2.225 - (i % 2) * 0.012, 0.045]} s={[0.022, 0.035, 0.022]} c={BULBS[i % 4]} e={BULBS[i % 4]} />
          ))}
        </>
      ) : null}
      {deco.diyas ? (
        <>
          {[["#c2185b", 0.4], ["#ff9800", 0.3], ["#fdd835", 0.2], ["#ffffff", 0.08]].map(([c, w], k) => (
            <B key={c} p={[0.5 - w / 2, 0.001 + k * 0.0005, 3.3 - w / 2]} s={[w, 0.002, w]} c={c} />
          ))}
          {[[0.24, 3.04], [0.7, 3.04], [0.24, 3.5], [0.7, 3.5]].map(([x, z], i) => (
            <group key={i}>
              <B p={[x, 0, z]} s={[0.07, 0.03, 0.07]} c="#a0522d" />
              <B mref={(m) => (flames.current[i] = m)} p={[x + 0.025, 0.03, z + 0.025]} s={[0.02, 0.045, 0.02]} c="#ffd27a" e="#ffb347" />
            </group>
          ))}
          <pointLight position={[0.5, 0.25, 3.3]} color="#ffb347" intensity={1.5} distance={1.5} decay={1.6} />
        </>
      ) : null}
      {deco.lantern ? (
        <>
          <B p={[5.02, 1.98, 0.08]} s={[0.006, 0.28, 0.006]} c="#8a6d2f" />
          <B p={[4.99, 1.98, 0.05]} s={[0.07, 0.02, 0.07]} c="#8a6d2f" />
          <B p={[4.98, 1.86, 0.04]} s={[0.09, 0.12, 0.09]} c="#f4c95d" e="#ffcf6b" ei={0.9} />
        </>
      ) : null}
      {deco.pumpkin ? (
        <>
          <B p={[2.55, 0, 4.95]} s={[0.24, 0.17, 0.22]} c="#e07a1f" />
          <B p={[2.65, 0.17, 5.04]} s={[0.04, 0.05, 0.04]} c="#3f8a4a" />
          <B p={[2.59, 0.09, 5.171]} s={[0.04, 0.03, 0.004]} c="#ffb347" e="#ffb347" />
          <B p={[2.71, 0.09, 5.171]} s={[0.04, 0.03, 0.004]} c="#ffb347" e="#ffb347" />
          <B p={[2.61, 0.035, 5.171]} s={[0.13, 0.025, 0.004]} c="#ffb347" e="#ffb347" />
        </>
      ) : null}
    </group>
  );
}

// Soft contact shadows under the furniture, plus a darker band where floor meets wall.
function Shadows() {
  const blobs = [
    [-0.05, 4.2, 2.2, 1.35], [-0.05, 3.8, 0.55, 0.55], [-0.05, 0, 2.7, 0.9], [2.55, 0.05, 0.4, 0.6],
    [0.95, 0.8, 0.75, 0.75], [-0.05, 1.55, 0.55, 1.0], [0.35, 2.5, 0.4, 0.35], [4.8, 3.6, 1.25, 0.8],
    [4.95, 2.3, 1.05, 1.0], [5.3, 0.1, 0.6, 0.55], [3.8, 0.15, 1.2, 0.5], [3.35, 4.5, 0.32, 0.32],
  ];
  return (
    <>
      {blobs.map(([x, z, w, d], i) => (
        <Shadow key={i} x={x} z={z} w={w} d={d} y={0.02 + i * 0.0005} />
      ))}
      <Shadow x={-0.3} z={0} w={0.8} d={6} o={0.35} y={0.018} />
      <Shadow x={0} z={-0.3} w={6} d={0.8} o={0.35} y={0.019} />
    </>
  );
}

export default function Scene({ reduce, musicPlaying, songPlaying, catJumpAt, day, weather = "clear", deco = {}, acts, lampOn = true, lightningAt }) {
  return (
    <>
      <ambientLight color={day ? "#fff4e0" : "#8088c0"} intensity={day ? 1.5 : 0.75} />
      <pointLight position={[3, 2.4, 3]} color="#ffb070" intensity={day ? 0 : 3} distance={7} decay={1.2} />
      <directionalLight color={day ? "#ffe7b0" : "#6d8cff"} intensity={day ? 1.8 : 0.5} position={[4.4, 3, -3]} />
      <Merge>
        <Shell />
        <WindowView reduce={reduce} day={day} weather={weather} crescent={deco.lantern} lightningAt={lightningAt} />
        <Window catJumpAt={catJumpAt} reduce={reduce} day={day} />
        <Decorations deco={deco} reduce={reduce} />
        <Piano playing={musicPlaying} reduce={reduce} />
        <LeftWall />
        <LightSwitch day={day} />
        <Desk reduce={reduce} songPlaying={songPlaying} day={day} acts={acts} lampOn={lampOn} />
        <Me reduce={reduce} />
        <BedCorner reduce={reduce} day={day} />
        <RightSide acts={acts} reduce={reduce} />
      </Merge>
      <Shadows />
    </>
  );
}

"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import Scene from "./Scene";
import { RoomCtx } from "./parts";
import { makeCamera } from "./camera";
import { toScreen, TARGET } from "@/components/room/projection";
import { ROOM_OBJECTS, CAT_REACTIONS, PHOTOS } from "@/components/room/roomObjects";
import { PixelPhoto } from "@/components/room/easter-eggs/PhotoFrame";
import { useToggleAudio } from "@/hooks/useToggleAudio";
import RoomImage from "@/components/room/RoomImage";

const OBJECTS = ROOM_OBJECTS.filter((o) => o.anchor);
const BY_ID = Object.fromEntries(OBJECTS.map((o) => [o.id, o]));
const PIXELS = 420; // render width in real pixels; CSS scales it up nearest-neighbour

function FirstFrame({ onReady }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    onReady();
  });
  return null;
}

// Slides and zooms the camera onto the clicked object before navigating.
function CameraRig({ focus }) {
  const anim = useRef(null);
  useFrame(({ camera }, dt) => {
    if (!focus) return;
    if (!anim.current) {
      anim.current = { from: camera.position.clone(), off: new Vector3(...focus).sub(new Vector3(...TARGET)), k: 0 };
    }
    const a = anim.current;
    a.k = Math.min(1, a.k + dt / 0.35);
    const e = a.k * a.k;
    camera.position.copy(a.from).addScaledVector(a.off, e);
    camera.zoom = 1 + 2 * e;
    camera.updateProjectionMatrix();
  });
  return null;
}

export default function Room3D() {
  const router = useRouter();
  const camera = useMemo(makeCamera, []);
  const screen = useMemo(() => Object.fromEntries(OBJECTS.map((o) => [o.id, toScreen(o.anchor)])), []);
  const [ready, setReady] = useState(false);
  const wrap = useRef(null);
  const [dpr, setDpr] = useState(0.5);
  const [onScreen, setOnScreen] = useState(true);
  const [day, setDay] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [tip, setTip] = useState(null); // { id, text } | { id, photo }
  const [focus, setFocus] = useState(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  const catJumpAt = useRef(null);
  const clock = useRef(null);
  const tipTimer = useRef(null);
  const reduce = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const music = useToggleAudio(BY_ID.music.src);
  const song = useToggleAudio(BY_ID.song.src, true);

  const activate = useCallback(
    (id) => {
      const o = BY_ID[id];
      clearTimeout(tipTimer.current);
      if (o.kind === "nav") {
        if (reduce) return router.push(o.href);
        setTip(null);
        setFocus(o.anchor);
        setTimeout(() => router.push(o.href), 330);
      } else if (o.kind === "audio") {
        const a = id === "music" ? music : song;
        setTip(a.playing ? null : { id, text: "♪ now playing (click again to stop)" });
        a.toggle();
      } else if (o.kind === "cat") {
        catJumpAt.current = clock.current?.elapsedTime ?? 0;
        setTip({ id, text: CAT_REACTIONS[Math.floor(Math.random() * CAT_REACTIONS.length)] });
        tipTimer.current = setTimeout(() => setTip(null), 1500);
      } else if (o.kind === "switch") {
        setDay((d) => !d);
        setTip({ id, text: day ? "Night mode 🌙" : "Good morning ☀️" });
        tipTimer.current = setTimeout(() => setTip(null), 1500);
      } else if (o.kind === "photo") {
        setPhotoIdx((i) => (tip?.id === "photo" ? (i + 1) % PHOTOS.length : i));
        setTip({ id, photo: true });
      } else {
        setTip((t) => (t?.id === id ? null : { id, text: o.tooltip }));
      }
    },
    [router, reduce, music, song, tip, day]
  );

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  // Render at a fixed PIXELS width whatever the on-screen size, so the room is equally chunky everywhere.
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setDpr(Math.min(2, PIXELS / Math.max(1, e.contentRect.width))));
    ro.observe(wrap.current);
    // Stop rendering entirely while the room is scrolled out of view.
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(wrap.current);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const ctx = useMemo(() => ({ hovered, setHovered, activate }), [hovered, activate]);

  return (
    <div ref={wrap} className="room3d absolute inset-0" style={{ opacity: focus ? 0 : 1, transition: "opacity 0.35s ease-in" }}>
      <Canvas
        camera={camera}
        dpr={dpr}
        frameloop={onScreen ? "always" : "never"}
        gl={{ antialias: false }}
        flat
        onCreated={(s) => (clock.current = s.clock)}
        onPointerMissed={() => setTip(null)}
      >
        <color attach="background" args={["#1c1c22"]} />
        <FirstFrame onReady={() => setReady(true)} />
        <CameraRig focus={focus} />
        <RoomCtx.Provider value={ctx}>
          <Scene reduce={reduce} musicPlaying={music.playing} songPlaying={song.playing} catJumpAt={catJumpAt} day={day} />
        </RoomCtx.Provider>
      </Canvas>

      {/* Labels + keyboard access. Nav labels are real links; everything else is a
          focusable button that is click-through for the mouse (the 3D handles that). */}
      {!focus &&
        OBJECTS.map((o) => {
          const common = {
            "aria-label": o.label,
            style: screen[o.id],
            onFocus: () => setHovered(o.id),
            onBlur: () => setHovered(null),
            onMouseEnter: () => setHovered(o.id),
            onMouseLeave: () => setHovered(null),
          };
          if (o.kind === "nav")
            return (
              <Link key={o.id} {...common} href={o.href} className="room3d-spot is-nav" onClick={(e) => { e.preventDefault(); activate(o.id); }}>
                <span className="room-label room-label--nav">{o.label}</span>
              </Link>
            );
          return <button key={o.id} {...common} type="button" className="room3d-spot" onClick={() => activate(o.id)} />;
        })}

      {tip && !focus ? (
        <div role="status" className="room-label room3d-tip" style={screen[tip.id]}>
          {tip.photo ? <PixelPhoto src={PHOTOS[photoIdx]} /> : tip.text}
        </div>
      ) : null}
      {hovered && !tip && BY_ID[hovered].kind !== "nav" ? (
        <div className="room-label room3d-tip" style={screen[hovered]} aria-hidden="true">
          {BY_ID[hovered].label}
        </div>
      ) : null}

      {!ready ? <RoomImage /> : null}
    </div>
  );
}

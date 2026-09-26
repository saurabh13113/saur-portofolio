"use client";
import { Component, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import RoomImage from "@/components/room/RoomImage";

// three.js only loads in the browser, after the page is up; until then, without
// WebGL, or if the 3D room crashes, visitors get the picture version of the room.
// No loading fallback: RoomStage keeps the picture up itself (see below).
const Room3D = dynamic(() => import("@/components/room/3d/Room3D"), { ssr: false });

// true once the visitor interacts (tap, key, scroll) or the page has gone quiet
// after loading. The heavy 3D (three.js) waits for this, so the first paint and
// the first taps stay fast; the room picture / photo stand in until then.
export function useWakeUp() {
  const [awake, setAwake] = useState(false);
  useEffect(() => {
    const wake = () => setAwake(true);
    const events = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, wake, { once: true, passive: true }));
    let idle;
    const afterLoad = () => {
      const t = setTimeout(() => (idle = (window.requestIdleCallback ?? setTimeout)(wake, { timeout: 2000 })), 1500);
      idle = t;
    };
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
    return () => {
      events.forEach((e) => window.removeEventListener(e, wake));
      window.removeEventListener("load", afterLoad);
      clearTimeout(idle);
      window.cancelIdleCallback?.(idle);
    };
  }, []);
  return awake;
}

export function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

class FallbackOnError extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.error("[room] 3D room failed, showing the picture instead:", err);
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function RoomStage() {
  const [webgl, setWebgl] = useState(null); // null until checked in the browser
  useEffect(() => setWebgl(hasWebGL()), []);
  const awake = useWakeUp();
  const [ready, setReady] = useState(false); // the 3D has drawn its first frame
  const [failed, setFailed] = useState(false);

  // The picture is one stable element that stays on top until the 3D is ready.
  // (Swapping it out when the 3D starts loading would swallow the click that
  // woke it, e.g. a tap on a room label.)
  return (
    <>
      {webgl && awake && !failed ? (
        <FallbackOnError onFail={() => setFailed(true)}>
          <Room3D onReady={() => setReady(true)} />
        </FallbackOnError>
      ) : null}
      {!ready || failed ? <RoomImage /> : null}
    </>
  );
}

"use client";
import { Component, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import RoomImage from "@/components/room/RoomImage";

// three.js only loads in the browser, after the page is up; until then, without
// WebGL, or if the 3D room crashes, visitors get the picture version of the room.
const Room3D = dynamic(() => import("@/components/room/3d/Room3D"), {
  ssr: false,
  loading: () => <RoomImage />,
});

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
  }
  render() {
    return this.state.failed ? <RoomImage /> : this.props.children;
  }
}

export default function RoomStage() {
  const [webgl, setWebgl] = useState(null); // null until checked in the browser
  useEffect(() => setWebgl(hasWebGL()), []);

  if (!webgl) return <RoomImage />;
  return (
    <FallbackOnError>
      <Room3D />
    </FallbackOnError>
  );
}

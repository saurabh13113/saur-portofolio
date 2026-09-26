"use client";
import { useState } from "react";

// Chunky button that sinks into its shadow while pressed.
export default function BlockButton({ tex = "plank", className = "", children, ...rest }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type="button"
      className={`group relative mc-bevel tex-${tex} font-mc uppercase tracking-wide px-5 py-3 text-[#f4e4c1] select-none focus:outline focus:outline-2 focus:outline-white ${
        pressed ? "mc-bevel--pressed" : ""
      } ${className}`}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      {...rest}
    >
      {children}
    </button>
  );
}

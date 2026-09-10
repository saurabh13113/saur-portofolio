"use client";
import { useState } from "react";
import { useSfx } from "@/hooks/useSfx";

export default function BlockButton({
  tex = "plank",
  sfx = "click",
  className = "",
  onClick,
  children,
  ...rest
}) {
  const [pressed, setPressed] = useState(false);
  const { play } = useSfx();
  return (
    <button
      type="button"
      className={`mc-bevel tex-${tex} font-mc uppercase tracking-wide px-5 py-3 text-[#f4e4c1] select-none focus:outline focus:outline-2 focus:outline-white ${
        pressed ? "mc-bevel--pressed" : ""
      } ${className}`}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={(e) => {
        play(sfx);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

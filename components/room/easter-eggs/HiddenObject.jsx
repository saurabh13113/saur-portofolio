// components/room/easter-eggs/HiddenObject.jsx
"use client";
import { useState } from "react";

// tooltipAlign: "center" (default) | "right" — right-anchors the tooltip so it grows
// leftward instead of overflowing the room's right edge for objects placed near it.
// tooltipSide: "bottom" (default) | "top" — flips the tooltip above the icon for
// objects placed near the room's bottom edge, so it isn't clipped by overflow-hidden.
export default function HiddenObject({
  icon,
  label,
  tooltip,
  style,
  tooltipAlign = "center",
  tooltipSide = "bottom",
}) {
  const [open, setOpen] = useState(false);

  const tooltipPositionClass = [
    tooltipAlign === "right" ? "right-0" : "left-1/2 -translate-x-1/2",
    tooltipSide === "top" ? "bottom-full mb-1" : "top-full mt-1",
  ].join(" ");

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={style}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="min-w-11 min-h-11 flex items-center justify-center text-xl opacity-70 hover:opacity-100 focus:outline focus:outline-2 focus:outline-white"
      >
        {icon}
      </button>
      {open ? (
        <div
          role="status"
          className={`absolute z-10 whitespace-nowrap mc-bevel tex-obsidian px-2 py-1 text-[10px] font-mc text-[#a8f0c0] ${tooltipPositionClass}`}
        >
          {tooltip}
        </div>
      ) : null}
    </div>
  );
}

"use client";
import { useState } from "react";

// A drawn object that shows a tooltip when clicked.
export default function HiddenObject({ label, tooltip, style }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={open}
      onClick={() => setOpen((o) => !o)}
      onBlur={() => setOpen(false)}
      className="room-hotspot"
      style={style}
    >
      <span className="room-label" style={open ? { opacity: 1 } : undefined} role={open ? "status" : undefined}>
        {open ? tooltip : label}
      </span>
    </button>
  );
}

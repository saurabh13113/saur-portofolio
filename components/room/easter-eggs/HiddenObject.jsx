// components/room/easter-eggs/HiddenObject.jsx
"use client";
import { useState } from "react";

export default function HiddenObject({ icon, label, tooltip, style }) {
  const [open, setOpen] = useState(false);

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
          className="absolute z-10 top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap mc-bevel tex-obsidian px-2 py-1 text-[10px] font-mc text-[#a8f0c0]"
        >
          {tooltip}
        </div>
      ) : null}
    </div>
  );
}

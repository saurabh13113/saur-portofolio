"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomHotspot({ href, label, icon, style }) {
  const router = useRouter();
  const [zooming, setZooming] = useState(false);

  function handleClick() {
    if (zooming) return;
    setZooming(true);
    setTimeout(() => router.push(href), 260);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      style={style}
      className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-14 min-h-14 mc-bevel tex-plank flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[#f4e4c1] font-mc text-[9px] transition-transform duration-200 hover:scale-110 focus:outline focus:outline-2 focus:outline-white ${
        zooming ? "scale-150 opacity-0" : ""
      }`}
    >
      <span className="text-xl" aria-hidden="true">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

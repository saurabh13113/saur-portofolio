"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Invisible link over a drawn object. On click the whole room zooms into the
// object, then navigates.
export default function RoomHotspot({ href, label, style }) {
  const router = useRouter();

  function handleClick(e) {
    const room = e.currentTarget.closest("[data-room]");
    if (!room || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    const R = room.getBoundingClientRect();
    room.style.transformOrigin = `${r.left + r.width / 2 - R.left}px ${r.top + r.height / 2 - R.top}px`;
    room.style.transition = "transform 0.3s ease-in, opacity 0.3s ease-in";
    room.style.transform = "scale(2.5)";
    room.style.opacity = "0";
    setTimeout(() => router.push(href), 280);
  }

  return (
    <Link href={href} onClick={handleClick} aria-label={label} className="room-hotspot" style={style}>
      <span className="room-label room-label--nav">{label}</span>
    </Link>
  );
}

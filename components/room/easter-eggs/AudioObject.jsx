"use client";
import { useToggleAudio } from "@/hooks/useToggleAudio";

export default function AudioObject({ label, src, loop = false, style }) {
  const { playing, toggle } = useToggleAudio(src, loop);

  return (
    <button
      type="button"
      aria-label={playing ? `Stop: ${label}` : label}
      aria-pressed={playing}
      onClick={toggle}
      className="room-hotspot"
      style={style}
    >
      {playing ? <span className="room-notes" aria-hidden="true">♪ ♫</span> : null}
      <span className="room-label">{playing ? "Stop" : label}</span>
    </button>
  );
}

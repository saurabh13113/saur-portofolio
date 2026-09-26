"use client";
import { useToggleAudio } from "@/hooks/useToggleAudio";
import { useMusic } from "@/hooks/useMusic";

function AudioButton({ label, playing, toggle, style }) {
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

export default function AudioObject({ label, src, loop = false, style }) {
  return <AudioButton label={label} style={style} {...useToggleAudio(src, loop)} />;
}

// The desk speaker: the shared background-music playlist.
export function SpeakerObject({ label, style }) {
  const { playing, toggle } = useMusic();
  return <AudioButton label={label} style={style} playing={playing} toggle={toggle} />;
}

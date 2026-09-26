"use client";
import { useEffect, useRef, useState } from "react";

export default function AudioObject({ label, src, loop = false, style }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => audioRef.current?.pause(), []);

  function toggle() {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = loop;
    }
    const audio = audioRef.current;
    audio.currentTime = 0;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    audio.play().catch(() => {});
    setPlaying(true);
    if (!loop) audio.onended = () => setPlaying(false);
  }

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

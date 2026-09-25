"use client";
import { useEffect, useRef, useState } from "react";

export default function AudioObject({ icon, label, src, loop = false, style }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  function toggle() {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = loop;
    }
    const audio = audioRef.current;

    if (playing) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
      return;
    }

    audio.currentTime = 0;
    audio.play().catch(() => {});
    setPlaying(true);
    if (!loop) audio.onended = () => setPlaying(false);
  }

  return (
    <button
      type="button"
      aria-label={playing ? `Stop ${label}` : label}
      aria-pressed={playing}
      onClick={toggle}
      className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-11 min-h-11 mc-bevel tex-plank flex items-center justify-center text-lg focus:outline focus:outline-2 focus:outline-white ${
        playing ? "outline outline-2 outline-emerald" : ""
      }`}
      style={style}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}

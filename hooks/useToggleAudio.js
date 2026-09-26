"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Click-to-play audio: first toggle plays from the start, second stops. Never autoplays.
export function useToggleAudio(src, loop = false) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => audioRef.current?.pause(), []);

  const toggle = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = loop;
      audioRef.current.onended = () => setPlaying(false);
    }
    const audio = audioRef.current;
    audio.currentTime = 0;
    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }
    audio.play().catch(() => {});
    setPlaying(true);
  }, [src, loop]);

  return { playing, toggle };
}

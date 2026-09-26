"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Click-to-play audio: first toggle plays from the start, second stops. Never autoplays.
// (The desk speaker's playlist is hooks/useMusic.js; it outlives the page.)
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
    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }
    audio.currentTime = 0;
    audio.play().catch(() => setPlaying(false)); // missing/unsupported file
    setPlaying(true);
  }, [src, loop]);

  return { playing, toggle };
}

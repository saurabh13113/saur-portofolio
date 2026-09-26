"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Click-to-play audio: first toggle plays from the start, second stops. Never autoplays.
// src may be a playlist (array, keep it a stable reference): when a track ends the
// next one starts, wrapping around. `track` is the index of the current one.
export function useToggleAudio(src, loop = false) {
  const audioRef = useRef(null);
  const trackRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);

  useEffect(() => () => audioRef.current?.pause(), []);

  const toggle = useCallback(() => {
    const list = [].concat(src);
    const play = (i) => {
      trackRef.current = i;
      setTrack(i);
      audioRef.current.src = list[i];
      audioRef.current.play().catch(() => setPlaying(false));
    };
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = loop && list.length === 1;
      audioRef.current.onended = () => (list.length > 1 ? play((trackRef.current + 1) % list.length) : setPlaying(false));
    }
    if (!audioRef.current.paused) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    play(trackRef.current);
  }, [src, loop]);

  return { playing, toggle, track };
}

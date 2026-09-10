"use client";
import { useCallback, useEffect, useState } from "react";

const FILES = { click: "/sfx/click.mp3", break: "/sfx/break.mp3", orb: "/sfx/orb.mp3" };
const cache = {};

export function useSfx() {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    try {
      setMuted(localStorage.getItem("mc-muted") !== "false");
    } catch {}
  }, []);

  const play = useCallback(
    (name) => {
      if (muted) return;
      const src = FILES[name];
      if (!src) return;
      try {
        let a = cache[name];
        if (!a) {
          a = new Audio(src);
          cache[name] = a;
        }
        a.currentTime = 0;
        a.play().catch(() => {});
      } catch {}
    },
    [muted]
  );

  const toggle = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      try {
        localStorage.setItem("mc-muted", String(next));
      } catch {}
      return next;
    });
  }, []);

  return { muted, play, toggle };
}

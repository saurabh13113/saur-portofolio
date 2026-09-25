"use client";
import { useCallback, useSyncExternalStore } from "react";

const FILES = { click: "/sfx/click.mp3", break: "/sfx/break.mp3", orb: "/sfx/orb.mp3" };
const cache = {};
const listeners = new Set();

function readMuted() {
  try {
    return localStorage.getItem("mc-muted") !== "false";
  } catch {
    return true;
  }
}

let muted = typeof window !== "undefined" ? readMuted() : true;

function setMuted(next) {
  muted = next;
  try {
    localStorage.setItem("mc-muted", String(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useSfx() {
  const isMuted = useSyncExternalStore(
    subscribe,
    () => muted,
    () => true
  );

  const play = useCallback((name) => {
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
  }, []);

  const toggle = useCallback(() => setMuted(!muted), []);

  return { muted: isMuted, play, toggle };
}

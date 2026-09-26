"use client";
import { useSyncExternalStore } from "react";
import { PLAYLIST } from "@/components/room/roomObjects";

// Background music from the desk speaker. It lives at module level, not in a
// component, so it keeps playing while you move between pages (the sidebar
// shows what's on). Plays the playlist in order, round and round. Never autoplays.
let audio = null;
let state = { playing: false, track: 0 };
const listeners = new Set();
const set = (next) => {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
};

function play(i) {
  if (!audio) {
    audio = new Audio();
    audio.onended = () => play((state.track + 1) % PLAYLIST.length);
  }
  set({ track: i, playing: true });
  audio.src = PLAYLIST[i].src;
  audio.play().catch(() => set({ playing: false })); // missing/unsupported file
}

function stop() {
  audio?.pause();
  set({ playing: false });
}

const controls = {
  toggle: () => (state.playing ? stop() : play(state.track)),
  next: () => play((state.track + 1) % PLAYLIST.length),
  stop,
};

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const SERVER = { playing: false, track: 0 };

export function useMusic() {
  const s = useSyncExternalStore(subscribe, () => state, () => SERVER);
  return { ...s, title: PLAYLIST[s.track].title, ...controls };
}

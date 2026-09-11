// Pure logic for the interactive hero scene — no React, no JSX, so it's
// testable with plain node:test. Storage helpers degrade to no-ops/empty
// when localStorage is unavailable (SSR, private browsing, blocked).

export const TOOLS = [
  { id: "pickaxe", label: "Pickaxe", glyph: "⛏️", hitsToBreak: 3 },
  { id: "sword", label: "Sword", glyph: "🗡️", hitsToBreak: 1 },
  { id: "torch", label: "Torch", glyph: "🔥", hitsToBreak: 3 },
  { id: "compass", label: "Compass", glyph: "🧭", hitsToBreak: 3 },
];

export const EMERALD_IDS = ["cloud", "grass", "path"];

export function hitsToBreak(toolId) {
  const t = TOOLS.find((t) => t.id === toolId);
  return t ? t.hitsToBreak : 3;
}

// One click on a block: returns the new hit count and whether it broke.
export function advanceBlock(hits, toolId) {
  const next = hits + 1;
  const need = hitsToBreak(toolId);
  return next >= need ? { hits: 0, broken: true } : { hits: next, broken: false };
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function loadFoundEmeralds() {
  const found = readJSON("mc-emeralds", []);
  return Array.isArray(found) ? found.filter((id) => EMERALD_IDS.includes(id)) : [];
}

export function saveFoundEmeralds(found) {
  writeJSON("mc-emeralds", found);
}

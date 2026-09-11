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

// Minimal 2D platformer physics — real gravity/jump/collision, no physics
// engine. Coordinates are "bottom-up" px within the scene (y = distance from
// the floor), matching the CSS `bottom` property directly.
// ponytail: fixed 60fps-ish step (no delta-time) — fine for a decorative
// widget; add delta-time if it ever feels off on very high refresh displays.
export const PHYSICS = {
  gravity: 0.9,
  jumpVelocity: 15,
  moveSpeed: 3,
  groundY: 16,
  playerWidth: 26,
};

function surfaceAt(x, platforms) {
  let best = PHYSICS.groundY;
  for (const p of platforms) {
    if (x + PHYSICS.playerWidth > p.left && x < p.right) {
      best = Math.max(best, p.top);
    }
  }
  return best;
}

export function isOnSurface(x, y, platforms) {
  return y <= surfaceAt(x, platforms) + 0.5;
}

// state: {x, y, vy, facing}. input: {left, right, jump}.
// platforms: [{left, right, top}] — solid surfaces the player can stand on.
export function stepPhysics(state, input, platforms, sceneWidth) {
  let { x, vy, facing } = state;
  const { y } = state;

  if (input.left) {
    x -= PHYSICS.moveSpeed;
    facing = -1;
  }
  if (input.right) {
    x += PHYSICS.moveSpeed;
    facing = 1;
  }
  x = Math.max(0, Math.min(Math.max(0, sceneWidth - PHYSICS.playerWidth), x));

  if (input.jump && isOnSurface(x, y, platforms)) {
    vy = PHYSICS.jumpVelocity;
  }

  vy -= PHYSICS.gravity;
  let newY = y + vy;

  const surface = surfaceAt(x, platforms);
  if (vy <= 0 && newY <= surface) {
    newY = surface;
    vy = 0;
  }

  return { x, y: newY, vy, facing };
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

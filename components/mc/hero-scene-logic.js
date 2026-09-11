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

// Minimal 3D platformer physics — real gravity/jump/collision, no physics
// engine (no cannon/rapier). World units are three.js scene units (1 = 1m),
// y is up, ground is y=0. x/z is the horizontal plane; movement is
// world-axis-aligned (not camera-relative) — the simplest thing that still
// feels right for a fixed chase camera.
// ponytail: fixed-step integration (no delta-time) driven by r3f's useFrame;
// add delta-time scaling if it ever feels off on very high refresh displays.
export const PHYSICS_3D = {
  gravity: 0.025,
  jumpVelocity: 0.42,
  moveSpeed: 0.08,
  groundY: 0,
  playerRadius: 0.35,
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// platforms: [{minX, maxX, minZ, maxZ, top}] — solid boxes the player can
// stand on, in world x/z with their top surface height.
function surfaceAt3D(x, z, platforms) {
  let best = PHYSICS_3D.groundY;
  const r = PHYSICS_3D.playerRadius;
  for (const p of platforms) {
    if (x + r > p.minX && x - r < p.maxX && z + r > p.minZ && z - r < p.maxZ) {
      best = Math.max(best, p.top);
    }
  }
  return best;
}

export function isOnSurface3D(x, y, z, platforms) {
  return y <= surfaceAt3D(x, z, platforms) + 0.02;
}

// state: {x, y, z, vy, rotY}. input: {forward, back, left, right, jump}.
export function stepPhysics3D(state, input, platforms, bounds) {
  let { x, z, vy, rotY } = state;
  const { y } = state;

  let dx = 0;
  let dz = 0;
  if (input.forward) dz -= 1;
  if (input.back) dz += 1;
  if (input.left) dx -= 1;
  if (input.right) dx += 1;
  if (dx !== 0 || dz !== 0) {
    const len = Math.hypot(dx, dz);
    dx = (dx / len) * PHYSICS_3D.moveSpeed;
    dz = (dz / len) * PHYSICS_3D.moveSpeed;
    rotY = Math.atan2(dx, dz);
  }
  x = clamp(x + dx, bounds.minX, bounds.maxX);
  z = clamp(z + dz, bounds.minZ, bounds.maxZ);

  if (input.jump && isOnSurface3D(x, y, z, platforms)) {
    vy = PHYSICS_3D.jumpVelocity;
  }

  vy -= PHYSICS_3D.gravity;
  let newY = y + vy;

  const surface = surfaceAt3D(x, z, platforms);
  if (vy <= 0 && newY <= surface) {
    newY = surface;
    vy = 0;
  }

  return { x, y: newY, z, vy, rotY };
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

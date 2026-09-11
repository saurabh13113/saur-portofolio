// Pure logic for the site-wide playable character — no React, no DOM, so
// it's testable with plain node:test. localStorage helpers degrade to
// no-ops/fallback when unavailable (SSR, private browsing, blocked).

export const CHAR = {
  gravity: 0.9,
  jumpVelocity: 15,
  moveSpeed: 3,
  width: 26,
};

function surfaceAt(x, platforms) {
  let best = 0;
  for (const p of platforms) {
    if (x + CHAR.width > p.left && x < p.right) {
      best = Math.max(best, p.top);
    }
  }
  return best;
}

export function isOnSurface(x, y, platforms) {
  return y <= surfaceAt(x, platforms) + 0.5;
}

// state: {x, y, vy, facing}. input: {left, right, jump}.
// platforms: [{left, right, top}] — real DOM element rects, converted to
// bottom-up viewport px by the caller. Always include a full-width floor
// entry so the character never falls off the bottom of the screen.
export function stepCharacter(state, input, platforms, viewportWidth) {
  let { x, vy, facing } = state;
  const { y } = state;

  if (input.left) {
    x -= CHAR.moveSpeed;
    facing = -1;
  }
  if (input.right) {
    x += CHAR.moveSpeed;
    facing = 1;
  }
  x = Math.max(0, Math.min(Math.max(0, viewportWidth - CHAR.width), x));

  if (input.jump && isOnSurface(x, y, platforms)) {
    vy = CHAR.jumpVelocity;
  }

  vy -= CHAR.gravity;
  let newY = y + vy;

  const surface = surfaceAt(x, platforms);
  if (vy <= 0 && newY <= surface) {
    newY = surface;
    vy = 0;
  }

  return { x, y: newY, vy, facing };
}

// Breaking something open by repeated bumps/clicks — used for the one
// "boarded up" reveal. hits/need are small integers, not a full inventory.
export function advanceBreak(hits, need = 3) {
  const next = hits + 1;
  return next >= need ? { hits: 0, broken: true } : { hits: next, broken: false };
}

// A small pushable prop: an offset from its resting position plus a
// velocity, decaying by friction each frame and clamped to a short leash.
export const CRATE = { friction: 0.85, maxOffset: 40, impulse: 6 };

export function stepCrate(state) {
  let { offset, v } = state;
  offset += v;
  v *= CRATE.friction;
  if (Math.abs(v) < 0.02) v = 0;
  offset = Math.max(-CRATE.maxOffset, Math.min(CRATE.maxOffset, offset));
  return { offset, v };
}

export function pushCrate(state, direction) {
  return { ...state, v: state.v + direction * CRATE.impulse };
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

export function loadFlag(key, fallback = false) {
  return readJSON(key, fallback);
}

export function saveFlag(key, value) {
  writeJSON(key, value);
}

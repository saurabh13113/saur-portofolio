import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CHAR, stepCharacter, isOnSurface, advanceBreak, CRATE, stepCrate, pushCrate,
  loadFlag, saveFlag,
} from "../components/mc/hero-scene-logic.js";

const FLOOR = [{ left: 0, right: 1000, top: 20 }];

test("stepCharacter: gravity pulls the character down when airborne", () => {
  const state = { x: 0, y: 100, vy: 0, facing: 1 };
  const next = stepCharacter(state, {}, FLOOR, 400);
  assert.ok(next.y < 100, "character should fall");
  assert.equal(next.vy, -CHAR.gravity);
});

test("stepCharacter: jump only launches the character when on a surface", () => {
  const grounded = { x: 0, y: 20, vy: 0, facing: 1 };
  const jumped = stepCharacter(grounded, { jump: true }, FLOOR, 400);
  assert.ok(jumped.vy > 0, "jump should give upward velocity on a surface");

  const airborne = { x: 0, y: 50, vy: 2, facing: 1 };
  const stillFalling = stepCharacter(airborne, { jump: true }, FLOOR, 400);
  assert.ok(stillFalling.vy < 2, "jump input mid-air should not re-launch the character");
});

test("stepCharacter: lands on a real element's rect instead of falling through it", () => {
  const platforms = [...FLOOR, { left: 40, right: 100, top: 80 }];
  let state = { x: 50, y: 200, vy: 0, facing: 1 };
  for (let i = 0; i < 50; i++) state = stepCharacter(state, {}, platforms, 400);
  assert.equal(state.y, 80);
  assert.equal(state.vy, 0);
  assert.ok(isOnSurface(state.x, state.y, platforms));
});

test("stepCharacter: horizontal movement is clamped to the viewport", () => {
  let state = { x: 0, y: 20, vy: 0, facing: 1 };
  for (let i = 0; i < 500; i++) state = stepCharacter(state, { left: true }, FLOOR, 400);
  assert.equal(state.x, 0);

  state = { x: 0, y: 20, vy: 0, facing: 1 };
  for (let i = 0; i < 500; i++) state = stepCharacter(state, { right: true }, FLOOR, 400);
  assert.equal(state.x, 400 - CHAR.width);
});

test("advanceBreak cycles and reports broken only at the threshold", () => {
  let r = advanceBreak(0, 3);
  assert.deepEqual(r, { hits: 1, broken: false });
  r = advanceBreak(r.hits, 3);
  assert.deepEqual(r, { hits: 2, broken: false });
  r = advanceBreak(r.hits, 3);
  assert.deepEqual(r, { hits: 0, broken: true });
});

test("stepCrate: friction decays velocity to zero and offset is clamped", () => {
  let state = pushCrate({ offset: 0, v: 0 }, 1);
  assert.ok(state.v > 0);
  for (let i = 0; i < 500; i++) state = stepCrate(state);
  assert.equal(state.v, 0);
  assert.ok(Math.abs(state.offset) <= CRATE.maxOffset);
});

test("pushCrate direction flips which way the offset moves", () => {
  const right = stepCrate(pushCrate({ offset: 0, v: 0 }, 1));
  const left = stepCrate(pushCrate({ offset: 0, v: 0 }, -1));
  assert.ok(right.offset > 0);
  assert.ok(left.offset < 0);
});

test("loadFlag returns the fallback when localStorage is unavailable", () => {
  assert.equal(loadFlag("mc-secret", false), false);
});

test("save/load flag round-trips through a shimmed localStorage", () => {
  const store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
  };
  saveFlag("mc-secret", true);
  assert.equal(loadFlag("mc-secret", false), true);
  delete globalThis.localStorage;
});

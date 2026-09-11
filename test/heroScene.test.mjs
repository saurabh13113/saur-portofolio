import { test } from "node:test";
import assert from "node:assert/strict";
import {
  TOOLS, EMERALD_IDS, hitsToBreak, advanceBlock, loadFoundEmeralds, saveFoundEmeralds,
  PHYSICS, stepPhysics, isOnSurface,
} from "../components/mc/hero-scene-logic.js";

test("every tool has an id, label, glyph and a positive hitsToBreak", () => {
  for (const t of TOOLS) {
    assert.ok(t.id && t.label && t.glyph);
    assert.ok(t.hitsToBreak >= 1);
  }
});

test("sword breaks in one hit, pickaxe takes three", () => {
  assert.equal(hitsToBreak("sword"), 1);
  assert.equal(hitsToBreak("pickaxe"), 3);
});

test("unknown tool id falls back to 3 hits", () => {
  assert.equal(hitsToBreak("nope"), 3);
});

test("advanceBlock cycles and reports broken only at the threshold", () => {
  let r = advanceBlock(0, "pickaxe");
  assert.deepEqual(r, { hits: 1, broken: false });
  r = advanceBlock(r.hits, "pickaxe");
  assert.deepEqual(r, { hits: 2, broken: false });
  r = advanceBlock(r.hits, "pickaxe");
  assert.deepEqual(r, { hits: 0, broken: true });
});

test("advanceBlock with sword breaks immediately", () => {
  assert.deepEqual(advanceBlock(0, "sword"), { hits: 0, broken: true });
});

test("loadFoundEmeralds returns [] when localStorage is unavailable", () => {
  assert.deepEqual(loadFoundEmeralds(), []);
});

test("save/load round-trips through a shimmed localStorage", () => {
  const store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
  };
  saveFoundEmeralds(["cloud", "grass"]);
  assert.deepEqual(loadFoundEmeralds(), ["cloud", "grass"]);
  delete globalThis.localStorage;
});

test("stepPhysics: gravity pulls the player down when airborne", () => {
  const state = { x: 0, y: 100, vy: 0, facing: 1 };
  const next = stepPhysics(state, {}, [], 400);
  assert.ok(next.y < 100, "player should fall");
  assert.equal(next.vy, -PHYSICS.gravity);
});

test("stepPhysics: jump only launches the player when on a surface", () => {
  const grounded = { x: 0, y: PHYSICS.groundY, vy: 0, facing: 1 };
  const jumped = stepPhysics(grounded, { jump: true }, [], 400);
  assert.ok(jumped.vy > 0, "jump should give upward velocity on the ground");

  const airborne = { x: 0, y: 50, vy: 2, facing: 1 };
  const stillFalling = stepPhysics(airborne, { jump: true }, [], 400);
  assert.ok(stillFalling.vy < 2, "jump input mid-air should not re-launch the player");
});

test("stepPhysics: lands on a platform instead of falling through it", () => {
  const platforms = [{ left: 40, right: 100, top: 80 }];
  let state = { x: 50, y: 200, vy: 0, facing: 1 };
  for (let i = 0; i < 50; i++) state = stepPhysics(state, {}, platforms, 400);
  assert.equal(state.y, 80);
  assert.equal(state.vy, 0);
  assert.ok(isOnSurface(state.x, state.y, platforms));
});

test("stepPhysics: horizontal movement is clamped to the scene bounds", () => {
  let state = { x: 0, y: PHYSICS.groundY, vy: 0, facing: 1 };
  for (let i = 0; i < 500; i++) state = stepPhysics(state, { left: true }, [], 400);
  assert.equal(state.x, 0);

  state = { x: 0, y: PHYSICS.groundY, vy: 0, facing: 1 };
  for (let i = 0; i < 500; i++) state = stepPhysics(state, { right: true }, [], 400);
  assert.equal(state.x, 400 - PHYSICS.playerWidth);
});

test("loadFoundEmeralds filters out unknown ids", () => {
  const store = { "mc-emeralds": JSON.stringify(["cloud", "bogus"]) };
  globalThis.localStorage = { getItem: (k) => store[k] ?? null, setItem: () => {} };
  assert.deepEqual(loadFoundEmeralds(), ["cloud"]);
  assert.ok(EMERALD_IDS.includes("cloud"));
  delete globalThis.localStorage;
});

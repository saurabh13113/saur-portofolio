import { test } from "node:test";
import assert from "node:assert/strict";
import {
  TOOLS, EMERALD_IDS, hitsToBreak, advanceBlock, loadFoundEmeralds, saveFoundEmeralds,
  PHYSICS_3D, stepPhysics3D, isOnSurface3D,
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

const BOUNDS = { minX: -5, maxX: 5, minZ: -3, maxZ: 3 };

test("stepPhysics3D: gravity pulls the player down when airborne", () => {
  const state = { x: 0, y: 3, z: 0, vy: 0, rotY: 0 };
  const next = stepPhysics3D(state, {}, [], BOUNDS);
  assert.ok(next.y < 3, "player should fall");
  assert.equal(next.vy, -PHYSICS_3D.gravity);
});

test("stepPhysics3D: jump only launches the player when on a surface", () => {
  const grounded = { x: 0, y: PHYSICS_3D.groundY, z: 0, vy: 0, rotY: 0 };
  const jumped = stepPhysics3D(grounded, { jump: true }, [], BOUNDS);
  assert.ok(jumped.vy > 0, "jump should give upward velocity on the ground");

  const airborne = { x: 0, y: 1, z: 0, vy: 0.1, rotY: 0 };
  const stillRising = stepPhysics3D(airborne, { jump: true }, [], BOUNDS);
  assert.ok(stillRising.vy < 0.1, "jump input mid-air should not re-launch the player");
});

test("stepPhysics3D: lands on a platform instead of falling through it", () => {
  const platforms = [{ minX: -1, maxX: 1, minZ: -1, maxZ: 1, top: 1.5 }];
  let state = { x: 0, y: 6, z: 0, vy: 0, rotY: 0 };
  for (let i = 0; i < 100; i++) state = stepPhysics3D(state, {}, platforms, BOUNDS);
  assert.equal(state.y, 1.5);
  assert.equal(state.vy, 0);
  assert.ok(isOnSurface3D(state.x, state.y, state.z, platforms));
});

test("stepPhysics3D: horizontal movement is clamped to the world bounds", () => {
  let state = { x: 0, y: PHYSICS_3D.groundY, z: 0, vy: 0, rotY: 0 };
  for (let i = 0; i < 500; i++) state = stepPhysics3D(state, { left: true }, [], BOUNDS);
  assert.equal(state.x, BOUNDS.minX);

  state = { x: 0, y: PHYSICS_3D.groundY, z: 0, vy: 0, rotY: 0 };
  for (let i = 0; i < 500; i++) state = stepPhysics3D(state, { forward: true }, [], BOUNDS);
  assert.equal(state.z, BOUNDS.minZ);
});

test("stepPhysics3D: diagonal input moves at the same speed as a single direction", () => {
  const straight = stepPhysics3D({ x: 0, y: 0, z: 0, vy: 0, rotY: 0 }, { forward: true }, [], BOUNDS);
  const diagonal = stepPhysics3D({ x: 0, y: 0, z: 0, vy: 0, rotY: 0 }, { forward: true, left: true }, [], BOUNDS);
  const straightDist = Math.hypot(straight.x, straight.z);
  const diagonalDist = Math.hypot(diagonal.x, diagonal.z);
  assert.ok(Math.abs(straightDist - diagonalDist) < 1e-9, "diagonal movement should be normalized");
});

test("loadFoundEmeralds filters out unknown ids", () => {
  const store = { "mc-emeralds": JSON.stringify(["cloud", "bogus"]) };
  globalThis.localStorage = { getItem: (k) => store[k] ?? null, setItem: () => {} };
  assert.deepEqual(loadFoundEmeralds(), ["cloud"]);
  assert.ok(EMERALD_IDS.includes("cloud"));
  delete globalThis.localStorage;
});

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  TOOLS, EMERALD_IDS, hitsToBreak, advanceBlock, loadFoundEmeralds, saveFoundEmeralds,
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

test("loadFoundEmeralds filters out unknown ids", () => {
  const store = { "mc-emeralds": JSON.stringify(["cloud", "bogus"]) };
  globalThis.localStorage = { getItem: (k) => store[k] ?? null, setItem: () => {} };
  assert.deepEqual(loadFoundEmeralds(), ["cloud"]);
  assert.ok(EMERALD_IDS.includes("cloud"));
  delete globalThis.localStorage;
});

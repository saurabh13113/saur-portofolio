import { test } from "node:test";
import assert from "node:assert/strict";
import { Vector3 } from "three";
import { makeCamera } from "../components/room/3d/camera.js";
import { toScreen } from "../components/room/projection.js";
import { ROOM_OBJECTS } from "../components/room/roomObjects.js";

const pct = (s) => parseFloat(s);

test("every object has a 3D anchor that lands inside the room", () => {
  for (const o of ROOM_OBJECTS) {
    assert.ok(o.anchor, `${o.id} has no anchor`);
    const { left, top } = toScreen(o.anchor);
    for (const v of [pct(left), pct(top)]) assert.ok(v >= 0 && v <= 100, `${o.id} off-screen: ${left} ${top}`);
  }
});

test("plain-math projection matches the real three.js camera", () => {
  const cam = makeCamera();
  for (const p of [[0, 0, 0], [6, 0, 6], [0, 2.8, 0], [4.4, 0.6, 0.5]]) {
    const v = new Vector3(...p).project(cam);
    const { left, top } = toScreen(p);
    assert.ok(Math.abs(pct(left) - ((v.x + 1) / 2) * 100) < 1e-6, `x mismatch at ${p}`);
    assert.ok(Math.abs(pct(top) - ((1 - v.y) / 2) * 100) < 1e-6, `y mismatch at ${p}`);
  }
});

test("every playlist and album file exists, with exact filename case (Vercel is case-sensitive)", async () => {
  const { readdirSync } = await import("node:fs");
  const { PLAYLIST, FAMILY } = await import("../components/room/roomObjects.js");
  const srcs = [...PLAYLIST, ...FAMILY].map((t) => t.src).concat(ROOM_OBJECTS.filter((o) => o.src).map((o) => o.src));
  for (const src of srcs) {
    const dir = new URL(`../public${src.slice(0, src.lastIndexOf("/"))}/`, import.meta.url);
    assert.ok(readdirSync(dir).includes(src.slice(src.lastIndexOf("/") + 1)), `missing or wrong case: public${src}`);
  }
});

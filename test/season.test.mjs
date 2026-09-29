import { test } from "node:test";
import assert from "node:assert/strict";
import { weatherKind, decorations } from "../components/room/season.js";

test("weather codes map to rain, snow, storm or clear", () => {
  assert.equal(weatherKind(0), "clear");
  assert.equal(weatherKind(3), "clear");
  assert.equal(weatherKind(61), "rain");
  assert.equal(weatherKind(81), "rain");
  assert.equal(weatherKind(95), "storm");
  assert.equal(weatherKind(99), "storm");
  assert.equal(weatherKind(73), "snow");
  assert.equal(weatherKind(86), "snow");
});

test("decorations follow the calendar", () => {
  const on = (s) => Object.entries(decorations(new Date(`${s}T12:00:00`))).filter(([, v]) => v).map(([k]) => k);
  assert.deepEqual(on("2026-07-01"), []);
  assert.deepEqual(on("2026-12-24"), ["lights"]);
  assert.deepEqual(on("2027-01-03"), ["lights"]);
  assert.deepEqual(on("2027-01-10"), []);
  assert.deepEqual(on("2026-11-07"), ["diyas"]);
  assert.deepEqual(on("2027-03-09"), ["lantern"]);
  assert.deepEqual(on("2026-10-31"), ["pumpkin"]);
});

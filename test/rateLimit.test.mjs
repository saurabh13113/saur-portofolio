import { test } from "node:test";
import assert from "node:assert/strict";
import { isRateLimited } from "../lib/rateLimit.js";

test("allows up to the limit, then blocks further requests in the window", () => {
  const key = "1.2.3.4";
  const now = Date.now();
  for (let i = 0; i < 5; i++) assert.equal(isRateLimited(key, now + i), false, `request ${i + 1} should be allowed`);
  assert.equal(isRateLimited(key, now + 5), true, "6th request in the window should be blocked");
});

test("resets once the window has passed", () => {
  const key = "5.6.7.8";
  const now = Date.now();
  for (let i = 0; i < 5; i++) isRateLimited(key, now + i);
  assert.equal(isRateLimited(key, now + 5), true);
  assert.equal(isRateLimited(key, now + 10 * 60 * 1000 + 1), false, "should be allowed again after the window");
});

test("tracks each key independently", () => {
  const now = Date.now();
  for (let i = 0; i < 5; i++) isRateLimited("9.9.9.9", now + i);
  assert.equal(isRateLimited("9.9.9.9", now + 5), true);
  assert.equal(isRateLimited("1.1.1.1", now + 5), false, "a different key should be unaffected");
});

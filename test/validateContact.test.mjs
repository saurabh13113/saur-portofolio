import { test } from "node:test";
import assert from "node:assert/strict";
import { validateContact } from "../lib/validateContact.js";

test("accepts a fully valid submission and trims whitespace", () => {
  const result = validateContact({
    firstName: " Saurabh ",
    lastName: " Nair ",
    email: " saurabh@example.com ",
    message: " hello there ",
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.data, {
    firstName: "Saurabh",
    lastName: "Nair",
    email: "saurabh@example.com",
    message: "hello there",
  });
});

test("rejects a missing first name with a specific error", () => {
  const result = validateContact({ firstName: "", lastName: "Nair", email: "a@b.com", message: "hi" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.firstName);
});

test("rejects an email without an @ or domain", () => {
  const result = validateContact({ firstName: "A", lastName: "B", email: "not-an-email", message: "hi" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.email);
});

test("rejects an empty message", () => {
  const result = validateContact({ firstName: "A", lastName: "B", email: "a@b.com", message: "   " });
  assert.equal(result.ok, false);
  assert.ok(result.errors.message);
});

test("handles a completely empty/undefined input without throwing", () => {
  const result = validateContact();
  assert.equal(result.ok, false);
  assert.ok(Object.keys(result.errors).length > 0);
});

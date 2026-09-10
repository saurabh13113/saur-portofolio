import { test } from "node:test";
import assert from "node:assert/strict";
import {
  profile, stats, projects, experience, education, skills, services, hotbar,
  CATEGORIES, filterProjects, sortedProjects,
} from "../data/portfolio.js";

test("profile has required contact fields", () => {
  for (const k of ["name", "role", "email", "phone", "resumePdf"]) {
    assert.ok(profile[k], `profile.${k} missing`);
  }
  assert.ok(Array.isArray(profile.socials) && profile.socials.length >= 2);
});

test("project slugs are unique and non-empty", () => {
  const slugs = projects.map((p) => p.slug);
  assert.ok(slugs.every(Boolean));
  assert.equal(new Set(slugs).size, slugs.length);
});

test("every project category is a known non-'All' category", () => {
  const valid = new Set(CATEGORIES.filter((c) => c !== "All"));
  for (const p of projects) assert.ok(valid.has(p.category), `bad category: ${p.category}`);
});

test("filterProjects returns all for 'All' and only matches otherwise", () => {
  assert.equal(filterProjects(projects, "All").length, projects.length);
  for (const c of CATEGORIES.filter((c) => c !== "All")) {
    assert.ok(filterProjects(projects, c).every((p) => p.category === c));
  }
});

test("sortedProjects puts featured first without dropping any", () => {
  const s = sortedProjects(projects);
  assert.equal(s.length, projects.length);
  const firstNonFeatured = s.findIndex((p) => !p.featured);
  if (firstNonFeatured !== -1) {
    assert.ok(s.slice(firstNonFeatured).every((p) => !p.featured));
  }
});

test("hotbar slots are valid", () => {
  const routes = new Set(["/", "/work", "/resume", "/services", "/contact"]);
  for (const s of hotbar) {
    assert.ok(["route", "sound", "external"].includes(s.kind), `bad kind: ${s.kind}`);
    if (s.kind === "route") assert.ok(routes.has(s.href), `unknown route: ${s.href}`);
    assert.equal(typeof s.slot, "number");
  }
  assert.equal(new Set(hotbar.map((s) => s.slot)).size, hotbar.length);
});

test("stats entries are well-formed", () => {
  assert.ok(stats.length >= 1);
  for (const s of stats) {
    assert.equal(typeof s.value, "number");
    assert.equal(typeof s.max, "number");
    assert.ok(s.label);
  }
});

test("experience/education/skills/services are populated", () => {
  assert.ok(experience.length >= 4);
  assert.ok(education.length >= 1);
  assert.ok(skills.length >= 3);
  assert.equal(services.length, 4);
});

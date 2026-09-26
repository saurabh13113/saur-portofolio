import { test } from "node:test";
import assert from "node:assert/strict";
import {
  profile, stats, projects, experience, education, skills, services,
  CATEGORIES, filterProjects, sortedProjects,
} from "../data/portfolio.js";
import { socialIcon, techIcon } from "../components/mc/icons.js";

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

test("every social key resolves to an icon component", () => {
  for (const s of profile.socials) {
    assert.equal(typeof socialIcon(s.key), "function", `no icon for social '${s.key}'`);
  }
});

test("techIcon returns a component or null for every project stack entry (never throws)", () => {
  for (const p of projects) {
    for (const s of p.stack) {
      const r = techIcon(s);
      assert.ok(r === null || typeof r === "function", `techIcon('${s}') bad return`);
    }
  }
});

# Minecraft-Themed Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin the existing Next.js portfolio into a Minecraft-styled, route-based site with blocky beveled UI, a pixel font, CSS/SVG block textures, hotbar navigation, and opt-in sound — content rewritten from `public/assets/resume.pdf`.

**Architecture:** Reskin in place on the current App Router. One shared content module (`data/portfolio.js`) feeds every page. A small `components/mc/` kit provides the blocky primitives; a CSS block appended to `globals.css` provides the font, textures, and bevel. `swiper` and `react-countup` are removed; no new runtime dependencies are added.

**Tech Stack:** Next.js 14 (App Router, JS), React 18, Tailwind CSS 3, framer-motion 11, Radix UI (via existing `components/ui/*`), react-icons, native `Audio` API, `node:test`.

**Spec:** `docs/superpowers/specs/2026-09-09-minecraft-portfolio-design.md`

## Global Constraints

- **No new runtime dependencies.** Only removals (`swiper`, `react-swiper`, `react-countup`).
- **No Mojang assets.** All textures are CSS gradients + one inline-SVG noise tile. No copied Minecraft images/sounds/fonts.
- **Binaries are owner-supplied and optional:** `public/fonts/Monocraft.ttf`, `public/sfx/click.mp3`, `public/sfx/break.mp3`, `public/sfx/orb.mp3`. Every feature that uses them MUST degrade silently when the file is absent (font falls back to monospace; `useSfx` no-ops).
- **Sound is muted by default.** Mute state persists in `localStorage` key `mc-muted` (`"true"` = muted). Unmuted only when the value is exactly `"false"`.
- **Routes stay:** `/`, `/work`, `/resume`, `/services`, `/contact`. No new routes.
- **Content is authoritative from the resume.** Verbatim role titles, employers, locations, and date ranges from `public/assets/resume.pdf` (including `May 2025 – August 2026` for BAYER — do not "correct" it).
- **`prefers-reduced-motion`:** disables the route-transition crack animation and the XP-bar count-up (final values shown immediately).
- **Fixed hotbar** overlaps page content — every page's outer wrapper needs bottom padding (`pb-28`) so nothing hides behind it.
- **Colors** (add to `tailwind.config.js` `theme.extend.colors`): `grass:{DEFAULT:"#7cb342",dark:"#5b8a3c"}`, `dirt:{DEFAULT:"#866043",dark:"#6b4a32"}`, `stone:{DEFAULT:"#7f7f7f",dark:"#565656"}`, `wood:"#9c6b3f"`, `redstone:"#d13a2b"`, `emerald:"#2ecc71"`, `obsidian:"#14121c"`, `xp:"#7cff2f"`. Keep existing `primary` and `accent`.
- **Font utility:** `theme.fontFamily.mc = ["Monocraft","var(--font-jetbrainsMono)","monospace"]` (keep existing `primary`).
- Text tokens used throughout: parchment `#f4e4c1`, tan `#d9b98a`, mint `#a8f0c0`.

---

## File Structure

**Create:**
- `data/portfolio.js` — all site content + pure helpers (`filterProjects`, `sortedProjects`, `CATEGORIES`). No React imports.
- `components/mc/icons.js` — string-key → react-icons lookups (`socialIcon`, `techIcon`). Returns `null` for unknown keys.
- `components/mc/Panel.jsx` — server. Beveled textured container.
- `components/mc/Sign.jsx` — server. Hanging plank heading.
- `components/mc/BlockButton.jsx` — client. Beveled button with press state + sfx.
- `components/mc/XpBar.jsx` — client. Segmented bar; optional count-up on scroll-in.
- `components/mc/StatusRow.jsx` — server. Decorative hearts/hunger row (`aria-hidden`).
- `components/mc/Chest.jsx` — client. Project card → bottom Sheet with detail.
- `components/mc/BreakOverlay.jsx` — client. Route-change crack transition.
- `hooks/useSfx.js` — client. Lazy `Audio` loader + mute toggle.
- `test/portfolio.test.mjs` — `node:test` for `data/portfolio.js` helpers.

**Modify:**
- `package.json` — add `"test": "node --test"`; remove `swiper`, `react-swiper`, `react-countup`.
- `tailwind.config.js` — palette + `fontFamily.mc`.
- `app/globals.css` — append the `@font-face`, texture, and bevel block.
- `app/layout.jsx` — `Header` → `Hotbar`; `StairTransition` → `BreakOverlay`; body bottom padding; metadata.
- `app/page.jsx` — rebuilt hero from `data/portfolio.js`.
- `app/work/page.jsx` — rebuilt as a filtered `Chest` grid.
- `app/resume/page.jsx` — reskinned Tabs + Panels + XpBars, content from data.
- `app/services/page.jsx` — Panels from `services` data.
- `app/contact/page.jsx` — reskinned controls, options/info from data.

**Delete (final task, after replacements land):**
- `components/Header.jsx`, `components/Nav.jsx`, `components/MobileNav.jsx`,
  `components/Stairs.jsx`, `components/StairTransition.jsx`,
  `components/Stats.jsx`, `components/WorkSliderBtns.jsx`.

**Keep untouched:** `components/Photo.jsx`, `components/Social.jsx`, `components/PageTransition.jsx`, everything in `components/ui/`.

---

## Task 1: Theme foundation (palette, font, textures, bevel)

**Files:**
- Modify: `tailwind.config.js`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: nothing.
- Produces: Tailwind utilities `font-mc`, `text-emerald`/`bg-obsidian`/etc.; CSS classes `.mc-bevel`, `.mc-bevel--pressed`, `.tex-grass`, `.tex-dirt`, `.tex-stone`, `.tex-plank`, `.tex-obsidian`.

- [ ] **Step 1: Add palette + font family to Tailwind**

In `tailwind.config.js`, add `mc` to `theme.fontFamily` (leave `primary` as-is):

```js
fontFamily: {
  primary: "var(--font-jetbrainsMono)",
  mc: ["Monocraft", "var(--font-jetbrainsMono)", "monospace"],
},
```

In `theme.extend.colors`, add alongside the existing `primary`/`accent`:

```js
grass: { DEFAULT: "#7cb342", dark: "#5b8a3c" },
dirt: { DEFAULT: "#866043", dark: "#6b4a32" },
stone: { DEFAULT: "#7f7f7f", dark: "#565656" },
wood: "#9c6b3f",
redstone: "#d13a2b",
emerald: "#2ecc71",
obsidian: "#14121c",
xp: "#7cff2f",
```

- [ ] **Step 2: Append the theme CSS block to `app/globals.css`**

Add to the END of `app/globals.css` (after the existing `@layer base`):

```css
@font-face {
  font-family: "Monocraft";
  src: url("/fonts/Monocraft.ttf") format("truetype");
  font-display: swap;
}

@layer base {
  html {
    image-rendering: pixelated;
  }
}

@layer components {
  .mc-bevel {
    border-style: solid;
    border-width: 4px;
    border-top-color: rgba(255, 255, 255, 0.35);
    border-left-color: rgba(255, 255, 255, 0.35);
    border-right-color: rgba(0, 0, 0, 0.45);
    border-bottom-color: rgba(0, 0, 0, 0.45);
    border-radius: 0;
  }
  .mc-bevel--pressed {
    border-top-color: rgba(0, 0, 0, 0.45);
    border-left-color: rgba(0, 0, 0, 0.45);
    border-right-color: rgba(255, 255, 255, 0.25);
    border-bottom-color: rgba(255, 255, 255, 0.25);
    transform: translate(2px, 2px);
  }

  .tex-noise {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='16' height='16' filter='url(%23n)' opacity='0.22'/%3E%3C/svg%3E");
    background-size: 16px 16px;
  }
  .tex-grass {
    background-color: #5b8a3c;
    background-image:
      repeating-linear-gradient(0deg, rgba(0,0,0,0.10) 0 4px, transparent 4px 8px),
      linear-gradient(180deg, #7cb342 0 6px, #5b8a3c 6px),
      var(--noise);
  }
  .tex-dirt {
    background-color: #6b4a32;
    background-image:
      repeating-linear-gradient(90deg, rgba(0,0,0,0.10) 0 6px, transparent 6px 12px),
      var(--noise);
  }
  .tex-stone {
    background-color: #7f7f7f;
    background-image:
      repeating-linear-gradient(0deg, rgba(0,0,0,0.10) 0 5px, transparent 5px 10px),
      repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0 5px, transparent 5px 10px),
      var(--noise);
  }
  .tex-plank {
    background-color: #9c6b3f;
    background-image:
      repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 1px, transparent 1px 14px),
      repeating-linear-gradient(90deg, rgba(0,0,0,0.10) 0 40px, rgba(255,255,255,0.05) 40px 42px),
      var(--noise);
  }
  .tex-obsidian {
    background-color: #14121c;
    background-image:
      repeating-linear-gradient(45deg, rgba(120,80,200,0.10) 0 4px, transparent 4px 8px),
      var(--noise);
  }
}

:root {
  --noise: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='16' height='16' filter='url(%23n)' opacity='0.22'/%3E%3C/svg%3E");
}
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build`
Expected: build succeeds (no CSS parse errors). Dev server (`npm run dev`) still serves `/` at 200. No visual change expected yet — classes exist but are unused.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js app/globals.css
git commit -m "feat: add Minecraft theme foundation (palette, font-face, textures, bevel)"
```

---

## Task 2: Shared content module + helpers + tests

**Files:**
- Create: `data/portfolio.js`
- Create: `test/portfolio.test.mjs`
- Modify: `package.json` (add test script)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `profile` — `{ name, role, tagline, location, website, email, phone, resumePdf, socials: [{key,href}] }`
  - `stats` — `[{ label, value, max, suffix }]`
  - `projects` — `[{ slug, title, blurb, description, category, featured, stack: [string], links: {live, github}, image? }]`
  - `experience` — `[{ role, org, location, start, end, bullets: [string] }]`
  - `education` — `[{ school, credential, detail, start, end, honors: [string] }]`
  - `skills` — `[{ group, items: [{ name, level }] }]`
  - `services` — `[{ num, title, description }]`
  - `hotbar` — `[{ slot: number, label, kind: "route"|"sound"|"external", href }]`
  - `CATEGORIES` — `["All","FullStack","Backend","ML","Frontend"]`
  - `filterProjects(list, cat)` → filtered array (all when `cat === "All"`)
  - `sortedProjects(list)` → new array, `featured` first, otherwise stable

- [ ] **Step 1: Add the test script to `package.json`**

In `"scripts"`, add: `"test": "node --test"`

- [ ] **Step 2: Write the failing test**

Create `test/portfolio.test.mjs`:

```js
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '../data/portfolio.js'`.

- [ ] **Step 4: Create `data/portfolio.js`**

```js
// Single source of truth for all portfolio content.
// Content transcribed from public/assets/resume.pdf — keep role titles,
// employers, locations and date ranges verbatim.

export const profile = {
  name: "Saurabh Nair",
  role: "Software Developer",
  tagline:
    "CS & Economics double major at the University of Toronto. From Abu Dhabi 🇦🇪, building in Toronto.",
  location: "Toronto, ON",
  website: "saurabhnair.com",
  email: "saurabhnair13113@gmail.com",
  phone: "+1 647-831-6703",
  resumePdf: "/assets/resume.pdf",
  socials: [
    { key: "github", href: "https://github.com/saurabh13113" },
    { key: "linkedin", href: "https://www.linkedin.com/in/saurabh-nair" },
    { key: "email", href: "mailto:saurabhnair13113@gmail.com" },
  ],
};

export const stats = [
  { label: "Internships", value: 4, max: 5, suffix: "" },
  { label: "CGPA", value: 3.73, max: 4, suffix: "" },
  { label: "Dean's List years", value: 4, max: 4, suffix: "" },
  { label: "Shipped projects", value: 19, max: 20, suffix: "+" },
];

export const CATEGORIES = ["All", "FullStack", "Backend", "ML", "Frontend"];

export const projects = [
  {
    slug: "feynomenon",
    title: "Feynomenon — AI-Powered Learning Tutor",
    category: "FullStack",
    featured: true,
    blurb:
      "Adaptive AI tutor built on the Feynman technique. Winner, TMU Solution Hacks '25.",
    description:
      "Adaptive AI tutoring platform that applies the Feynman technique, using the Gemini API for dynamic response generation. Fully responsive Next.js + TailwindCSS frontend with Firebase authentication and MongoDB-backed session analytics. Deployed on Vercel and Railway. Winner at TMU Solution Hacks '25.",
    stack: ["Next.js", "TailwindCSS", "Node.js", "MongoDB", "Firebase", "Gemini"],
    links: { live: "", github: "https://github.com/saurabh13113" },
  },
  {
    slug: "round1",
    title: "Round1 — Multimodal AI Interviewer",
    category: "FullStack",
    featured: true,
    blurb:
      "Job-role-aware interview simulator with a transparent LLM rubric and behavioral metrics.",
    description:
      "Interview simulator that conducts job-role-aware questioning and applies a transparent LLM rubric for real-time scoring, combining natural-language understanding with behavioral metrics extracted via MediaPipe. Includes a recruiter dashboard with interactive charts, transcripts, pass/fail thresholds and engagement flags, backed by Firebase Hosting and Storage.",
    stack: ["Next.js", "TailwindCSS", "Firebase", "MediaPipe", "Gemini", "RoboFlow"],
    links: { live: "", github: "https://github.com/saurabh13113" },
  },

  // --- Archive: existing GitHub repos (real screenshots under /assets/work) ---
  { slug: "ml-stock-price-predictor", title: "ML Stock Price Predictor", category: "ML", featured: false,
    blurb: "SciKit-Learn + pandas model over S&P 500 data to predict next-day prices.",
    description: "Summer project using SciKit-Learn and pandas to analyze S&P 500 data and predict tomorrow's stock prices.",
    stack: ["Python", "Sci-Kit Learn", "Jupyter", "Pandas"], image: "/assets/work/Pic9.png",
    links: { live: "https://github.com/saurabh13113/ml-stock-price-predictor", github: "https://github.com/saurabh13113/ml-stock-price-predictor" } },
  { slug: "flashgenie", title: "FlashGenie AI Flashcards", category: "FullStack", featured: false,
    blurb: "AI flashcard generator with Stripe billing and Clerk auth.",
    description: "Summer project using Meta Llama to build an AI flashcard generator with a premium pricing model (Stripe) and user authentication (Clerk).",
    stack: ["React", "Next.js", "Material UI", "Llama AI", "Stripe", "Clerk"], image: "/assets/work/Pic15.png",
    links: { live: "https://flashcard-saas-mu-liart.vercel.app/", github: "https://github.com/saurabh13113/flashcard-saas/tree/main" } },
  { slug: "ml-premier-league-predictor", title: "ML Premier League Predictor", category: "ML", featured: false,
    blurb: "Predicts Premier League match results from web-scraped season data.",
    description: "Summer project using SciKit-Learn and pandas over web-scraped Premier League data to predict match results across a season.",
    stack: ["Python", "Sci-Kit Learn", "Jupyter", "Pandas"], image: "/assets/work/Pic12.png",
    links: { live: "https://github.com/saurabh13113/ml-premier-league-predictor", github: "https://github.com/saurabh13113/ml-premier-league-predictor" } },
  { slug: "webscraper-premier-league", title: "Premier League Web Scraper", category: "Backend", featured: false,
    blurb: "BeautifulSoup + pandas scraper for multi-season Premier League data.",
    description: "Summer project using BeautifulSoup and pandas to scrape Premier League data across recent seasons.",
    stack: ["Python", "Beautiful Soup", "Jupyter", "Pandas"], image: "/assets/work/Pic13.png",
    links: { live: "https://github.com/saurabh13113/webscraper-premier-league", github: "https://github.com/saurabh13113/webscraper-premier-league" } },
  { slug: "math-chatbot", title: "Math Chat Bot (Llama AI)", category: "FullStack", featured: false,
    blurb: "AI chatbot that helps students work through math problems.",
    description: "Summer project using Meta Llama to build an AI chatbot that helps students practice and work through math problems. Built with Next.js, React and deployed on AWS EC2 / Vercel.",
    stack: ["React", "Next.js", "Material UI", "Llama AI", "AWS EC2"], image: "/assets/work/Pic14.png",
    links: { live: "https://math-chatbot-eta.vercel.app/", github: "https://github.com/saurabh13113/math-chatbot/tree/main" } },
  { slug: "uaemetro-ticketer", title: "UAE Metro Ticketer", category: "FullStack", featured: false,
    blurb: "Desktop app to purchase UAE metro tickets.",
    description: "High-school project allowing customers to purchase UAE metro tickets via a Tkinter desktop UI.",
    stack: ["Python", "TKinter"], image: "/assets/work/Pic10.png",
    links: { live: "https://github.com/saurabh13113/uaemetro-ticketer", github: "https://github.com/saurabh13113/uaemetro-ticketer" } },
  { slug: "pantry-tracker", title: "Pantry Tracker", category: "FullStack", featured: false,
    blurb: "Pantry management app with Next.js, Material UI and Firebase.",
    description: "Summer project: a pantry management application built with Next.js, Material UI and Firebase.",
    stack: ["React", "Next.js", "Material UI", "Firebase"], image: "/assets/work/Pic11.png",
    links: { live: "https://pantry-app-lac.vercel.app/", github: "https://github.com/saurabh13113/pantry-app" } },
  { slug: "huffman-compressor", title: "Huffman Tree File Compressor", category: "Backend", featured: false,
    blurb: "File compression/decompression via Huffman trees.",
    description: "University project that compresses and decompresses files using Huffman trees.",
    stack: ["Python"], image: "/assets/work/Pic2.png",
    links: { live: "https://github.com/saurabh13113/huffman-compressor-tree-", github: "https://github.com/saurabh13113/huffman-compressor-tree-" } },
  { slug: "hua-rong-dao-solver", title: "Hua Rong Dao Puzzle Solver", category: "Backend", featured: false,
    blurb: "Solves the Hua Rong Dao sliding puzzle via state-space search.",
    description: "University project that solves the Hua Rong Dao puzzle using state-space search.",
    stack: ["Python"], image: "/assets/work/Pic16.png",
    links: { live: "https://github.com/saurabh13113/Hua-Rong-Dao-Solver", github: "https://github.com/saurabh13113/Hua-Rong-Dao-Solver" } },
  { slug: "checkers-solver", title: "Checkers Endgame Solver", category: "Backend", featured: false,
    blurb: "Solves checkers endgames with game-tree search.",
    description: "University project that solves checkers endgames using game-tree search.",
    stack: ["Python"], image: "/assets/work/Pic17.png",
    links: { live: "https://github.com/saurabh13113/checkers-solver", github: "https://github.com/saurabh13113/checkers-solver" } },
  { slug: "battleship-solitaire-solver", title: "Battleship Solitaire Solver", category: "Backend", featured: false,
    blurb: "Constraint-satisfaction + GAC solver for Battleship Solitaire.",
    description: "University project that solves Battleship Solitaire endgames using constraint satisfaction and generalized arc consistency.",
    stack: ["Python"], image: "/assets/work/Pic18.png",
    links: { live: "https://github.com/saurabh13113/battleship-solitaire-solver", github: "https://github.com/saurabh13113/battleship-solitaire-solver" } },
  { slug: "naive-bayes-salary", title: "Naive Bayes Salary Predictor", category: "ML", featured: false,
    blurb: "Predicts salaries with a hand-built Naive Bayes model.",
    description: "University project that predicts salaries by building a Naive Bayes classifier.",
    stack: ["Python"], image: "/assets/work/Pic19.png",
    links: { live: "https://github.com/saurabh13113/Naive-Bayes_Model-", github: "https://github.com/saurabh13113/Naive-Bayes_Model" } },
  { slug: "mobile-companytracker", title: "Mobile System Tracker", category: "Frontend", featured: false,
    blurb: "Tracks a mobile carrier and its customers, with a visualizer.",
    description: "University assignment to track a mobile company and its customers, including a PyGame visualizer.",
    stack: ["Python", "PyGame"], image: "/assets/work/pic1.png",
    links: { live: "https://github.com/saurabh13113/mobile-companytracker", github: "https://github.com/saurabh13113/mobile-companytracker" } },
  { slug: "treemap-file-organizer", title: "TreeMap File Organizer", category: "FullStack", featured: false,
    blurb: "Organizes files/folders with a treemap visualizer.",
    description: "University project using file-system trees and treemaps to organize files and folders through a visualizer.",
    stack: ["Python", "PyGame"], image: "/assets/work/Pic4.png",
    links: { live: "https://github.com/saurabh13113/treemap-file-organizer-tree-", github: "https://github.com/saurabh13113/treemap-file-organizer-tree-" } },
  { slug: "uber-driver-rider-pairer", title: "Driver / Rider Pairer", category: "Frontend", featured: false,
    blurb: "Matches drivers and riders on locational data.",
    description: "University project that matches drivers and riders based on locational information.",
    stack: ["Python"], image: "/assets/work/Pic8.png",
    links: { live: "https://github.com/saurabh13113/uber-driver-rider-pairer", github: "https://github.com/saurabh13113/uber-driver-rider-pairer" } },
  { slug: "mindsnatcher-game", title: "MindSnatcher (team game)", category: "FullStack", featured: false,
    blurb: "3-month Agile team build of a JavaFX game.",
    description: "University assignment building a game over three months in Java and JavaFX, in a team of four following Agile practices.",
    stack: ["Java", "JavaFx", "PlayHT"], image: "/assets/work/Pic3.png",
    links: { live: "https://github.com/saurabh13113/mindsnatcher-game", github: "https://github.com/saurabh13113/mindsnatcher-game" } },
  { slug: "add-echo", title: "Add Echo (audio DSP)", category: "Backend", featured: false,
    blurb: "Removes vocals and adds echo to WAV files by decoding bit data.",
    description: "University project that removes vocals and adds an echo effect to a WAV file by decoding its bit-level audio data.",
    stack: ["C"], image: "/assets/work/Pic7.png",
    links: { live: "https://github.com/saurabh13113/add-echo", github: "https://github.com/saurabh13113/add-echo" } },
  { slug: "tsh-mini-shell", title: "tsh Mini Shell", category: "Backend", featured: false,
    blurb: "A replica Unix shell / command prompt in C.",
    description: "University project implementing a replica mini shell / command prompt in C.",
    stack: ["C"], image: "/assets/work/Pic6.png",
    links: { live: "https://github.com/saurabh13113/tsh-mini-shell", github: "https://github.com/saurabh13113/tsh-mini-shell" } },
  { slug: "multiplayer-server-game", title: "Multiplayer Server Game", category: "Backend", featured: false,
    blurb: "Local server battle game hosted on the UofT servers.",
    description: "University project that stands up a local server on the UofT machines and lets users join and play a simple battle game.",
    stack: ["C"], image: "/assets/work/Pic5.png",
    links: { live: "https://github.com/saurabh13113/multiplayer-server-game", github: "https://github.com/saurabh13113/multiplayer-server-game" } },
];

export const experience = [
  {
    role: "Software Developer Intern",
    org: "BAYER Canada",
    location: "Toronto, ON",
    start: "May 2025",
    end: "August 2026",
    bullets: [
      "Owned end-to-end delivery of the DRL Redesign on the Radimetrics dose-management platform, shipping exam-level alert filtering — +28% alert-filtering accuracy.",
      "Built an automated OS patch pipeline with Jenkins and AWS, replacing a manual release process with repeatable ISO packaging — −35% release-prep time.",
      "Led dependency upgrades across RHEL and Alma Linux for the 3.8 release, coordinating testing across multiple VMs — −20% post-release defects.",
    ],
  },
  {
    role: "Software Engineering Intern",
    org: "Kaytoons Inc.",
    location: "San Jose, CA",
    start: "September 2024",
    end: "May 2025",
    bullets: [
      "Built, deployed and remotely maintained backend systems for a children's educational mobile app; proactive monitoring and refactoring took uptime to 90%, supporting investor demos.",
      "Integrated a PlayHT-powered voice-cloning feature in Python for dynamic character dialogue — +18% average session duration.",
    ],
  },
  {
    role: "Teaching Assistant",
    org: "University of Toronto",
    location: "Mississauga, ON",
    start: "September 2024",
    end: "May 2025",
    bullets: [
      "TA'd CSC236 (Theory of Computation), ECO225 (Data Tools for Economics) and CSC263 (Data Structures & Algorithms).",
      "Graded assignments, quizzes and exams and held office hours for 150+ students, lifting engagement and course-satisfaction scores.",
    ],
  },
  {
    role: "Machine Learning Intern",
    org: "Emirates Steel Arkan",
    location: "Abu Dhabi, UAE",
    start: "June 2024",
    end: "August 2024",
    bullets: [
      "Built and deployed predictive-maintenance models on time-series sensor data — −15% unplanned downtime, saving hundreds of production hours a year.",
      "Engineered a real-time consumption dashboard giving plant managers actionable insight — ~$1.2M/yr estimated raw-material savings.",
      "Feature engineering and hyperparameter tuning improved model precision by 12% across multiple production lines.",
    ],
  },
];

export const education = [
  {
    school: "University of Toronto",
    credential: "B.Sc Computer Science & B.A Economics (Double Major)",
    detail: "CGPA 3.73",
    start: "2022",
    end: "Expected June 2027",
    honors: [
      "Dean's List Scholar — 2022, 2023, 2024, 2025",
      "University of Toronto Scholar Award — 2022",
    ],
  },
];

export const skills = [
  { group: "Languages", items: [
    { name: "Python", level: 92 }, { name: "Java", level: 88 }, { name: "JavaScript / TypeScript", level: 88 },
    { name: "C", level: 78 }, { name: "R", level: 72 }, { name: "SQL (PostgreSQL / MySQL)", level: 80 },
    { name: "Stata", level: 65 }, { name: "Bash / Shell", level: 70 }, { name: "HTML / CSS", level: 85 },
  ]},
  { group: "Frameworks", items: [
    { name: "React", level: 88 }, { name: "Next.js", level: 88 }, { name: "Node.js", level: 82 },
    { name: "Spring Boot", level: 78 }, { name: "Flask", level: 76 }, { name: "Hibernate / JPA", level: 70 },
    { name: "TailwindCSS", level: 88 }, { name: "Material-UI", level: 75 },
  ]},
  { group: "Tools", items: [
    { name: "Git", level: 90 }, { name: "Docker", level: 78 }, { name: "Jenkins", level: 75 },
    { name: "AWS", level: 74 }, { name: "GCP", level: 68 }, { name: "Linux", level: 82 },
    { name: "Firebase", level: 80 }, { name: "Vercel", level: 85 }, { name: "Railway", level: 72 },
    { name: "Maven", level: 68 }, { name: "Postman", level: 78 },
  ]},
  { group: "Libraries", items: [
    { name: "Pandas", level: 85 }, { name: "SciKit-Learn", level: 80 }, { name: "OpenCV", level: 70 },
    { name: "MediaPipe", level: 68 }, { name: "RoboFlow", level: 66 },
  ]},
];

export const services = [
  { num: "01", title: "Full-Stack Web Apps", description: "Next.js / React / Node.js apps with auth, a database and a deploy pipeline — end to end." },
  { num: "02", title: "Backend & APIs", description: "Spring Boot or Flask services: REST APIs, data modeling, integrations and monitoring." },
  { num: "03", title: "ML & Data", description: "Predictive models, feature engineering and dashboards that turn raw data into decisions." },
  { num: "04", title: "DevOps & Cloud Automation", description: "Jenkins / Docker / AWS / GCP pipelines that make releases repeatable instead of manual." },
];

export const hotbar = [
  { slot: 1, label: "Spawn", kind: "route", href: "/" },
  { slot: 2, label: "Builds", kind: "route", href: "/work" },
  { slot: 3, label: "Inv", kind: "route", href: "/resume" },
  { slot: 4, label: "Trades", kind: "route", href: "/services" },
  { slot: 5, label: "Chat", kind: "route", href: "/contact" },
  { slot: 8, label: "Sound", kind: "sound", href: "" },
  { slot: 9, label: "PDF", kind: "external", href: "/assets/resume.pdf" },
];

export function filterProjects(list, cat) {
  return cat === "All" ? list.slice() : list.filter((p) => p.category === cat);
}

export function sortedProjects(list) {
  return list
    .map((p, i) => [p, i])
    .sort((a, b) => (b[0].featured ? 1 : 0) - (a[0].featured ? 1 : 0) || a[1] - b[1])
    .map(([p]) => p);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test`
Expected: PASS — all `portfolio.test.mjs` tests green.

- [ ] **Step 6: Commit**

```bash
git add data/portfolio.js test/portfolio.test.mjs package.json
git commit -m "feat: add shared portfolio content module with helpers + tests"
```

---

## Task 3: Minecraft UI kit — Panel, Sign, BlockButton, XpBar, StatusRow

**Files:**
- Create: `components/mc/icons.js`
- Create: `components/mc/Panel.jsx`
- Create: `components/mc/Sign.jsx`
- Create: `components/mc/BlockButton.jsx`
- Create: `components/mc/XpBar.jsx`
- Create: `components/mc/StatusRow.jsx`
- Create: `hooks/useSfx.js`

**Interfaces:**
- Consumes: `.mc-bevel`, `.tex-*` from Task 1.
- Produces:
  - `useSfx()` → `{ muted: boolean, play(name: "click"|"break"|"orb"): void, toggle(): void }`
  - `socialIcon(key)` / `techIcon(name)` → React component or `null`
  - `<Panel as={Tag="div"} tex={"stone"|"dirt"|"plank"|"grass"|"obsidian"} className children ...rest />`
  - `<Sign className children />`
  - `<BlockButton tex={"plank"} sfx={"click"} className onClick children ...rest />`
  - `<XpBar value:number max=100 label:string suffix="" count=false />`
  - `<StatusRow />`

- [ ] **Step 1: Create `hooks/useSfx.js`**

```js
"use client";
import { useCallback, useEffect, useState } from "react";

const FILES = { click: "/sfx/click.mp3", break: "/sfx/break.mp3", orb: "/sfx/orb.mp3" };
const cache = {};

export function useSfx() {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    try {
      setMuted(localStorage.getItem("mc-muted") !== "false");
    } catch {}
  }, []);

  const play = useCallback(
    (name) => {
      if (muted) return;
      const src = FILES[name];
      if (!src) return;
      try {
        let a = cache[name];
        if (!a) {
          a = new Audio(src);
          cache[name] = a;
        }
        a.currentTime = 0;
        a.play().catch(() => {});
      } catch {}
    },
    [muted]
  );

  const toggle = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      try {
        localStorage.setItem("mc-muted", String(next));
      } catch {}
      return next;
    });
  }, []);

  return { muted, play, toggle };
}
```

- [ ] **Step 2: Create `components/mc/icons.js`**

```js
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import {
  FaJava, FaPython, FaReact, FaNodeJs, FaAws, FaDocker, FaGitAlt, FaLinux,
} from "react-icons/fa";
import {
  SiNextdotjs, SiTailwindcss, SiJavascript, SiTypescript, SiFirebase, SiVercel,
  SiMongodb, SiFlask, SiSpring, SiJenkins, SiPandas, SiScikitlearn,
  SiGooglecloud, SiOpencv, SiPostgresql, SiMysql, SiRailway, SiC,
} from "react-icons/si";

const SOCIAL = { github: FaGithub, linkedin: FaLinkedin, email: FaEnvelope };

const TECH = {
  "Java": FaJava, "Python": FaPython, "React": FaReact, "Next.js": SiNextdotjs,
  "Node.js": FaNodeJs, "TailwindCSS": SiTailwindcss, "JavaScript": SiJavascript,
  "TypeScript": SiTypescript, "Firebase": SiFirebase, "Vercel": SiVercel,
  "MongoDB": SiMongodb, "Flask": SiFlask, "Spring Boot": SiSpring, "Jenkins": SiJenkins,
  "Pandas": SiPandas, "Sci-Kit Learn": SiScikitlearn, "AWS": FaAws, "AWS EC2": FaAws,
  "Docker": FaDocker, "Git": FaGitAlt, "Linux": FaLinux, "GCP": SiGooglecloud,
  "OpenCV": SiOpencv, "C": SiC,
};

export function socialIcon(key) {
  return SOCIAL[key] ?? null;
}

export function techIcon(name) {
  return TECH[name] ?? null;
}
```

Note: if any `react-icons/si` name above fails to resolve at build time, delete that
line and its `TECH` entry — `techIcon` returning `null` is a supported path
(callers render a plain stone cube).

- [ ] **Step 3: Create `components/mc/Panel.jsx`**

```jsx
export default function Panel({ as: Tag = "div", tex = "stone", className = "", children, ...rest }) {
  return (
    <Tag className={`mc-bevel tex-${tex} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
```

- [ ] **Step 4: Create `components/mc/Sign.jsx`**

```jsx
export default function Sign({ className = "", children }) {
  return (
    <div
      className={`inline-block mc-bevel tex-plank px-6 py-3 font-mc text-2xl text-[#f4e4c1] shadow-[0_6px_0_rgba(0,0,0,0.4)] ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Create `components/mc/BlockButton.jsx`**

```jsx
"use client";
import { useState } from "react";
import { useSfx } from "@/hooks/useSfx";

export default function BlockButton({
  tex = "plank",
  sfx = "click",
  className = "",
  onClick,
  children,
  ...rest
}) {
  const [pressed, setPressed] = useState(false);
  const { play } = useSfx();
  return (
    <button
      type="button"
      className={`mc-bevel tex-${tex} font-mc uppercase tracking-wide px-5 py-3 text-[#f4e4c1] select-none focus:outline focus:outline-2 focus:outline-white ${
        pressed ? "mc-bevel--pressed" : ""
      } ${className}`}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={(e) => {
        play(sfx);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 6: Create `components/mc/XpBar.jsx`**

```jsx
"use client";
import { useEffect, useRef, useState } from "react";

export default function XpBar({ value, max = 100, label, suffix = "", count = false }) {
  const [shown, setShown] = useState(count ? 0 : value);
  const ref = useRef(null);

  useEffect(() => {
    if (!count) {
      setShown(value);
      return;
    }
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 900;
      const tick = (t) => {
        const p = Math.min(1, (t - start) / dur);
        setShown(value * p);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [count, value]);

  const pct = max > 0 ? Math.max(0, Math.min(100, (shown / max) * 100)) : 0;
  const display = Number.isInteger(value) ? String(Math.round(shown)) : shown.toFixed(2);

  return (
    <div ref={ref} className="font-mc">
      <div className="flex justify-between text-sm text-[#f4e4c1]">
        <span>{label}</span>
        <span>
          {display}
          {suffix}
        </span>
      </div>
      <div className="mc-bevel h-4 bg-[#2b2b2b] mt-1">
        <div className="h-full bg-xp" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Create `components/mc/StatusRow.jsx`**

```jsx
const HEART =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='9'%3E%3Cpath fill='%23d13a2b' d='M1 1h2v1h1V1h2v1h1v3H7v1H6v1H5v1H4V7H3V6H2V5H1z'/%3E%3C/svg%3E";
const DRUM =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='9'%3E%3Cpath fill='%239c6b3f' d='M2 1h5v1h1v4H7v1H6v1H3V7H2V6H1V2h1z'/%3E%3C/svg%3E";

export default function StatusRow() {
  return (
    <div aria-hidden className="flex justify-between max-w-[420px]">
      <div className="flex gap-[3px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <img key={i} src={HEART} alt="" width={16} height={16} />
        ))}
      </div>
      <div className="flex gap-[3px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <img key={i} src={DRUM} alt="" width={16} height={16} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Verify build compiles**

Run: `npm run build`
Expected: PASS. If a `react-icons/si` import errors, apply the note in Step 2 and rebuild.

- [ ] **Step 9: Commit**

```bash
git add components/mc hooks/useSfx.js
git commit -m "feat: add Minecraft UI kit (Panel, Sign, BlockButton, XpBar, StatusRow, sfx)"
```

---

## Task 4: Hotbar navigation + layout swap

**Files:**
- Create: `components/mc/Hotbar.jsx`
- Modify: `app/layout.jsx`
- Delete: `components/Header.jsx`, `components/Nav.jsx`, `components/MobileNav.jsx`

**Interfaces:**
- Consumes: `hotbar` from `data/portfolio.js`; `useSfx` from Task 3.
- Produces: `<Hotbar />` — fixed bottom nav, keys `1`–`9`, active-route outline.

- [ ] **Step 1: Create `components/mc/Hotbar.jsx`**

```jsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { hotbar } from "@/data/portfolio";
import { useSfx } from "@/hooks/useSfx";

export default function Hotbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { muted, play, toggle } = useSfx();

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName ?? "";
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;
      const slot = hotbar.find((s) => String(s.slot) === e.key);
      if (!slot) return;
      play("click");
      if (slot.kind === "sound") toggle();
      else if (slot.kind === "external") window.open(slot.href, "_blank");
      else router.push(slot.href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, play, toggle]);

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex gap-1 p-1 mc-bevel tex-stone">
      {hotbar.map((s) => {
        const active = s.kind === "route" && s.href === pathname;
        const cls = `w-14 h-14 mc-bevel tex-dirt flex flex-col items-center justify-center font-mc text-[10px] leading-tight text-[#f4e4c1] focus:outline focus:outline-2 focus:outline-white ${
          active ? "outline outline-2 outline-white" : ""
        }`;
        const label = s.kind === "sound" ? (muted ? "OFF" : "ON") : s.label;
        const inner = (
          <>
            <span className="text-[8px] opacity-60">{s.slot}</span>
            <span>{label}</span>
          </>
        );
        if (s.kind === "sound") {
          return (
            <button
              key={s.slot}
              type="button"
              aria-label={`Sound ${muted ? "off" : "on"}`}
              className={cls}
              onClick={() => {
                play("click");
                toggle();
              }}
            >
              {inner}
            </button>
          );
        }
        if (s.kind === "external") {
          return (
            <a key={s.slot} href={s.href} target="_blank" rel="noreferrer" className={cls} onClick={() => play("click")}>
              {inner}
            </a>
          );
        }
        return (
          <Link key={s.slot} href={s.href} className={cls} onClick={() => play("click")}>
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Rewrite `app/layout.jsx`**

```jsx
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

import Hotbar from "@/components/mc/Hotbar";
import PageTransition from "@/components/PageTransition";
import BreakOverlay from "@/components/mc/BreakOverlay";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrainsMono",
});

export const metadata = {
  title: "Saurabh Nair — Software Developer",
  description:
    "Minecraft-themed portfolio of Saurabh Nair, software developer and CS + Economics student at the University of Toronto.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} pb-28`}>
        <BreakOverlay />
        <PageTransition>{children}</PageTransition>
        <Hotbar />
      </body>
    </html>
  );
}
```

Note: `BreakOverlay` is created in Task 5. Between this task and that one the
import will fail — Task 5 immediately follows and restores a clean build. If
running tasks in isolation, create a 1-line stub `export default function BreakOverlay(){return null}` now and flesh it out in Task 5.

- [ ] **Step 3: Delete the old nav components**

```bash
git rm components/Header.jsx components/Nav.jsx components/MobileNav.jsx
```

- [ ] **Step 4: Verify**

Run: `npm run build` then `npm run dev`
Expected: once Task 5 lands, build is clean; every route shows the fixed hotbar at the bottom; clicking a slot navigates; the active route's slot has a white outline; pressing `1`–`5` navigates; `8` toggles the sound label OFF/ON; `9` opens the PDF.

- [ ] **Step 5: Commit**

```bash
git add app/layout.jsx components/mc/Hotbar.jsx
git commit -m "feat: replace header/nav with Minecraft hotbar"
```

---

## Task 5: Route-change block-break transition

**Files:**
- Create: `components/mc/BreakOverlay.jsx`
- Delete: `components/StairTransition.jsx`, `components/Stairs.jsx`

**Interfaces:**
- Consumes: `usePathname`; `framer-motion`; `useSfx` from Task 3.
- Produces: `<BreakOverlay />` — a stone panel that "cracks" away on each route change; respects reduced motion.

- [ ] **Step 1: Create `components/mc/BreakOverlay.jsx`**

```jsx
"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSfx } from "@/hooks/useSfx";

export default function BreakOverlay() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { play } = useSfx();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    play("break");
  }, [pathname, play]);

  if (reduce) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className="fixed inset-0 z-40 pointer-events-none tex-stone"
        initial={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
        animate={{ opacity: [1, 1, 0.6, 0], clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.45, times: [0, 0.3, 0.6, 1], ease: "linear" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0,rgba(0,0,0,0.35)_70%)]" />
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Delete the stair transition**

```bash
git rm components/StairTransition.jsx components/Stairs.jsx
```

- [ ] **Step 3: Verify**

Run: `npm run dev`
Expected: navigating between routes shows a brief (~0.45s) stone overlay wiping upward + a "break" sound if unmuted. With OS "reduce motion" on, no overlay, instant swap. `npm run build` clean.

- [ ] **Step 4: Commit**

```bash
git add components/mc/BreakOverlay.jsx
git commit -m "feat: block-break route transition, replacing stair transition"
```

---

## Task 6: Builds page — Chest grid with category filter

**Files:**
- Create: `components/mc/Chest.jsx`
- Rewrite: `app/work/page.jsx`
- Delete: `components/WorkSliderBtns.jsx`
- Modify: `package.json` (remove `swiper`, `react-swiper`)

**Interfaces:**
- Consumes: `projects`, `sortedProjects`, `filterProjects`, `CATEGORIES` from data; `Sheet*` from `components/ui/sheet`; `BlockButton` from Task 3.
- Produces: `<Chest project={project} />`.

- [ ] **Step 1: Create `components/mc/Chest.jsx`**

```jsx
"use client";
import {
  Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import BlockButton from "@/components/mc/BlockButton";
import { useSfx } from "@/hooks/useSfx";

export default function Chest({ project }) {
  const { play } = useSfx();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          onClick={() => play("orb")}
          className={`group relative mc-bevel tex-plank p-4 text-left w-full h-full focus:outline focus:outline-2 focus:outline-white ${
            project.featured ? "sm:col-span-2" : ""
          }`}
        >
          <div className="font-mc text-[11px] text-[#d9b98a] uppercase">{project.category}</div>
          <div className="font-mc text-lg text-[#f4e4c1] mt-1">{project.title}</div>
          <p className="text-sm text-white/75 mt-2 line-clamp-3 font-primary">{project.blurb}</p>
          <span className="absolute right-3 top-3 text-xl opacity-70 group-hover:opacity-100">▦</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="tex-stone mc-bevel border-t-0 text-[#f4e4c1] max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="font-mc text-2xl text-[#f4e4c1]">{project.title}</SheetTitle>
        </SheetHeader>
        <p className="mt-3 text-white/85 font-primary max-w-[70ch]">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.stack.map((s) => (
            <span key={s} className="mc-bevel tex-obsidian px-2 py-1 text-xs font-mc text-[#a8f0c0]">
              {s}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-5">
          {project.links.live ? (
            <a href={project.links.live} target="_blank" rel="noreferrer">
              <BlockButton>Live</BlockButton>
            </a>
          ) : null}
          {project.links.github ? (
            <a href={project.links.github} target="_blank" rel="noreferrer">
              <BlockButton tex="obsidian">GitHub</BlockButton>
            </a>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 2: Rewrite `app/work/page.jsx`**

```jsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { projects, sortedProjects, filterProjects, CATEGORIES } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import Chest from "@/components/mc/Chest";

export default function Work() {
  const [cat, setCat] = useState("All");
  const list = sortedProjects(filterProjects(projects, cat));

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.4 } }}
      className="container mx-auto py-12"
    >
      <Sign>Builds</Sign>

      <div className="flex flex-wrap gap-1 mt-6 p-1 mc-bevel tex-stone w-max max-w-full">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`mc-bevel tex-dirt font-mc text-xs px-3 py-2 text-[#f4e4c1] focus:outline focus:outline-2 focus:outline-white ${
              cat === c ? "outline outline-2 outline-white" : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {list.map((p) => (
          <Chest key={p.slug} project={p} />
        ))}
      </div>
    </motion.section>
  );
}
```

- [ ] **Step 3: Remove swiper + old slider button**

```bash
git rm components/WorkSliderBtns.jsx
npm uninstall swiper react-swiper
```

- [ ] **Step 4: Verify**

Run: `npm run dev` → `/work`
Expected: "Builds" sign; category toggles filter the grid; the two featured projects appear first and span 2 columns on `sm+`; clicking a card opens a bottom sheet with description, stack chips and Live/GitHub buttons (Live hidden when empty). `npm run build` clean, no swiper in the bundle.

- [ ] **Step 5: Commit**

```bash
git add app/work/page.jsx components/mc/Chest.jsx package.json package-lock.json
git commit -m "feat: rebuild Builds page as filterable chest grid; drop swiper"
```

---

## Task 7: Spawn (home) page

**Files:**
- Rewrite: `app/page.jsx`
- Delete: `components/Stats.jsx`
- Modify: `package.json` (remove `react-countup`)

**Interfaces:**
- Consumes: `profile`, `stats` from data; `Sign`, `BlockButton`, `XpBar`, `StatusRow` from Task 3; `socialIcon` from Task 3; existing `Photo`.

- [ ] **Step 1: Rewrite `app/page.jsx`**

```jsx
import Image from "next/image";
import { profile, stats } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import BlockButton from "@/components/mc/BlockButton";
import XpBar from "@/components/mc/XpBar";
import StatusRow from "@/components/mc/StatusRow";
import { socialIcon } from "@/components/mc/icons";

export default function Home() {
  return (
    <section className="container mx-auto py-10">
      <StatusRow />

      <div className="flex flex-col xl:flex-row items-center justify-between gap-12 mt-8">
        <div className="order-2 xl:order-none text-center xl:text-left">
          <Sign className="mb-6">{profile.name}</Sign>
          <p className="font-mc text-lg text-emerald">{profile.role}</p>
          <p className="max-w-[520px] mt-4 text-white/80 font-primary">{profile.tagline}</p>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-8">
            <a href={profile.resumePdf} download>
              <BlockButton>Get the Resume</BlockButton>
            </a>
            <div className="flex gap-2">
              {profile.socials.map((s) => {
                const Icon = socialIcon(s.key);
                return (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.key}
                    className="mc-bevel tex-obsidian w-11 h-11 flex items-center justify-center text-[#a8f0c0] text-lg focus:outline focus:outline-2 focus:outline-white"
                  >
                    {Icon ? <Icon /> : "▦"}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="order-1 xl:order-none mc-bevel tex-plank p-3">
          <div className="relative w-[260px] h-[260px] xl:w-[320px] xl:h-[320px]">
            <Image src="/assets/photo.png" alt={profile.name} fill className="object-cover" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
        {stats.map((s) => (
          <XpBar key={s.label} label={s.label} value={s.value} max={s.max} suffix={s.suffix} count />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Remove react-countup + old Stats**

```bash
git rm components/Stats.jsx
npm uninstall react-countup
```

- [ ] **Step 3: Verify**

Run: `npm run dev` → `/`
Expected: hearts/hunger row; name on a plank sign; role in green; tagline; "Get the Resume" downloads the PDF; social blocks link out; photo in a plank frame; four XP bars count up when scrolled into view (instant with reduce-motion). `grep -r react-countup app components` returns nothing. `npm run build` clean.

- [ ] **Step 4: Commit**

```bash
git add app/page.jsx package.json package-lock.json
git commit -m "feat: rebuild home as Minecraft spawn screen; drop react-countup"
```

---

## Task 8: Inventory (resume), Trades (services), Chat (contact)

**Files:**
- Rewrite: `app/resume/page.jsx`
- Rewrite: `app/services/page.jsx`
- Rewrite: `app/contact/page.jsx`

**Interfaces:**
- Consumes: `experience`, `education`, `skills`, `services`, `profile` from data; `Panel`, `Sign`, `BlockButton`, `XpBar` from Task 3; existing `Tabs*`, `Input`, `Textarea`, `Select*` from `components/ui/*`.

- [ ] **Step 1: Rewrite `app/resume/page.jsx`**

```jsx
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { experience, education, skills, profile } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import Panel from "@/components/mc/Panel";
import XpBar from "@/components/mc/XpBar";

export default function Resume() {
  return (
    <section className="container mx-auto py-12">
      <Sign className="mb-8">Inventory</Sign>

      <Tabs defaultValue="experience" className="flex flex-col xl:flex-row gap-10">
        <TabsList className="flex xl:flex-col gap-2 h-max bg-transparent p-0">
          {["experience", "education", "skills", "about"].map((v) => (
            <TabsTrigger
              key={v}
              value={v}
              className="mc-bevel tex-dirt font-mc text-sm px-4 py-3 text-[#f4e4c1] capitalize data-[state=active]:outline data-[state=active]:outline-2 data-[state=active]:outline-white"
            >
              {v}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="w-full">
          <TabsContent value="experience" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {experience.map((e) => (
              <Panel key={e.role + e.org} tex="stone" className="p-5 text-[#f4e4c1]">
                <span className="font-mc text-xs text-emerald">
                  {e.start} – {e.end}
                </span>
                <h3 className="font-mc text-lg mt-1">{e.role}</h3>
                <p className="text-white/70 font-primary text-sm">
                  {e.org} · {e.location}
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-1 text-white/80 font-primary text-sm">
                  {e.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </Panel>
            ))}
          </TabsContent>

          <TabsContent value="education" className="grid grid-cols-1 gap-4">
            {education.map((ed) => (
              <Panel key={ed.school} tex="stone" className="p-5 text-[#f4e4c1]">
                <span className="font-mc text-xs text-emerald">
                  {ed.start} – {ed.end}
                </span>
                <h3 className="font-mc text-lg mt-1">{ed.school}</h3>
                <p className="text-white/80 font-primary text-sm">
                  {ed.credential} — {ed.detail}
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-1 text-white/80 font-primary text-sm">
                  {ed.honors.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </Panel>
            ))}
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            {skills.map((g) => (
              <div key={g.group}>
                <h3 className="font-mc text-lg text-[#f4e4c1] mb-3">{g.group}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {g.items.map((it) => (
                    <XpBar key={it.name} label={it.name} value={it.level} max={100} />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="about" className="text-[#f4e4c1]">
            <Panel tex="stone" className="p-5">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-primary text-sm">
                <li><span className="text-white/60">Name:</span> {profile.name}</li>
                <li><span className="text-white/60">Role:</span> {profile.role}</li>
                <li><span className="text-white/60">Location:</span> {profile.location}</li>
                <li><span className="text-white/60">Website:</span> {profile.website}</li>
                <li><span className="text-white/60">Email:</span> {profile.email}</li>
                <li><span className="text-white/60">Phone:</span> {profile.phone}</li>
              </ul>
              <p className="mt-4 text-white/80 font-primary text-sm max-w-[70ch]">{profile.tagline}</p>
            </Panel>
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
```

- [ ] **Step 2: Rewrite `app/services/page.jsx`**

```jsx
import { services } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import Panel from "@/components/mc/Panel";

export default function Services() {
  return (
    <section className="container mx-auto py-12">
      <Sign className="mb-8">Trades</Sign>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((s) => (
          <Panel key={s.num} tex="stone" className="p-6 text-[#f4e4c1]">
            <div className="font-mc text-3xl text-emerald">{s.num}</div>
            <h2 className="font-mc text-xl mt-2">{s.title}</h2>
            <p className="text-white/80 font-primary text-sm mt-2">{s.description}</p>
          </Panel>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Rewrite `app/contact/page.jsx`**

```jsx
"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { profile, services } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import Panel from "@/components/mc/Panel";
import BlockButton from "@/components/mc/BlockButton";

const info = [
  { icon: <FaPhoneAlt />, title: "Phone", value: profile.phone },
  { icon: <FaEnvelope />, title: "Email", value: profile.email },
  { icon: <FaMapMarkerAlt />, title: "Location", value: profile.location },
];

export default function Contact() {
  return (
    <section className="container mx-auto py-12">
      <Sign className="mb-8">Book &amp; Quill</Sign>

      <div className="flex flex-col xl:flex-row gap-8">
        <Panel
          as="form"
          tex="stone"
          className="p-8 flex flex-col gap-5 text-[#f4e4c1] xl:w-[60%]"
          onSubmit={(e) => e.preventDefault()}
        >
          <h3 className="font-mc text-2xl text-emerald">Let&apos;s build something</h3>
          <p className="text-white/70 font-primary text-sm">
            Send a note and I&apos;ll get back to you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="First name" className="mc-bevel bg-obsidian rounded-none" />
            <Input placeholder="Last name" className="mc-bevel bg-obsidian rounded-none" />
            <Input placeholder="Email" className="mc-bevel bg-obsidian rounded-none" />
            <Input placeholder="Phone" className="mc-bevel bg-obsidian rounded-none" />
          </div>
          <Select>
            <SelectTrigger className="mc-bevel bg-obsidian rounded-none">
              <SelectValue placeholder="Pick a trade" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Trades</SelectLabel>
                {services.map((s) => (
                  <SelectItem key={s.num} value={s.num}>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Textarea placeholder="Your message" className="h-[160px] mc-bevel bg-obsidian rounded-none" />
          <BlockButton className="max-w-44" type="submit">
            Send
          </BlockButton>
        </Panel>

        <ul className="flex flex-col gap-4 xl:w-[40%]">
          {info.map((it) => (
            <li key={it.title}>
              <Panel tex="dirt" className="p-4 flex items-center gap-4 text-[#f4e4c1]">
                <span className="mc-bevel tex-obsidian w-12 h-12 flex items-center justify-center text-emerald text-xl">
                  {it.icon}
                </span>
                <span>
                  <span className="block text-white/60 font-primary text-xs">{it.title}</span>
                  <span className="font-mc">{it.value}</span>
                </span>
              </Panel>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run dev`
Expected:
- `/resume` — "Inventory" sign; beveled tab blocks; Experience/Education as stone panels with resume content; Skills tab shows grouped XP bars; About shows the fact list.
- `/services` — "Trades" sign; four stone panels with the dev trades.
- `/contact` — "Book & Quill" sign; beveled form controls; the trade select lists the four services; submit does nothing (no reload).
- `npm run build` clean.

- [ ] **Step 5: Commit**

```bash
git add app/resume/page.jsx app/services/page.jsx app/contact/page.jsx
git commit -m "feat: reskin resume, services and contact pages"
```

---

## Task 9: Cleanup, full build, manual + a11y pass

**Files:**
- Delete any now-orphaned files.
- Modify: `README.md` (short note on the theme + where content lives).

- [ ] **Step 1: Find orphans**

Run:
```bash
git grep -l "components/Stats\|WorkSliderBtns\|StairTransition\|components/Header\|components/Nav\|MobileNav\|from \"swiper\|react-countup"
```
Expected: no matches. If any file still references a deleted module, fix or delete it.

- [ ] **Step 2: Confirm the deletes landed**

Run: `ls components`
Expected: `Photo.jsx`, `Social.jsx`, `PageTransition.jsx`, `mc/`, `ui/` — and none of `Header.jsx`, `Nav.jsx`, `MobileNav.jsx`, `Stairs.jsx`, `StairTransition.jsx`, `Stats.jsx`, `WorkSliderBtns.jsx`.

- [ ] **Step 3: Dependency sanity**

Run: `grep -E "swiper|react-swiper|react-countup" package.json`
Expected: no matches.
Run: `npm test`
Expected: PASS.
Run: `npm run build`
Expected: PASS, no warnings about missing modules.

- [ ] **Step 4: Manual checklist (dev server)**

- All five routes render with the hotbar; active slot outlined.
- Keys `1`–`5` navigate; `8` toggles sound label; `9` opens the PDF; keys do nothing while typing in the contact form.
- Route changes play the stone crack wipe (and a sound only after enabling it via slot 8; reload keeps it enabled).
- `/work` filter toggles; featured projects first; chest opens the bottom sheet; Live hidden when the URL is empty.
- Home XP bars animate on scroll-in.
- Enable OS "reduce motion" → no crack overlay, XP bars show final values immediately.
- Resize to 375px wide: no horizontal scroll; hotbar still reachable; grids collapse to one column.

- [ ] **Step 5: Accessibility pass**

Run Lighthouse (Chrome DevTools) on `/` and `/work`, Accessibility category.
Expected: score ≥ 90. Fix any contrast failures by darkening the scrim behind body text (`bg-black/30` wrapper) or lightening the parchment token; ensure every interactive element shows a visible focus outline (the `focus:outline` classes are already on buttons/links — add to any that Lighthouse flags).

- [ ] **Step 6: Update `README.md`**

Add near the top:

```markdown
## Theme

Minecraft-styled reskin. All page content lives in `data/portfolio.js`
(transcribed from `public/assets/resume.pdf`). Blocky UI primitives are in
`components/mc/`; textures and the bevel are CSS in `app/globals.css`.

Optional assets (site degrades gracefully without them):
`public/fonts/Monocraft.ttf`, `public/sfx/{click,break,orb}.mp3`.
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: remove orphaned components, document Minecraft theme"
```

---

## Self-Review Notes

- **Spec coverage:** content module (T2), MC kit + frontend-design primitives (T1, T3), hotbar nav + keys + sound (T4), block-break transition + reduced-motion (T5), Builds/Chest (T6), Spawn + stats (T7), Inventory/Trades/Chat (T8), asset graceful-degradation (T3 `useSfx`, T1 font fallback), cleanup + a11y/web-design-guidelines pass + Lighthouse (T9). Archive-vs-two-projects is a data-only edit (delete entries in `data/portfolio.js`), no task needed.
- **frontend-design skill:** run it before/at Task 3 to tune bevel depth, texture contrast and the type scale on the real components; run the **web-design-guidelines** check as part of Task 9 Step 5.
- **Placeholders:** none — every step has literal code or a literal command.
- **Type consistency:** `useSfx()` → `{muted, play, toggle}` used identically in Hotbar/BlockButton/Chest/BreakOverlay. `filterProjects`/`sortedProjects`/`CATEGORIES` signatures match between `data/portfolio.js`, the test, and `app/work/page.jsx`. `Panel` prop `tex` and `as` used consistently. `XpBar` props (`value,max,label,suffix,count`) match all call sites.
- **Known ordering caveat:** Task 4 imports `BreakOverlay` before Task 5 creates it — noted inline with a one-line stub fallback for isolated runs.

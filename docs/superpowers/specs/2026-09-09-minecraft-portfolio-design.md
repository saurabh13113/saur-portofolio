# Minecraft-Themed Portfolio — Design Spec

Date: 2026-09-09
Owner: Saurabh Nair
Status: Approved for planning

## Goal

Reskin the existing Next.js portfolio into a Minecraft-styled site that *looks*
playable — blocky beveled UI, Monocraft pixel font, CSS/SVG block textures,
hotbar navigation, hover-crack + block-break interactions, opt-in sound — while
staying a normal scrolling, route-based site that a recruiter can skim in 30
seconds. Not a walkable game.

All copy is corrected to match `public/assets/resume.pdf` (see §7).

## Decisions (locked)

| Axis | Decision |
|---|---|
| Playability | Static Minecraft skin + light interactions. No character, no movement. |
| Scope | Full replace. The Minecraft look IS the portfolio. |
| Content source | One shared module: `data/portfolio.js`. |
| Routing | Keep the 5 routes (`/`, `/work`, `/resume`, `/services`, `/contact`). Hotbar switches routes with a block-break transition. |
| Font | Monocraft (SIL OFL), self-hosted in `/public/fonts/`. JetBrains Mono kept for paragraph body text. |
| Textures / art | Pure CSS gradients + one inline-SVG noise tile. Zero image assets. No Mojang assets ever. |
| Sound | 3 CC0 clips, muted by default, toggle in hotbar. `localStorage` mute flag. |
| Content | Rewritten to match the current resume. |

## Approach

Reskin in place. Keep: App Router, the 5 route files, `framer-motion`
(transitions), and the shadcn primitives still worth keeping — `Dialog`,
`Tooltip`, `Tabs`, `Select`, `Input`, `Textarea`, `Button` (restyled).

Remove: `swiper` + `react-swiper` (replaced by a chest grid),
`react-countup` (replaced by a ~15-line XP-bar counter).

Add: no new runtime deps. A `useSfx()` hook using the native `Audio` API.

## Architecture

```
data/portfolio.js        <- single source of truth for all content
app/mc.css               <- @font-face, texture utilities, .mc-bevel (imported by globals.css)
app/globals.css          <- adds `@import "./mc.css";` + pixelated image-rendering
tailwind.config.js       <- fontFamily.mc, MC color palette
components/mc/
  Panel.jsx              server  beveled container (replaces bg-[#232329] rounded-xl)
  BlockButton.jsx        client  beveled button, press anim, optional sfx
  Hotbar.jsx             client  fixed bottom nav; slots 1-5 routes, 8 sound, 9 resume; keys 1-9
  Chest.jsx              client  project card; click -> Dialog with full detail
  Sign.jsx               server  hanging wood sign heading
  XpBar.jsx              client  segmented green bar; count-up variant for stats, static for skill levels
  StatusRow.jsx          server  decorative hearts + hunger row (hero only)
  BreakOverlay.jsx       client  full-screen 5-frame CSS crack transition
  icons.js               string-key -> react-icons component map
hooks/useSfx.js          client  lazy Audio loader, localStorage mute, muted by default
```

`app/layout.jsx`: `Header` -> `Hotbar`; keep `PageTransition`; `StairTransition`
-> `BreakOverlay`. Delete `components/Header.jsx`, `Nav.jsx`, `MobileNav.jsx`,
`Stairs.jsx`, `StairTransition.jsx`, `Stats.jsx`, `WorkSliderBtns.jsx` after
their replacements land.

### `data/portfolio.js` shape

```js
export const profile = {
  name, role, tagline, location, website, email, phone,
  socials: [{ key, href }],           // key -> icon via icons.js
  resumePdf: "/assets/resume.pdf",
};
export const stats = [{ label, value, max, suffix }];        // XP bars on home
export const projects = [{
  slug, title, blurb, description, category,               // category: Backend | FullStack | Frontend | ML
  featured: bool, stack: [string], links: { live, github }, image?,
}];
export const experience = [{ role, org, location, start, end, bullets: [string] }];
export const education = [{ school, credential, detail, start, end, honors: [string] }];
export const skills = [{ group, items: [{ name, level }] }];  // group: Languages | Frameworks | Tools | Libraries
export const services = [{ num, title, description }];
export const hotbar = [{ slot, label, kind, href }];         // kind: route | sound | external
```

Icons cannot be serialized into a data module, so `stack`/`socials`/`skills`
use string keys resolved through `components/mc/icons.js`. The test in §8
asserts every key resolves.

## Visual system

Run the **frontend-design** skill during implementation to fix the MC visual
system before building components:

- **Bevel**: 4px hard border — 2px light (`inset` top/left) + 2px dark
  (bottom/right), no border-radius anywhere. `.mc-bevel--pressed` inverts it and
  nudges content 2px down/right.
- **Textures** (`@layer components` in `mc.css`): `.tex-grass`, `.tex-dirt`,
  `.tex-stone`, `.tex-plank`, `.tex-obsidian` — layered `linear-gradient` /
  `repeating-linear-gradient` + a single `data:image/svg+xml` fractal-noise tile
  at low opacity, `background-size` ~16px. `image-rendering: pixelated` globally.
- **Palette** (`tailwind.config.js` extend):
  `grass #5b8a3c / #7cb342`, `dirt #866043 / #6b4a32`, `stone #7f7f7f / #565656`,
  `wood #9c6b3f`, `redstone #d13a2b`, `emerald #2ecc71`, `obsidian #14121c`,
  `xp #7cff2f`. Keep existing `accent` green, alias to emerald.
- **Type**: `--font-mc` (Monocraft) for headings, labels, buttons, nav, stat
  numbers, sign text. `--font-body` (JetBrains Mono) for paragraphs ≥ 2 lines.
- Check against **web-design-guidelines**: text contrast ≥ 4.5:1 over textures
  (add a subtle dark scrim behind body copy), visible focus ring on every
  interactive element (yellow selection outline, the MC hotbar style), 44px min
  touch targets, `prefers-reduced-motion` disables crack frames and count-up.

## Pages

### `/` — Spawn
- `StatusRow` (hearts + hunger) across the top.
- Left: `Sign` with name; role line; tagline; `BlockButton` "Get the Resume"
  (downloads `resume.pdf`); socials as beveled item slots.
- Right: `Photo` reframed as a squared beveled item-frame (keep the existing
  rotating accent border, drop the circle).
- Below: `stats` as four `XpBar`s with count-up on view.

### `/work` — Builds
- Heading `Sign` "Builds".
- Category filter: hotbar-style toggle row (All / FullStack / Backend / ML /
  Frontend). Pure client `useState` filter over `projects`.
- Responsive grid of `Chest` cards (`featured` first, larger). Card face: closed
  chest texture, `num`, `title`, category tag. Click -> shadcn `Dialog`:
  `description`, stack as "enchantment" tags, Live + GitHub `BlockButton`s.
- Cards render without an image (texture face), so resume projects with no
  screenshot are fine.

### `/resume` — Inventory
- Keep shadcn `Tabs`, restyled as beveled tab blocks: Experience / Education /
  Skills / About.
- Experience & Education items -> `Panel`s (date as emerald tag, role/credential
  as MC heading, bullets as body text).
- Skills tab: four groups; each item an item-slot with icon + a static `XpBar`
  at `level`.
- About: `profile` facts as a 2-col slot list.

### `/services` — Trades (villager theme)
- Four `Panel`s styled as villager trade offers, content from `services` (§7).

### `/contact` — Book & Quill
- Reskin the existing form: `Input` / `Textarea` / `Select` get beveled classes,
  submit is a `BlockButton`. Form stays client-only / non-submitting (unchanged
  from today — no backend). Select options come from `services`.
- Info items (phone / email / location) -> beveled slots from `profile`.

## Interactions

- **Route transition** — `BreakOverlay` plays a 5-frame CSS crack keyframe
  animation (SVG data-URIs) + optional `break` sfx, ~450ms, over
  `AnimatePresence` (reuses the `PageTransition` / `StairTransition` wiring).
- **Hover-crack** — `Chest` and `BlockButton` fade in a faint crack SVG overlay
  on hover; click sets `.mc-bevel--pressed` + plays `click` sfx.
- **Sound** — `useSfx()` lazy-loads `/public/sfx/{click,break,orb}.*`, reads a
  `localStorage` mute flag defaulting to muted, exposes `play(name)` and
  `toggle()`. Hotbar slot 8 is the toggle (speaker icon states).
- **Hotbar keys** — `1`–`9` navigate/activate the matching slot; active route
  slot shows the white selection outline. Ignored when a text input is focused.
- `prefers-reduced-motion`: skip crack frames (instant swap), skip count-up
  (show final value).

## Assets (dropped in by owner — binaries can't be fetched here)

| Path | What | License |
|---|---|---|
| `public/fonts/Monocraft.ttf` | Monocraft font | SIL OFL 1.1 — github.com/IdreesInc/Monocraft/releases |
| `public/sfx/click.mp3` | short UI tick | CC0 — e.g. freesound.org / kenney.nl UI audio |
| `public/sfx/break.mp3` | block-break thunk | CC0 |
| `public/sfx/orb.mp3` | XP pickup blip | CC0 |

If the font/sfx files are absent: font falls back to a monospace stack; `useSfx`
no-ops on missing files. Site works either way. The plan must gate audio/font on
file presence, not assume it.

## Content — rewritten from `public/assets/resume.pdf`

`profile`: Saurabh Nair · "Software Developer" · tagline references CS + Economics
double major at the University of Toronto, from Abu Dhabi 🇦🇪 now in Toronto ·
location "Toronto, ON" · website saurabhnair.com · email
saurabhnair13113@gmail.com · phone +1 647-831-6703 · socials GitHub
(github.com/saurabh13113) + LinkedIn + email.

`stats` (honest, from resume): `4` Internships · `3.73` CGPA (max 4, no suffix) ·
`4` Dean's List years · `19` Shipped projects.

`experience` (verbatim roles/dates/locations from the PDF, bullets condensed):
1. Software Developer Intern — BAYER Canada, Toronto, ON — May 2025 – August 2026
   — DRL Redesign on Radimetrics (+28% alert-filter accuracy); Jenkins+AWS OS
   patch pipeline (−35% release prep); RHEL/Alma dependency upgrades for 3.8
   (−20% post-release defects).
2. Software Engineering Intern — Kaytoons Inc., San Jose, CA — Sep 2024 – May 2025
   — backend for a children's education app (uptime → 90%); PlayHT voice-cloning
   in Python (+18% session duration).
3. Teaching Assistant — University of Toronto, Mississauga, ON — Sep 2024 – May
   2025 — CSC236, ECO225, CSC263; graded + office hours for 150+ students.
4. Machine Learning Intern — Emirates Steel Arkan, Abu Dhabi, UAE — Jun 2024 –
   Aug 2024 — predictive-maintenance models (−15% unplanned downtime);
   real-time consumption dashboard (~$1.2M/yr raw-material savings); feature
   engineering + tuning (+12% precision).

`education`: University of Toronto — B.Sc Computer Science & B.A Economics (Double
Major), CGPA 3.73 — Expct. Grad. Jun 2027 — honors: Dean's List Scholar 2022–2025,
UofT Scholar Award 2022. (Drop the old Abu Dhabi Indian School row unless the
owner wants it back.)

`skills` (from the resume's four lines, `level` is a rough self-rating 60–95 for
the XP bar visual):
- Languages: Java, JavaScript/TypeScript, Python, C, R, PostgreSQL, MySQL, Stata,
  HTML/CSS, Bash/Shell
- Frameworks: Spring Boot, React, Next.js, Node.js, Flask, Hibernate/JPA,
  TailwindCSS, Material-UI
- Tools: Git, Docker, Maven, Postman, Jenkins, AWS, GCP, JupyterHub, Linux,
  Firebase, Vercel, Railway
- Libraries: Pandas, SciKit-Learn, OpenCV, RoboFlow, MediaPipe

`projects`: add two `featured: true` entries from the resume at the top —
- **Feynomenon – AI-Powered Learning Tutor** — Next.js, TailwindCSS, Node.js,
  MongoDB, Firebase, Gemini — "Winner, TMU Solution Hacks '25". Adaptive AI tutor
  built on the Feynman technique; Firebase auth; MongoDB analytics; deployed on
  Vercel + Railway.
- **Round1 – Multimodal AI Interviewer** — Next.js, TailwindCSS, Firebase,
  MediaPipe, Gemini, RoboFlow — job-role-aware interview simulator with a
  transparent LLM rubric + behavioral metrics via MediaPipe; recruiter dashboard.
Links: fill `github` from the owner's GitHub; `live` left blank if unknown (the
`Chest` dialog hides a missing link).
Then keep the existing 19 repo projects as the "archive" (real repos + real
screenshots). Re-tag `category` to the new set. If the owner wants only the two
resume projects, delete the archive block — no code change.

`services` (dev trades, derived from the resume):
1. Full-Stack Web Apps — Next.js / React / Node.js, auth, DB, deploy.
2. Backend & APIs — Spring Boot / Flask, REST, data modeling.
3. ML & Data — predictive models, feature engineering, dashboards.
4. DevOps & Cloud Automation — Jenkins / Docker / AWS / GCP pipelines.

`app/layout.jsx` metadata: title "Saurabh Nair — Software Developer",
description updated.

## Out of scope

- Walkable character / movement / world.
- Contact form backend (stays non-submitting, as today).
- Konami / easter-egg mini-game.
- Unrelated refactors beyond deleting the replaced components.
- Fetching font/sfx binaries — owner drops those in.

## Testing

- `test/portfolio.test.mjs` (node, assert only, no framework):
  - every `stack` / `social` / `skill` key resolves in `icons.js`
  - every `hotbar` slot has a valid `kind` and, for `route`, an existing app path
  - `projects` slugs are unique; `featured` projects sort first
  - category filter helper returns only matching projects for each category and
    all for "All"
- Manual checklist: `npm run build` clean; all 5 routes render; hotbar mouse +
  `1`–`9` nav; `Chest` dialog opens/closes; mute toggle persists across reload;
  `prefers-reduced-motion` kills crack animation + count-up; Lighthouse a11y ≥ 90;
  layout holds at 375px width.

## Build order (for the plan)

1. `tailwind.config.js` palette + `app/mc.css` (font, textures, bevel) + wire into
   `globals.css`.
2. `data/portfolio.js` + `components/mc/icons.js` + the test.
3. MC kit: `Panel`, `Sign`, `BlockButton`, `XpBar`, `StatusRow`.
4. `Hotbar` + `hooks/useSfx.js`; swap into `layout.jsx`; delete old nav.
5. `BreakOverlay`; replace `StairTransition`.
6. `Chest` + `/work` rebuild; remove `swiper`.
7. `/` rebuild; remove `react-countup`.
8. `/resume`, `/services`, `/contact` reskin.
9. Delete orphaned components; `npm run build`; manual checklist; Lighthouse.

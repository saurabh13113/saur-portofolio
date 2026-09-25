# Portfolio Revamp: "Saurabh's Room" — Design Spec

Date: 2026-09-25
Status: Approved for planning

## Context

The site currently uses a Minecraft-specific theme (blocks, hotbar, playable
character walking the page). It's distinctive but carries trademark-adjacent
risk, and the walkable-character mechanic adds real build/perf weight for
uncertain payoff on mobile. This spec replaces it with an original,
game-flavored concept while keeping what works: the gamified resume language
(XP bars, quest-like framing), the CSS/SVG "hand-built pixel texture"
technique already proven in `mc-bevel`/`tex-*`, and the existing Next.js App
Router structure and `data/portfolio.js` content model.

This also folds in the previously-agreed fix to the contact form, which
currently calls `e.preventDefault()` and does nothing.

## Concept & tone

A single illustrated pixel-art room — Saurabh's late-night study/workshop —
rendered as the new home page. Instead of a hero + stat blocks, visitors see
the room and click objects in it to navigate to real pages. No character to
control; the room itself is the nav surface. Mood: cozy night — near-black
background, warm amber lamp glow as the primary accent, existing emerald kept
as a secondary accent so Work/Resume/Contact stay visually tied to the room.

Polish comes from motion, not literal gameplay: idle ambient animation (lamp
flicker, monitor glow pulse, curtain sway), a short zoom/fade transition on
click-through, tactile hover states (wiggle/glow) on hotspots.

## Room → site map

| Room object | Route | Notes |
|---|---|---|
| Desk + monitor | `/work` | Monitor shows a faint animated scroll of code/text as ambient detail |
| Bookshelf | `/resume` | Books represent experience/education/skills entries |
| Trophy/plant shelf | home-page ambient flavor | Not a separate route — surfaces hackathon win / Dean's List as flavor text near the shelf, no click required |
| Phone or mail slot on desk | `/contact` | |
| Window or door | `/services` | |
| Signpost/plaque | (decorative) | Name + tagline, for visitors who don't immediately parse hotspots |

## Visual system

- **Palette**: near-black room background (`#0d0f16`-ish), warm amber accent
  for lamp/glow states, existing emerald retained as secondary accent,
  soft blue-purple ambient shadow fill.
- **Construction**: CSS layered box-shadow "pixels" and/or hand-built SVG,
  same technique as the current `mc-bevel`/`tex-plank`/`tex-stone` textures.
  No image-generation pipeline, no new binary asset dependency, no new
  runtime library — keeps this within the existing stack.
- **Typography**: JetBrains Mono stays as the base/body font. A pixel-style
  display face is reserved for short signage/labels only (object name
  tooltips, the plaque) — not for body copy, to avoid the legibility issue
  in the current `font-mc` usage on real content (resume bullets, skill
  names).

## Interaction model

- Hotspots are real `<button>` elements with `aria-label`s, positioned over
  the room scene. This is the accessibility baseline: a screen reader or
  keyboard-only visitor gets a normal list of labeled links/buttons under
  the visual layer, not an inaccessible canvas.
- Click → short zoom/fade transition (reuse `PageTransition.jsx`) → a real
  Next.js route. The room is a navigation surface, not a SPA state machine;
  pages stay linkable and back-button-friendly.
- **Mobile**: the room renders as a static illustration with tap targets
  ≥44px (matching the existing a11y bar). No drag/pan/walk mechanic — this
  is why the walk-around-character option was ruled out during design.

## Non-goals

- No 3D/WebGL and no character movement/physics. The project already tried
  and rolled back a three.js scene for weight reasons (see commit history);
  this design deliberately stays a 2D, CSS/SVG-only scene.
- No CMS. Content continues to live in `data/portfolio.js`.
- No AI-generated or externally-sourced art assets — everything is
  code-drawn, consistent with the current codebase's approach.

## Work-page cleanup (carried over from portfolio review)

Independent of the room, `/work` gets a content-density fix: the 2 featured
projects (Feynomenon, Round1 — both now have live links per the user) stay
as full cards; the other ~17 class/archive projects collapse into a compact
list or table (title, one-line blurb, stack tags, GitHub link) instead of
full chest cards, so the featured work isn't diluted.

## Contact form

Replace the current no-op `onSubmit={(e) => e.preventDefault()}` with a
Next.js API route (`app/api/contact/route.js`) that sends the submitted
form data to `profile.email` via [Resend](https://resend.com) (free tier,
single API call, no mail server to run). The route:

- Validates required fields server-side (name, email, message) before
  sending — this is a trust-boundary input, so it gets real validation
  even though the rest of the app doesn't need much.
- Returns a success/error state the form surfaces inline (replace the
  current silent submit with a visible "Sent" / "Something went wrong"
  state).
- Needs a `RESEND_API_KEY` environment variable — the user provides this;
  not something to hardcode or invent.

## Easter eggs

Small, optional, discoverable — none block core navigation or content:

- **Hidden room objects**: a few non-nav clickable details (rubber duck,
  cat, poster) trigger a small tooltip/animation on interaction.
- **Interactive cat**: reacts to clicks/hover (meow sound optional, animation
  required) — treated as one of the hidden-object eggs, just with more
  personality.
- **Photo frame carousel**: clicking a frame on the wall/desk cycles through
  a few personal photos.
- **Keyboard → music**: clicking the desk keyboard plays a short clip of the
  user's favorite piece.
- **Speakers → songs on loop**: clicking speakers in the room plays/loops a
  short clip from the user's chosen tracks.
- **Konami-style key combo**: a hidden key sequence (anywhere on the site)
  unlocks something extra — candidate: an alternate palette/skin or a
  hidden bonus message. Exact payload TBD at implementation time, kept
  small.
- **Console message**: a styled `console.log` easter egg on page load.

**Open dependency**: the music/song eggs need actual audio files from the
user (short clips, correctly licensed for public site use) — these can't be
sourced automatically and are a blocking input for that specific egg, not
for the rest of the revamp.

All audio-based eggs must default to muted/off and require an explicit user
click to play (never autoplay) — this is a hard accessibility/UX requirement,
not a nice-to-have.

## Testing

- Keep `test/portfolio.test.mjs` coverage for data-layer functions
  (`filterProjects`, `sortedProjects`) — unaffected by this redesign.
- Add a small test for the contact API route: valid payload returns success
  shape, missing required field returns a validation error — this is the
  one real branch of logic worth a runnable check per the fields
  boundary it sits on.
- Manual verification: keyboard-only nav reaches every room hotspot and
  every page; mobile tap targets meet the 44px minimum; no easter egg
  autoplays audio.

## Out of scope for this pass

- Analytics, OG image generation, and the skill-percentage-vs-tier question
  raised in the earlier review are good follow-ups but not required for
  this redesign to ship; can be separate small follow-up tasks.

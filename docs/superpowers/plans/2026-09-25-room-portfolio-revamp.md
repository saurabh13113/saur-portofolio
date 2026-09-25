# Room Portfolio Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Minecraft-specific home page and walking character with an original click-through pixel-art "room" scene, fix the no-op contact form so it actually emails the owner, declutter the work page, and add the requested easter eggs.

**Architecture:** The room is a single responsive scene (`components/room/Room.jsx`) built from existing CSS bevel/texture classes plus small absolutely-positioned buttons — no new rendering engine, no canvas, no WebGL. Each nav object is a real `<button>` with an `aria-label` that navigates via `next/navigation` after a short zoom-out transition; there is no separate accessible-fallback list because the buttons themselves are already screen-reader- and keyboard-operable. Easter eggs are small, independent, reusable components dropped into the same scene. The contact form gets a real backend via a Next.js API route calling Resend.

**Tech Stack:** Next.js 14 App Router, React 18, Tailwind, framer-motion (existing), Resend (new, for outbound email), Node's built-in `node:test` (existing test runner).

**Spec:** `docs/superpowers/specs/2026-09-25-room-portfolio-revamp-design.md`

## Global Constraints

- No 3D/WebGL and no character-movement physics (spec Non-goals) — the scene is static CSS/SVG, hotspots don't move.
- No new asset pipeline / no AI-generated or purchased art — everything is built from the existing `mc-bevel`/`tex-*` CSS classes and emoji glyphs, matching the visual language already used in `PageCharacter.jsx` and `StatusRow.jsx`.
- No CMS — content stays in `data/portfolio.js`.
- Every audio easter egg must default to silent and only ever play after an explicit click on that object — never on page load, never on hover (spec hard rule).
- All interactive room elements must be real focusable elements (`<button>`) with a non-empty `aria-label`, and must have a minimum 44×44px hit area regardless of how the room scene scales down on narrow viewports.
- Reuse `useSfx`'s pattern (cache the `Audio` object, swallow `.play()` rejections) for any new audio — don't invent a second audio approach.
- Keep `test/portfolio.test.mjs` passing unmodified; it covers unrelated data-layer behavior.

## Review Focus

- Contact form submitted with a missing or malformed field (e.g. no `@` in email) — must show a specific inline error next to that field, not silently fail or throw. (Task 1, Task 3)
- The Resend call fails (bad/missing API key, network error) — the form must show a visible "something went wrong" state, not spin forever or look like it succeeded. (Task 2, Task 3)
- A keyboard-only visitor tabs through the home page — every room hotspot and every easter-egg object must be reachable via Tab and activatable via Enter/Space, in a sane order, with nothing to the mouse only. (Task 5, Task 8, Task 9, Task 10, Task 11)
- Viewport at ~375px wide (small phone) — room hotspots and easter-egg buttons must stay ≥44×44px tap targets and must not overlap each other. (Task 4, Task 5)
- A visitor clicks a looping audio easter egg (the speaker) and never clicks it again — audio must not keep looping forever after they navigate away from the page. (Task 11)

---

## Task 1: Contact form validation

**Files:**
- Create: `lib/validateContact.js`
- Test: `test/validateContact.test.mjs`

**Interfaces:**
- Produces: `validateContact(input)` where `input` is `{ firstName, lastName, email, message }` (extra keys ignored). Returns `{ ok: true, data: { firstName, lastName, email, message } }` (all trimmed strings) on success, or `{ ok: false, errors: { [field]: string } }` on failure. Later tasks (API route, form UI) call this exact function and read `.ok`/`.data`/`.errors`.

- [ ] **Step 1: Write the failing tests**

```js
// test/validateContact.test.mjs
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test test/validateContact.test.mjs`
Expected: FAIL — `Cannot find module '../lib/validateContact.js'`

- [ ] **Step 3: Write the implementation**

```js
// lib/validateContact.js
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input = {}) {
  const { firstName, lastName, email, message } = input ?? {};
  const errors = {};

  if (!firstName?.trim()) errors.firstName = "First name is required.";
  if (!lastName?.trim()) errors.lastName = "Last name is required.";
  if (!email?.trim() || !EMAIL_RE.test(email.trim())) errors.email = "A valid email is required.";
  if (!message?.trim()) errors.message = "Message can't be empty.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      message: message.trim(),
    },
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test test/validateContact.test.mjs`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/validateContact.js test/validateContact.test.mjs
git commit -m "feat: add contact form validation"
```

---

## Task 2: Contact API route

**Files:**
- Create: `app/api/contact/route.js`
- Modify: `package.json` (add `resend` dependency)

**Interfaces:**
- Consumes: `validateContact` from Task 1 (`{ ok, data | errors }`), `profile.email` from `data/portfolio.js`.
- Produces: `POST /api/contact` — accepts JSON `{ firstName, lastName, email, message }`, returns `{ ok: true }` (200) or `{ ok: false, errors }` (400 for validation, 502 for send failure). Task 3's form calls this exact endpoint/shape.

- [ ] **Step 1: Install the dependency**

Run: `npm install resend`

- [ ] **Step 2: Write the route**

```js
// app/api/contact/route.js
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateContact } from "@/lib/validateContact";
import { profile } from "@/data/portfolio";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const result = validateContact(body ?? {});

  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const { firstName, lastName, email, message } = result.data;

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: profile.email,
      replyTo: email,
      subject: `New message from ${firstName} ${lastName}`,
      text: `${message}\n\n— ${firstName} ${lastName} <${email}>`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, errors: { form: "Couldn't send right now — try again in a bit." } },
      { status: 502 }
    );
  }
}
```

- [ ] **Step 3: Add the API key locally (not committed)**

Create `.env.local` in the project root (already gitignored via `.env*.local`) with:

```
RESEND_API_KEY=your_real_key_here
```

Get a free key at https://resend.com after signing up — no code changes needed once it's in `.env.local`.

- [ ] **Step 4: Manually verify the route**

With `npm run dev` running, verify both branches by hand (no test framework mocks `fetch`/Next's route handlers here, so this is a manual check rather than an automated one):

```bash
curl -s -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d "{}"
```

Expected: `{"ok":false,"errors":{"firstName":"First name is required.", ...}}` with a 400 status.

```bash
curl -s -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","message":"hello"}'
```

Expected (once `RESEND_API_KEY` is set to a real key): `{"ok":true}` and an email arrives at `profile.email`.

- [ ] **Step 5: Commit**

```bash
git add app/api/contact/route.js package.json package-lock.json
git commit -m "feat: add contact form API route backed by Resend"
```

---

## Task 3: Wire the contact form UI to the API

**Files:**
- Modify: `app/contact/page.jsx`

**Interfaces:**
- Consumes: `POST /api/contact` from Task 2 (request/response shape as defined there).

- [ ] **Step 1: Replace the no-op submit handler with a real one**

Replace the whole file's `Contact` function body with a version that posts to the API and surfaces state. Full replacement of `app/contact/page.jsx`:

```jsx
"use client";
import { useState } from "react";
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
  const [trade, setTrade] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});

    const form = new FormData(e.currentTarget);
    const payload = {
      firstName: form.get("contact-first"),
      lastName: form.get("contact-last"),
      email: form.get("contact-email"),
      message: form.get("contact-message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) {
        setErrors(data.errors ?? {});
        setStatus("error");
        return;
      }
      setStatus("sent");
      e.currentTarget.reset();
      setTrade("");
    } catch {
      setErrors({ form: "Couldn't reach the server — check your connection and try again." });
      setStatus("error");
    }
  }

  return (
    <section className="container mx-auto py-12">
      <Sign className="mb-8">Book &amp; Quill</Sign>

      <div className="flex flex-col xl:flex-row gap-8">
        <Panel as="form" tex="stone" className="p-8 flex flex-col gap-5 text-[#f4e4c1] xl:w-[60%]" onSubmit={handleSubmit}>
          <h3 className="font-mc text-2xl text-emerald">Let&apos;s build something</h3>
          <p className="text-white/70 font-primary text-sm">Send a note and I&apos;ll get back to you.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="sr-only" htmlFor="contact-first">First name</label>
            <Input id="contact-first" name="contact-first" placeholder="First name" required className="mc-bevel bg-obsidian rounded-none" />
            <label className="sr-only" htmlFor="contact-last">Last name</label>
            <Input id="contact-last" name="contact-last" placeholder="Last name" required className="mc-bevel bg-obsidian rounded-none" />
            <label className="sr-only" htmlFor="contact-email">Email</label>
            <Input id="contact-email" name="contact-email" type="email" placeholder="Email" required className="mc-bevel bg-obsidian rounded-none" />
            <label className="sr-only" htmlFor="contact-phone">Phone</label>
            <Input id="contact-phone" name="contact-phone" placeholder="Phone" className="mc-bevel bg-obsidian rounded-none" />
          </div>
          {errors.firstName || errors.lastName || errors.email ? (
            <p role="alert" className="text-redstone text-xs">
              {errors.firstName ?? errors.lastName ?? errors.email}
            </p>
          ) : null}
          <Select value={trade} onValueChange={setTrade}>
            <SelectTrigger aria-label="Pick a trade" className="mc-bevel bg-obsidian rounded-none">
              <SelectValue placeholder="Pick a trade" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Trades</SelectLabel>
                {services.map((s) => (
                  <SelectItem key={s.num} value={s.num}>{s.title}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <label className="sr-only" htmlFor="contact-message">Message</label>
          <Textarea id="contact-message" name="contact-message" placeholder="Your message" required className="h-[160px] mc-bevel bg-obsidian rounded-none" />
          {errors.message ? <p role="alert" className="text-redstone text-xs">{errors.message}</p> : null}
          <BlockButton className="max-w-44" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send"}
          </BlockButton>
          {status === "sent" ? (
            <p role="status" className="text-emerald text-sm">Message sent — I&apos;ll get back to you soon.</p>
          ) : null}
          {status === "error" && errors.form ? (
            <p role="alert" className="text-redstone text-sm">{errors.form}</p>
          ) : null}
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

- [ ] **Step 2: Manually verify in the browser**

Run `npm run dev`, open `/contact`:
- Submit empty form → inline red error text appears, no crash, button re-enables.
- Fill all required fields with a real email you can check, submit → button reads "Sending...", then a green "Message sent" line appears and the form clears.
- Temporarily rename `.env.local`'s key to something invalid, resubmit → red "Couldn't send right now" message appears instead of hanging.

- [ ] **Step 3: Commit**

```bash
git add app/contact/page.jsx
git commit -m "feat: wire contact form to the real API endpoint"
```

---

## Task 4: Room scene shell (static)

**Files:**
- Create: `components/room/Room.jsx`
- Modify: `app/globals.css` (add ambient keyframes)

**Interfaces:**
- Produces: `<Room />` — a self-contained default export, no props. Later tasks (5, 8–11) import and place hotspots/easter eggs inside this same file.

- [ ] **Step 1: Add ambient animation keyframes**

Add to `app/globals.css` inside the existing `@layer components { ... }` block (after `.mc-bumped`'s reduced-motion rule):

```css
  @keyframes mc-lamp-flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.85; }
  }
  .mc-lamp {
    animation: mc-lamp-flicker 3s ease-in-out infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .mc-lamp { animation: none; }
  }
```

- [ ] **Step 2: Build the static room**

```jsx
// components/room/Room.jsx
import { profile } from "@/data/portfolio";

export default function Room() {
  return (
    <section className="container mx-auto py-10">
      <div className="text-center mb-6">
        <h1 className="font-mc text-2xl text-[#f4e4c1]">{profile.name}</h1>
        <p className="font-mc text-sm text-emerald mt-1">{profile.tagline}</p>
      </div>

      <div className="relative aspect-[16/10] w-full max-w-[900px] mx-auto mc-bevel tex-stone overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-[18%] tex-plank" aria-hidden="true" />
        <div
          className="absolute w-10 h-14 rounded-t-full bg-[#f4d27a] shadow-[0_0_24px_10px_rgba(244,210,122,0.35)] mc-lamp"
          style={{ left: "5%", top: "6%" }}
          aria-hidden="true"
        />
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 mc-bevel tex-plank px-2 py-1 text-[9px] font-mc text-[#f4e4c1] text-center leading-tight max-w-[110px]"
          style={{ left: "88%", top: "18%" }}
        >
          🏆 TMU Solution Hacks &apos;25 winner
          <br />
          🌱 Dean&apos;s List, 4 yrs
        </div>
      </div>
    </section>
  );
}
```

This trophy/plant shelf is ambient flavor text, not a hotspot — no `<button>`, no navigation, so it's excluded from the keyboard-tab and click-target requirements that apply to the interactive objects.

- [ ] **Step 3: Manually verify**

Temporarily render `<Room />` somewhere reachable (e.g. swap it in for the body of `app/page.jsx` — Task 6 makes this permanent) and load `/` at 1440px and at 375px width. Expected: the room panel keeps its aspect ratio and doesn't overflow horizontally at 375px; the lamp gently pulses; with `prefers-reduced-motion` enabled in devtools, the lamp is static.

- [ ] **Step 4: Commit**

```bash
git add components/room/Room.jsx app/globals.css
git commit -m "feat: add static room scene shell"
```

---

## Task 5: Room navigation hotspots

**Files:**
- Create: `components/room/RoomHotspot.jsx`
- Modify: `components/room/Room.jsx`
- Modify: `app/page.jsx` (replace entirely with the room)

**Interfaces:**
- Consumes: nothing from earlier tasks beyond `Room.jsx` from Task 4.
- Produces: `<RoomHotspot href label icon style />` — `style` only ever carries `{ left, top }` percentage strings for positioning; size is fixed via className so it never scales below the tap-target minimum. `Room.jsx` now exports the room with hotspots wired in; other tasks add more children to the same scene div.

- [ ] **Step 1: Write the hotspot component**

```jsx
// components/room/RoomHotspot.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomHotspot({ href, label, icon, style }) {
  const router = useRouter();
  const [zooming, setZooming] = useState(false);

  function handleClick() {
    if (zooming) return;
    setZooming(true);
    setTimeout(() => router.push(href), 260);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      style={style}
      className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-14 min-h-14 mc-bevel tex-plank flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[#f4e4c1] font-mc text-[9px] transition-transform duration-200 hover:scale-110 focus:outline focus:outline-2 focus:outline-white ${
        zooming ? "scale-150 opacity-0" : ""
      }`}
    >
      <span className="text-xl" aria-hidden="true">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
```

- [ ] **Step 2: Place hotspots in the room**

Modify `components/room/Room.jsx` — add the import and hotspot list, and render them inside the scene div (after the lamp):

```jsx
import { profile } from "@/data/portfolio";
import RoomHotspot from "@/components/room/RoomHotspot";

const HOTSPOTS = [
  { href: "/work", label: "Work", icon: "🖥️", style: { left: "20%", top: "55%" } },
  { href: "/resume", label: "Resume", icon: "📚", style: { left: "78%", top: "35%" } },
  { href: "/contact", label: "Contact", icon: "☎️", style: { left: "12%", top: "80%" } },
  { href: "/services", label: "Services", icon: "🪟", style: { left: "50%", top: "20%" } },
];
```

(Icons: 🖥️ Work, 📚 Resume, ☎️ Contact, 🪟 Services — written as escapes above only if your editor mangles emoji; paste the literal emoji directly if it round-trips fine.)

```jsx
        {HOTSPOTS.map((h) => (
          <RoomHotspot key={h.href} {...h} />
        ))}
```

- [ ] **Step 3: Make the room the home page**

Replace the full contents of `app/page.jsx`:

```jsx
import Room from "@/components/room/Room";

export default function Home() {
  return <Room />;
}
```

- [ ] **Step 4: Manually verify**

`npm run dev`, open `/`. Click each of the 4 hotspots — each navigates to the right page after a brief zoom-out. Tab through the page with keyboard only — all 4 hotspots receive visible focus outlines in a sane order and Enter activates them. Shrink the window to 375px — every hotspot stays at least 44×44px (use devtools' box model on one) and none overlap.

- [ ] **Step 5: Commit**

```bash
git add components/room/RoomHotspot.jsx components/room/Room.jsx app/page.jsx
git commit -m "feat: add clickable room hotspots and make the room the home page"
```

---

## Task 6: Retire the walking-character system

**Files:**
- Delete: `components/mc/PageCharacter.jsx`
- Delete: `components/mc/hero-scene-logic.js`
- Delete: `components/mc/StatusRow.jsx`
- Delete: `test/heroScene.test.mjs`
- Modify: `app/layout.jsx`

**Interfaces:** None — this only removes now-dead code. `StatusRow` and the old hero were only ever used by the pre-revamp `app/page.jsx`, which Task 5 already replaced; `PageCharacter` was only used in `app/layout.jsx`.

- [ ] **Step 1: Delete the dead files**

```bash
git rm components/mc/PageCharacter.jsx components/mc/hero-scene-logic.js components/mc/StatusRow.jsx test/heroScene.test.mjs
```

- [ ] **Step 2: Remove the character from the layout**

In `app/layout.jsx`, remove the import line `import PageCharacter from "@/components/mc/PageCharacter";` and remove the `<PageCharacter />` line from the JSX. The file should now render `<BreakOverlay />`, `<PageTransition>{children}</PageTransition>`, and `<Hotbar />` only (later tasks add the easter-egg globals here too).

- [ ] **Step 3: Verify nothing else references the deleted files**

Run: `grep -rn "PageCharacter\|StatusRow\|hero-scene-logic" app components test`
Expected: no output.

- [ ] **Step 4: Run the full test suite**

Run: `npm test`
Expected: all remaining tests pass (heroScene tests are gone; portfolio and validateContact tests pass).

- [ ] **Step 5: Commit**

```bash
git add app/layout.jsx
git commit -m "chore: remove the walking-character system, superseded by the room"
```

---

## Task 7: Declutter the work page

**Files:**
- Create: `components/mc/ArchiveList.jsx`
- Modify: `app/work/page.jsx`

**Interfaces:**
- Produces: `<ArchiveList projects={[...]} />` — renders nothing (`null`) if given an empty array.

- [ ] **Step 1: Write the archive list component**

```jsx
// components/mc/ArchiveList.jsx
import { techIcon } from "@/components/mc/icons";

export default function ArchiveList({ projects }) {
  if (projects.length === 0) return null;

  return (
    <div className="mt-8 mc-bevel tex-stone overflow-x-auto">
      <table className="w-full text-sm font-primary text-[#f4e4c1] min-w-[480px]">
        <thead>
          <tr className="text-left text-white/60 font-mc text-[10px] uppercase">
            <th className="p-3">Project</th>
            <th className="p-3 hidden sm:table-cell">Stack</th>
            <th className="p-3">Link</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.slug} className="border-t border-white/10">
              <td className="p-3">
                <div className="font-mc text-xs">{p.title}</div>
                <div className="text-white/60 text-xs mt-0.5">{p.blurb}</div>
              </td>
              <td className="p-3 hidden sm:table-cell">
                <div className="flex flex-wrap gap-2">
                  {p.stack.map((s) => {
                    const Ic = techIcon(s);
                    return (
                      <span key={s} className="inline-flex items-center gap-1 text-xs text-white/70">
                        {Ic ? <Ic aria-hidden="true" /> : null}
                        {s}
                      </span>
                    );
                  })}
                </div>
              </td>
              <td className="p-3">
                <a href={p.links.github} target="_blank" rel="noreferrer" className="underline text-emerald text-xs">
                  GitHub
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Use it in the work page**

Modify `app/work/page.jsx` — replace the single grid with a featured grid plus the archive list. Change:

```jsx
import { projects, sortedProjects, filterProjects, CATEGORIES } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import Chest from "@/components/mc/Chest";
```

to also import `ArchiveList`:

```jsx
import { projects, sortedProjects, filterProjects, CATEGORIES } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import Chest from "@/components/mc/Chest";
import ArchiveList from "@/components/mc/ArchiveList";
```

and replace:

```jsx
  const list = sortedProjects(filterProjects(projects, cat));
```

with:

```jsx
  const list = sortedProjects(filterProjects(projects, cat));
  const featured = list.filter((p) => p.featured);
  const archive = list.filter((p) => !p.featured);
```

and replace the existing project grid:

```jsx
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {list.map((p) => (
          <Chest key={p.slug} project={p} />
        ))}
      </div>
```

with:

```jsx
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {featured.map((p) => (
          <Chest key={p.slug} project={p} />
        ))}
      </div>

      <ArchiveList projects={archive} />
```

- [ ] **Step 3: Manually verify**

`npm run dev`, open `/work`. Expected: the 2 featured projects (Feynomenon, Round1) render as full cards at the top; the remaining ~17 render as a compact table below; switching category filters still filters both sections correctly; on mobile width the table scrolls horizontally within its own box rather than the page.

- [ ] **Step 4: Commit**

```bash
git add components/mc/ArchiveList.jsx app/work/page.jsx
git commit -m "feat: split featured projects from a compact archive list on /work"
```

---

## Task 8: Easter egg — hidden room objects

**Files:**
- Create: `components/room/easter-eggs/HiddenObject.jsx`
- Modify: `components/room/Room.jsx`

**Interfaces:**
- Produces: `<HiddenObject icon label tooltip style />` — same `style` contract as `RoomHotspot` (percentage `left`/`top` only).

- [ ] **Step 1: Write the component**

```jsx
// components/room/easter-eggs/HiddenObject.jsx
"use client";
import { useState } from "react";

export default function HiddenObject({ icon, label, tooltip, style }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={style}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="min-w-11 min-h-11 flex items-center justify-center text-xl opacity-70 hover:opacity-100 focus:outline focus:outline-2 focus:outline-white"
      >
        {icon}
      </button>
      {open ? (
        <div
          role="status"
          className="absolute z-10 top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap mc-bevel tex-obsidian px-2 py-1 text-[10px] font-mc text-[#a8f0c0]"
        >
          {tooltip}
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Place two hidden objects in the room**

In `components/room/Room.jsx`, add the import:

```jsx
import HiddenObject from "@/components/room/easter-eggs/HiddenObject";
```

and render, after the `HOTSPOTS.map(...)` block:

```jsx
        <HiddenObject
          icon="\u{1F986}"
          label="A rubber duck"
          tooltip="Just a debugging duck. Carry on."
          style={{ left: "88%", top: "82%" }}
        />
        <HiddenObject
          icon="\u{1F5BC}️"
          label="A framed poster"
          tooltip="Dean's List Scholar, 2022-2025."
          style={{ left: "38%", top: "10%" }}
        />
```

(🦆 duck, 🖼️ poster — paste literal emoji if your editor round-trips them cleanly instead of the escapes.)

- [ ] **Step 3: Manually verify**

Click the duck and the poster in the room — each toggles its own tooltip open/closed independently. Tab to each with keyboard and press Enter/Space — same behavior. Confirm both remain ≥44×44px at 375px width.

- [ ] **Step 4: Commit**

```bash
git add components/room/easter-eggs/HiddenObject.jsx components/room/Room.jsx
git commit -m "feat: add hidden-object easter eggs to the room"
```

---

## Task 9: Easter egg — interactive cat

**Files:**
- Create: `components/room/easter-eggs/InteractiveCat.jsx`
- Modify: `components/room/Room.jsx`

**Interfaces:**
- Produces: `<InteractiveCat style />` — same `style` contract as the other room objects.

- [ ] **Step 1: Write the component**

```jsx
// components/room/easter-eggs/InteractiveCat.jsx
"use client";
import { useState } from "react";

const REACTIONS = ["Mrow?", "purrrr", "*stretches*", "not now, human"];

export default function InteractiveCat({ style }) {
  const [reaction, setReaction] = useState(null);

  function handleClick() {
    setReaction(REACTIONS[Math.floor(Math.random() * REACTIONS.length)]);
    setTimeout(() => setReaction(null), 1500);
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={style}>
      <button
        type="button"
        aria-label="Pet the cat"
        onClick={handleClick}
        className="min-w-11 min-h-11 flex items-center justify-center text-2xl transition-transform duration-150 hover:scale-110 active:scale-95 focus:outline focus:outline-2 focus:outline-white"
      >
        {"\u{1F408}‍⬛"}
      </button>
      {reaction ? (
        <div role="status" className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mc text-[#f4e4c1]">
          {reaction}
        </div>
      ) : null}
    </div>
  );
}
```

(The emoji is a black cat, 🐈‍⬛ — paste it literally if your editor handles it fine.)

- [ ] **Step 2: Place the cat in the room**

In `components/room/Room.jsx`, add the import and render it alongside the hidden objects:

```jsx
import InteractiveCat from "@/components/room/easter-eggs/InteractiveCat";
```

```jsx
        <InteractiveCat style={{ left: "60%", top: "75%" }} />
```

- [ ] **Step 3: Manually verify**

Click the cat repeatedly — a different reaction line appears each time above it and fades after ~1.5s, clicks don't queue up oddly. Keyboard: Tab to it, press Enter — same behavior.

- [ ] **Step 4: Commit**

```bash
git add components/room/easter-eggs/InteractiveCat.jsx components/room/Room.jsx
git commit -m "feat: add interactive cat easter egg to the room"
```

---

## Task 10: Easter egg — photo frame carousel

**Files:**
- Create: `components/room/easter-eggs/PhotoFrame.jsx`
- Modify: `components/room/Room.jsx`

**Interfaces:**
- Produces: `<PhotoFrame images={string[]} style />` — cycles to the next image (wrapping) on each click.

- [ ] **Step 1: Write the component**

```jsx
// components/room/easter-eggs/PhotoFrame.jsx
"use client";
import { useState } from "react";
import Image from "next/image";

export default function PhotoFrame({ images, style }) {
  const [index, setIndex] = useState(0);

  return (
    <button
      type="button"
      aria-label={`Photo ${index + 1} of ${images.length} — click for the next one`}
      onClick={() => setIndex((i) => (i + 1) % images.length)}
      className="absolute -translate-x-1/2 -translate-y-1/2 min-w-11 min-h-11 mc-bevel tex-obsidian p-1 focus:outline focus:outline-2 focus:outline-white"
      style={style}
    >
      <div className="relative w-12 h-12">
        <Image src={images[index]} alt="" fill className="object-cover" sizes="48px" />
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Place it in the room using existing photos**

In `components/room/Room.jsx`, add the import and render it (reusing the two photos already in `public/assets/`; more can be dropped in later):

```jsx
import PhotoFrame from "@/components/room/easter-eggs/PhotoFrame";
```

```jsx
        <PhotoFrame images={["/assets/photo.jpg", "/assets/photo.png"]} style={{ left: "25%", top: "14%" }} />
```

- [ ] **Step 3: Manually verify**

Click the frame — it cycles between the two photos and wraps back to the first. The `aria-label` updates each click (verify with a screen reader or the accessibility tree in devtools).

- [ ] **Step 4: Commit**

```bash
git add components/room/easter-eggs/PhotoFrame.jsx components/room/Room.jsx
git commit -m "feat: add photo frame carousel easter egg to the room"
```

---

## Task 11: Easter egg — keyboard and speaker audio

**Files:**
- Create: `components/room/easter-eggs/AudioObject.jsx`
- Modify: `components/room/Room.jsx`

**Interfaces:**
- Produces: `<AudioObject icon label src loop style />` — plays `src` on click; if `loop` is true, a second click stops it; if `loop` is false, it stops itself when the clip ends.

**Open dependency:** this task needs two real audio files from the user — a short clip of their favorite piece for the keyboard, and a short loop-friendly clip for the speaker. Until those exist, use any short placeholder `.mp3` (even silence) at the paths below so the feature is wired correctly; swap the real files in later without touching code.

- [ ] **Step 1: Add placeholder audio files**

Ensure these exist (ask the user for the real clips; placeholders unblock the build):
- `public/sfx/keyboard-piece.mp3`
- `public/sfx/speaker-loop.mp3`

- [ ] **Step 2: Write the component**

```jsx
// components/room/easter-eggs/AudioObject.jsx
"use client";
import { useRef, useState } from "react";

export default function AudioObject({ icon, label, src, loop = false, style }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = loop;
    }
    const audio = audioRef.current;

    if (playing) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
      return;
    }

    audio.currentTime = 0;
    audio.play().catch(() => {});
    setPlaying(true);
    if (!loop) audio.onended = () => setPlaying(false);
  }

  return (
    <button
      type="button"
      aria-label={playing ? `Stop ${label}` : label}
      aria-pressed={playing}
      onClick={toggle}
      className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-11 min-h-11 mc-bevel tex-plank flex items-center justify-center text-lg focus:outline focus:outline-2 focus:outline-white ${
        playing ? "outline outline-2 outline-emerald" : ""
      }`}
      style={style}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}
```

- [ ] **Step 3: Stop audio on navigation away from the room**

Since `Room.jsx` only renders on `/`, Next.js unmounts it on navigation, but the `Audio` object held in `audioRef` isn't tied to React's lifecycle — add a cleanup so a looping speaker doesn't keep playing after the visitor leaves. Modify `AudioObject.jsx`'s imports and add an effect:

```jsx
import { useEffect, useRef, useState } from "react";
```

```jsx
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);
```

(Place this `useEffect` call right after the `useState` line, before `toggle`.)

- [ ] **Step 4: Place both audio objects in the room**

In `components/room/Room.jsx`, add the import and render two instances:

```jsx
import AudioObject from "@/components/room/easter-eggs/AudioObject";
```

```jsx
        <AudioObject icon="\u{1F3B9}" label="Play a favorite piece" src="/sfx/keyboard-piece.mp3" style={{ left: "55%", top: "48%" }} />
        <AudioObject icon="\u{1F50A}" label="Play a song on loop" src="/sfx/speaker-loop.mp3" loop style={{ left: "8%", top: "38%" }} />
```

(🎹 keyboard, 🔊 speaker.)

- [ ] **Step 5: Manually verify the hard no-autoplay rule**

Reload `/` and wait 10 seconds without clicking anything — confirm no sound plays. Click the keyboard once — it plays once and stops on its own; the button's outline disappears when it ends. Click the speaker once — it loops; click it again — it stops immediately. Navigate to `/work` while the speaker is looping, then back to `/` — confirm it isn't still audible in the background (it was unmounted, not orphaned).

- [ ] **Step 6: Commit**

```bash
git add components/room/easter-eggs/AudioObject.jsx components/room/Room.jsx public/sfx
git commit -m "feat: add click-to-play keyboard and speaker easter eggs"
```

---

## Task 12: Easter egg — Konami code unlock

**Files:**
- Create: `components/room/easter-eggs/KonamiUnlock.jsx`
- Modify: `app/globals.css` (alternate palette rule)
- Modify: `app/layout.jsx`

**Interfaces:**
- Produces: `<KonamiUnlock />` — no props, renders a toast on unlock, sets `data-easter="unlocked"` on `<html>` (persisted via `localStorage`).

- [ ] **Step 1: Add the alternate-palette CSS**

Add to `app/globals.css`, outside any `@layer` block (a plain global rule, since it targets `html` directly):

```css
html[data-easter="unlocked"] {
  filter: hue-rotate(200deg);
}
```

- [ ] **Step 2: Write the component**

```jsx
// components/room/easter-eggs/KonamiUnlock.jsx
"use client";
import { useEffect, useState } from "react";

const SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export default function KonamiUnlock() {
  const [toast, setToast] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("easter-unlocked") === "true") {
        document.documentElement.setAttribute("data-easter", "unlocked");
      }
    } catch {}
  }, []);

  useEffect(() => {
    let progress = 0;

    function onKey(e) {
      const tag = document.activeElement?.tagName ?? "";
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = SEQUENCE[progress];

      if (key === expected) {
        progress += 1;
        if (progress === SEQUENCE.length) {
          progress = 0;
          document.documentElement.setAttribute("data-easter", "unlocked");
          try {
            localStorage.setItem("easter-unlocked", "true");
          } catch {}
          setToast(true);
          setTimeout(() => setToast(false), 3000);
        }
      } else {
        progress = key === SEQUENCE[0] ? 1 : 0;
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!toast) return null;

  return (
    <div role="status" className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] mc-bevel tex-plank px-4 py-3 text-xs font-mc text-[#f4e4c1]">
      Secret palette unlocked.
    </div>
  );
}
```

- [ ] **Step 3: Wire it into the layout**

Modify `app/layout.jsx` — add the import:

```jsx
import KonamiUnlock from "@/components/room/easter-eggs/KonamiUnlock";
```

and render it alongside `Hotbar`:

```jsx
        <Hotbar />
        <KonamiUnlock />
```

- [ ] **Step 4: Manually verify**

On any page, focus the page body (not a form field) and type the sequence Up, Up, Down, Down, Left, Right, Left, Right, B, A — a toast appears and the whole page's colors visibly shift (hue-rotate). Reload the page — the shifted palette persists. Clear `localStorage` and reload — it's back to normal.

- [ ] **Step 5: Commit**

```bash
git add components/room/easter-eggs/KonamiUnlock.jsx app/globals.css app/layout.jsx
git commit -m "feat: add Konami code easter egg with a persistent alt palette"
```

---

## Task 13: Easter egg — console message

**Files:**
- Create: `components/room/easter-eggs/ConsoleEasterEgg.jsx`
- Modify: `app/layout.jsx`

**Interfaces:**
- Produces: `<ConsoleEasterEgg />` — no props, renders nothing, logs once on mount.

- [ ] **Step 1: Write the component**

```jsx
// components/room/easter-eggs/ConsoleEasterEgg.jsx
"use client";
import { useEffect } from "react";
import { profile } from "@/data/portfolio";

export default function ConsoleEasterEgg() {
  useEffect(() => {
    console.log(
      `%cHey, nice of you to check the console.\nWant to build something together? ${profile.email}`,
      "color:#2ecc71;font-family:monospace;font-size:14px;"
    );
  }, []);

  return null;
}
```

- [ ] **Step 2: Wire it into the layout**

Modify `app/layout.jsx` — add the import:

```jsx
import ConsoleEasterEgg from "@/components/room/easter-eggs/ConsoleEasterEgg";
```

and render it once, anywhere in the body:

```jsx
        <KonamiUnlock />
        <ConsoleEasterEgg />
```

- [ ] **Step 3: Manually verify**

Open devtools console on any page — the styled message appears exactly once per page load with the correct email.

- [ ] **Step 4: Commit**

```bash
git add components/room/easter-eggs/ConsoleEasterEgg.jsx app/layout.jsx
git commit -m "feat: add console message easter egg"
```

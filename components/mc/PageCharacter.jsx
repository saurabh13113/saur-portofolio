"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSfx } from "@/hooks/useSfx";
import {
  CHAR, stepCharacter, advanceBreak, CRATE, stepCrate, pushCrate, loadFlag, saveFlag,
} from "@/components/mc/hero-scene-logic";

const FLOOR_Y = 76; // matches the hotbar's top edge, so it doubles as a platform
const CRATE_SPOTS = [0.15, 0.5, 0.85]; // fraction of viewport width

function keyToInput(key) {
  if (key === "ArrowLeft" || key === "a" || key === "A") return "left";
  if (key === "ArrowRight" || key === "d" || key === "D") return "right";
  if (key === "ArrowUp" || key === "w" || key === "W" || key === " ") return "jump";
  return null;
}

export default function PageCharacter() {
  const pathname = usePathname();
  const { play } = useSfx();

  const [playing, setPlaying] = useState(false);
  const [crates, setCrates] = useState(CRATE_SPOTS.map(() => ({ offset: 0, v: 0 })));
  const [secret, setSecret] = useState({ hits: 0, broken: false, revealOpen: false });

  const charElRef = useRef(null);
  const cratesElRef = useRef([]);
  const posRef = useRef({ x: 40, y: FLOOR_Y, vy: 0, facing: 1 });
  const inputRef = useRef({ left: false, right: false, jump: false });
  const cratesRef = useRef(crates);
  const secretRef = useRef(secret);
  const wasOnActivateRef = useRef(new Set());
  const wasBumpedRef = useRef(new Set());
  const wasTouchingCrateRef = useRef([false, false, false]);
  const wasTouchingSecretRef = useRef(false);
  const [secretRect, setSecretRect] = useState(null);

  useEffect(() => {
    setPlaying(loadFlag("mc-playing", false));
    setSecret((s) => ({ ...s, broken: loadFlag("mc-secret-broken", false) }));
  }, []);

  useEffect(() => {
    cratesRef.current = crates;
  }, [crates]);
  useEffect(() => {
    secretRef.current = secret;
  }, [secret]);

  // Keyboard only listens while the character is actually active, so page
  // scroll (arrows/space) is untouched otherwise.
  useEffect(() => {
    if (!playing) return;
    function setKey(key, value) {
      const dir = keyToInput(key);
      if (!dir) return false;
      inputRef.current = { ...inputRef.current, [dir]: value };
      return true;
    }
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName ?? "";
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;
      if (setKey(e.key, true)) e.preventDefault();
    }
    function onKeyUp(e) {
      if (setKey(e.key, false)) e.preventDefault();
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [playing]);

  // Reset horizontal position gently on route change so the character
  // doesn't spawn off-screen if the new page is narrower.
  useEffect(() => {
    inputRef.current = { left: false, right: false, jump: false };
  }, [pathname]);

  useEffect(() => {
    if (!playing) return;
    let raf;

    function secretAnchorRect() {
      const el = document.querySelector("[data-mc-secret-anchor]");
      return el ? el.getBoundingClientRect() : null;
    }

    function tick() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const hitEls = Array.from(document.querySelectorAll("[data-mc-hit]"));
      const platforms = [{ left: 0, right: vw, top: FLOOR_Y }];
      for (const el of hitEls) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        platforms.push({ left: r.left, right: r.right, top: vh - r.top, el });
      }

      posRef.current = stepCharacter(posRef.current, inputRef.current, platforms, vw);
      const { x, y, facing } = posRef.current;

      const el = charElRef.current;
      if (el) {
        el.style.left = `${x}px`;
        el.style.bottom = `${y}px`;
        el.style.transform = `scaleX(${facing})`;
      }

      // Standing on a [data-mc-activate] element "presses" it.
      const standingOn = platforms.find(
        (p) => p.el && p.el.hasAttribute("data-mc-activate") && x + CHAR.width > p.left && x < p.right && y === p.top
      );
      const activeIds = new Set();
      if (standingOn) {
        const id = standingOn.el;
        activeIds.add(id);
        if (!wasOnActivateRef.current.has(id)) {
          standingOn.el.click();
          play("orb");
        }
      }
      wasOnActivateRef.current = activeIds;

      // Bumping any [data-mc-bump] element gives it a little reaction.
      const bumpEls = document.querySelectorAll("[data-mc-bump]");
      const nowBumped = new Set();
      const top = vh - y - 30;
      const bottom = vh - y;
      for (const bEl of bumpEls) {
        const r = bEl.getBoundingClientRect();
        const overlaps = x + CHAR.width > r.left && x < r.right && bottom > r.top && top < r.bottom;
        if (overlaps) {
          nowBumped.add(bEl);
          if (!wasBumpedRef.current.has(bEl)) {
            bEl.classList.add("mc-bumped");
            play("click");
            setTimeout(() => bEl.classList.remove("mc-bumped"), 400);
          }
        }
      }
      wasBumpedRef.current = nowBumped;

      // Push any crate the character walks into.
      const nextCrates = cratesRef.current.map((c, i) => {
        const crateEl = cratesElRef.current[i];
        let state = c;
        if (crateEl) {
          const r = crateEl.getBoundingClientRect();
          const touching = x + CHAR.width > r.left && x < r.right && bottom > r.top - 4 && top < r.bottom;
          if (touching && !wasTouchingCrateRef.current[i]) {
            const dir = facing;
            state = pushCrate(state, dir);
          }
          wasTouchingCrateRef.current[i] = touching;
        }
        return stepCrate(state);
      });
      cratesRef.current = nextCrates;
      setCrates(nextCrates);

      // The one boarded-up secret, only present on pages with an anchor.
      const anchor = secretAnchorRect();
      setSecretRect(anchor && !secretRef.current.broken ? anchor : null);
      if (anchor && !secretRef.current.broken) {
        const sx = anchor.left;
        const sTop = vh - anchor.top - 30;
        const sBottom = vh - anchor.top;
        const touching = x + CHAR.width > sx - 10 && x < sx + 40 && bottom > sTop && top < sBottom;
        if (touching && !wasTouchingSecretRef.current) {
          const r = advanceBreak(secretRef.current.hits, 3);
          play(r.broken ? "break" : "click");
          if (r.broken) saveFlag("mc-secret-broken", true);
          const next = { hits: r.hits, broken: r.broken, revealOpen: r.broken };
          secretRef.current = next;
          setSecret(next);
        }
        wasTouchingSecretRef.current = touching;
      } else {
        wasTouchingSecretRef.current = false;
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, play]);

  function togglePlaying() {
    play("click");
    setPlaying((p) => {
      const next = !p;
      saveFlag("mc-playing", next);
      return next;
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={togglePlaying}
        aria-pressed={playing}
        title="Toggle the walking character"
        className="fixed bottom-3 left-3 z-[60] mc-bevel tex-obsidian w-11 h-11 flex items-center justify-center text-lg focus:outline focus:outline-2 focus:outline-white"
      >
        <span aria-hidden="true">🎮</span>
        <span className="sr-only">{playing ? "Character on" : "Character off"}</span>
      </button>

      {playing && (
        <>
          <div
            ref={charElRef}
            aria-hidden="true"
            className="mc-char fixed z-[60] pointer-events-none"
            style={{ left: 40, bottom: FLOOR_Y }}
          >
            🧑‍🌾
          </div>

          {CRATE_SPOTS.map((frac, i) => (
            <div
              key={i}
              ref={(el) => (cratesElRef.current[i] = el)}
              aria-hidden="true"
              className="mc-bevel tex-dirt fixed z-[55] w-8 h-8 pointer-events-none"
              style={{
                left: `calc(${frac * 100}vw - 16px + ${crates[i]?.offset ?? 0}px)`,
                bottom: FLOOR_Y,
              }}
            />
          ))}

          {secretRect && !secret.broken && <SecretCrate rect={secretRect} hits={secret.hits} />}

          {secret.revealOpen && (
            <div
              role="status"
              className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] mc-bevel tex-plank px-4 py-3 text-xs font-mc text-[#f4e4c1] max-w-[280px] text-center"
            >
              🔓 Fun fact: I TA&apos;d 150+ students across two courses in one term.
              <button
                type="button"
                onClick={() => setSecret((s) => ({ ...s, revealOpen: false }))}
                className="block mx-auto mt-2 underline"
              >
                Close
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

function SecretCrate({ rect, hits }) {
  return (
    <div
      aria-hidden="true"
      className="fixed z-[55] mc-bevel tex-obsidian w-10 h-10 flex items-center justify-center text-base pointer-events-none"
      style={{ left: rect.left, top: rect.top }}
    >
      <span
        className="mc-crack absolute inset-0"
        style={{ opacity: hits / 3 }}
      />
      📦
    </div>
  );
}

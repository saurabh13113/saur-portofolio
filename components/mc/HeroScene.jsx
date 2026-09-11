"use client";
import { useEffect, useRef, useState } from "react";
import { useSfx } from "@/hooks/useSfx";
import {
  TOOLS, EMERALD_IDS, PHYSICS, hitsToBreak, advanceBlock, stepPhysics,
  loadFoundEmeralds, saveFoundEmeralds,
} from "@/components/mc/hero-scene-logic";

const BLOCKS = ["grass", "dirt", "stone", "dirt", "grass"];
const BLOCK_SIZE = 48;
const BLOCK_BOTTOM = 40;
const BLOCK_LEFT_PCT = [0.28, 0.38, 0.48, 0.58, 0.68];
const PARTICLE_OFFSETS = [
  [-20, -16], [20, -16], [-24, 10], [24, 10], [0, -24], [0, 20],
];
const GEM_SPOTS = [
  { id: "grass", leftPct: 0.1, bottom: 18 },
  { id: "path", leftPct: 0.85, bottom: 18 },
  { id: "cloud", leftPct: 0.48, bottom: 165 },
];
const GEM_RADIUS = 20;

function keyToInput(key) {
  if (key === "ArrowLeft" || key === "a" || key === "A") return "left";
  if (key === "ArrowRight" || key === "d" || key === "D") return "right";
  if (key === "ArrowUp" || key === "w" || key === "W" || key === " ") return "jump";
  return null;
}

export default function HeroScene() {
  const { play } = useSfx();
  const sceneRef = useRef(null);
  const playerRef = useRef(null);
  const posRef = useRef({ x: 20, y: PHYSICS.groundY, vy: 0, facing: 1 });
  const inputRef = useRef({ left: false, right: false, jump: false });
  const foundRef = useRef([]);
  const blocksRef = useRef(BLOCKS.map(() => ({ hits: 0, shattering: false })));

  const [tool, setTool] = useState(TOOLS[0].id);
  const [blocks, setBlocks] = useState(blocksRef.current);
  const [found, setFound] = useState([]);

  useEffect(() => {
    const loaded = loadFoundEmeralds();
    foundRef.current = loaded;
    setFound(loaded);
  }, []);

  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  // The physics loop. Reads live refs (never a stale closure), writes the
  // player's position straight to the DOM — no per-frame React state, so
  // this runs at display refresh rate without re-render churn.
  useEffect(() => {
    let raf;
    function tick() {
      const scene = sceneRef.current;
      const width = scene ? scene.clientWidth : 400;

      const platforms = blocksRef.current
        .map((b, i) => ({ b, i }))
        .filter(({ b }) => !b.shattering)
        .map(({ i }) => {
          const left = BLOCK_LEFT_PCT[i] * width;
          return { left, right: left + BLOCK_SIZE, top: BLOCK_BOTTOM + BLOCK_SIZE };
        });

      posRef.current = stepPhysics(posRef.current, inputRef.current, platforms, width);

      const { x, y, facing } = posRef.current;
      const el = playerRef.current;
      if (el) {
        el.style.left = `${x}px`;
        el.style.bottom = `${y}px`;
        el.style.transform = `scaleX(${facing})`;
      }

      for (const g of GEM_SPOTS) {
        if (foundRef.current.includes(g.id)) continue;
        const gx = g.leftPct * width;
        const dx = x + PHYSICS.playerWidth / 2 - gx;
        const dy = y - g.bottom;
        if (Math.hypot(dx, dy) < GEM_RADIUS) {
          const next = [...foundRef.current, g.id];
          foundRef.current = next;
          setFound(next);
          saveFoundEmeralds(next);
          play("orb");
        }
      }

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setKey(key, value) {
    const dir = keyToInput(key);
    if (!dir) return false;
    inputRef.current = { ...inputRef.current, [dir]: value };
    return true;
  }

  function onKeyDown(e) {
    if (setKey(e.key, true)) e.preventDefault();
  }
  function onKeyUp(e) {
    if (setKey(e.key, false)) e.preventDefault();
  }

  function hitBlock(i) {
    const cur = blocksRef.current[i];
    const { hits, broken } = advanceBlock(cur.hits, tool);
    play(broken ? "break" : "click");
    setBlocks((prev) => {
      const next = [...prev];
      next[i] = { hits, shattering: broken };
      return next;
    });
    if (broken) {
      setTimeout(() => {
        setBlocks((prev) => {
          const next = [...prev];
          next[i] = { hits: 0, shattering: false };
          return next;
        });
      }, 500);
    }
  }

  function collectByClick(id) {
    if (foundRef.current.includes(id)) return;
    const next = [...foundRef.current, id];
    foundRef.current = next;
    setFound(next);
    saveFoundEmeralds(next);
    play("orb");
  }

  function onSceneClick(e) {
    if (tool === "compass" && e.target === e.currentTarget) {
      play("click");
      document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  const need = hitsToBreak(tool);

  return (
    <div>
      <p className="text-xs text-white/50 font-primary mt-8 mb-1">
        Click into the scene, then ← → (or A/D) to move, ↑ / W / Space to jump.
      </p>
      <div
        ref={sceneRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onClick={onSceneClick}
        className={`mc-scene relative h-56 focus:outline focus:outline-2 focus:outline-white ${
          tool === "torch" ? "mc-scene--torch" : ""
        }`}
        role="application"
        aria-label="Playable scene (optional): move the character, break blocks, find hidden gems"
      >
        <div className="absolute top-2 right-2 mc-bevel tex-obsidian px-3 py-1 text-xs font-mc text-[#a8f0c0]">
          💎 {found.length}/{EMERALD_IDS.length}
        </div>

        <div className="absolute top-2 left-2 flex gap-2" role="group" aria-label="Equip a tool (cosmetic)">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                play("click");
                setTool(t.id);
              }}
              aria-pressed={tool === t.id}
              title={t.label}
              className={`mc-bevel tex-dirt w-9 h-9 flex items-center justify-center text-base focus:outline focus:outline-2 focus:outline-white ${
                tool === t.id ? "outline outline-2 outline-white" : ""
              }`}
            >
              <span aria-hidden="true">{t.glyph}</span>
              <span className="sr-only">{t.label}</span>
            </button>
          ))}
        </div>

        {GEM_SPOTS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              collectByClick(g.id);
            }}
            aria-label={found.includes(g.id) ? `Emerald found` : `Hidden emerald`}
            className={`mc-gem focus:outline focus:outline-2 focus:outline-white ${
              found.includes(g.id) ? "mc-gem--found" : ""
            }`}
            style={{ left: `${g.leftPct * 100}%`, bottom: `${g.bottom}px` }}
          >
            💎
          </button>
        ))}

        {BLOCKS.map((tex, i) => {
          const st = blocks[i];
          return (
            <button
              key={i}
              type="button"
              aria-label={`${tex} block`}
              onClick={(e) => {
                e.stopPropagation();
                hitBlock(i);
              }}
              className={`mc-block mc-bevel tex-${tex} absolute focus:outline focus:outline-2 focus:outline-white`}
              style={{
                left: `${BLOCK_LEFT_PCT[i] * 100}%`,
                bottom: `${BLOCK_BOTTOM}px`,
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
              }}
            >
              <span
                className="mc-crack absolute inset-0"
                aria-hidden="true"
                style={{ opacity: st.shattering ? 0 : st.hits / need }}
              />
              {st.shattering &&
                PARTICLE_OFFSETS.map(([dx, dy], p) => (
                  <span
                    key={p}
                    aria-hidden="true"
                    className="mc-shatter-particle"
                    style={{ left: "50%", top: "50%", "--dx": `${dx}px`, "--dy": `${dy}px` }}
                  />
                ))}
            </button>
          );
        })}

        <div
          ref={playerRef}
          aria-hidden="true"
          className="mc-player absolute"
          style={{ left: 20, bottom: PHYSICS.groundY }}
        >
          🧑‍🌾
        </div>

        {found.length === EMERALD_IDS.length && (
          <div className="absolute inset-x-0 bottom-2 mx-auto w-max mc-bevel tex-plank px-4 py-2 text-xs font-mc text-[#f4e4c1]">
            Achievement: Full-Stack Explorer 🏆
          </div>
        )}
      </div>

      <div className="flex justify-center gap-2 mt-2 sm:hidden" role="group" aria-label="Touch controls">
        {[
          { label: "◀", key: "ArrowLeft" },
          { label: "▲", key: "ArrowUp" },
          { label: "▶", key: "ArrowRight" },
        ].map((b) => (
          <button
            key={b.key}
            type="button"
            className="mc-bevel tex-dirt w-14 h-12 text-[#f4e4c1] text-lg"
            onPointerDown={() => setKey(b.key, true)}
            onPointerUp={() => setKey(b.key, false)}
            onPointerLeave={() => setKey(b.key, false)}
            aria-label={b.key === "ArrowLeft" ? "Move left" : b.key === "ArrowRight" ? "Move right" : "Jump"}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

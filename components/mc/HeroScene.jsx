"use client";
import { useEffect, useState } from "react";
import { useSfx } from "@/hooks/useSfx";
import {
  TOOLS, EMERALD_IDS, hitsToBreak, advanceBlock, loadFoundEmeralds, saveFoundEmeralds,
} from "@/components/mc/hero-scene-logic";

const BLOCKS = ["grass", "dirt", "stone", "dirt", "grass"];
const PARTICLE_OFFSETS = [
  [-20, -16], [20, -16], [-24, 10], [24, 10], [0, -24], [0, 20],
];
const GEM_SPOTS = [
  { id: "cloud", top: "10%", left: "72%" },
  { id: "grass", top: "80%", left: "14%" },
  { id: "path", top: "76%", left: "58%" },
];

export default function HeroScene() {
  const { play } = useSfx();
  const [tool, setTool] = useState(TOOLS[0].id);
  const [blocks, setBlocks] = useState(() => BLOCKS.map(() => ({ hits: 0, shattering: false })));
  const [found, setFound] = useState([]);
  const [jump, setJump] = useState(false);

  useEffect(() => {
    setFound(loadFoundEmeralds());
  }, []);

  function hitBlock(i) {
    const cur = blocks[i];
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

  function collect(id) {
    if (found.includes(id)) return;
    const next = [...found, id];
    setFound(next);
    saveFoundEmeralds(next);
    play("orb");
  }

  function bonk() {
    setJump(true);
    play("orb");
    setTimeout(() => setJump(false), 300);
  }

  function onSceneClick(e) {
    if (tool === "compass" && e.target === e.currentTarget) {
      play("click");
      document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  const need = hitsToBreak(tool);

  return (
    <div
      className={`mc-scene relative h-56 mt-10 rounded-none ${tool === "torch" ? "mc-scene--torch" : ""}`}
      role="group"
      aria-label="Interactive scene (optional): break blocks, equip tools, find hidden gems"
      onClick={onSceneClick}
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
            collect(g.id);
          }}
          aria-label={found.includes(g.id) ? `Emerald found near the ${g.id}` : `Hidden emerald near the ${g.id}`}
          className={`mc-gem focus:outline focus:outline-2 focus:outline-white ${found.includes(g.id) ? "mc-gem--found" : ""}`}
          style={{ top: g.top, left: g.left }}
        >
          💎
        </button>
      ))}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          bonk();
        }}
        aria-label="Poke the wandering pixel adventurer"
        className={`mc-walker ${jump ? "mc-walker--jump" : ""}`}
      >
        🧑‍🌾
      </button>

      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex gap-2">
        {BLOCKS.map((tex, i) => {
          const { hits, shattering } = blocks[i];
          return (
            <button
              key={i}
              type="button"
              aria-label={`${tex} block`}
              onClick={(e) => {
                e.stopPropagation();
                hitBlock(i);
              }}
              className={`mc-block mc-bevel tex-${tex} w-12 h-12 relative focus:outline focus:outline-2 focus:outline-white`}
            >
              <span
                className="mc-crack absolute inset-0"
                aria-hidden="true"
                style={{ opacity: shattering ? 0 : hits / need }}
              />
              {shattering &&
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
      </div>

      {found.length === EMERALD_IDS.length && (
        <div className="absolute inset-x-0 bottom-2 mx-auto w-max mc-bevel tex-plank px-4 py-2 text-xs font-mc text-[#f4e4c1]">
          Achievement: Full-Stack Explorer 🏆
        </div>
      )}
    </div>
  );
}

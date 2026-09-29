"use client";
import { useEffect, useRef, useState } from "react";
import { BsX } from "react-icons/bs";

// The PS4's game: a five-shot penalty shootout. Pick a corner (buttons or ←/↓/→),
// the keeper dives, best score is remembered in this browser.
const AIMS = [
  ["left", "Left", "ArrowLeft", "12%"],
  ["middle", "Middle", "ArrowDown", "50%"],
  ["right", "Right", "ArrowRight", "88%"],
];
const SHOTS = 5;
const readBest = () => {
  try {
    return Number(localStorage.getItem("penalty-best")) || 0;
  } catch {
    return 0;
  }
};

export default function PenaltyGame({ open, onClose }) {
  const dialog = useRef(null);
  const [shots, setShots] = useState([]); // true = goal
  const [last, setLast] = useState(null); // { aim, dive, goal }
  const [best, setBest] = useState(0);
  const busy = useRef(false);
  const done = shots.length === SHOTS;
  const goals = shots.filter(Boolean).length;

  useEffect(() => {
    const d = dialog.current;
    if (open && !d.open) {
      setShots([]);
      setLast(null);
      setBest(readBest());
      d.showModal();
    }
    if (!open && d.open) d.close();
  }, [open]);

  function shoot(aim) {
    if (busy.current || done) return;
    busy.current = true;
    const dive = AIMS[Math.floor(Math.random() * 3)][0]; // the keeper guesses
    const goal = dive !== aim;
    setLast({ aim, dive, goal, n: shots.length });
    setTimeout(() => {
      setShots((s) => {
        const next = [...s, goal];
        if (next.length === SHOTS) {
          const score = next.filter(Boolean).length;
          if (score > readBest()) {
            try {
              localStorage.setItem("penalty-best", String(score));
            } catch {}
            setBest(score);
          }
        }
        return next;
      });
      busy.current = false;
    }, 700);
  }

  const x = (aim) => AIMS.find((a) => a[0] === aim)?.[3] ?? "50%";
  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
      onKeyDown={(e) => {
        const a = AIMS.find((k) => k[2] === e.key);
        if (a) {
          e.preventDefault();
          shoot(a[0]);
        }
      }}
      aria-label="Penalty shootout"
      className="family-album bg-transparent p-0 w-[min(92vw,520px)] text-[#f4e4c1]"
    >
      <div className="mc-bevel tex-obsidian p-4">
        <div className="flex items-center justify-between font-mc text-sm">
          <span className="text-[#f4d27a]">⚽ Penalty shootout</span>
          <span>
            {goals} / {shots.length} · best {best}/{SHOTS}
          </span>
          <button type="button" onClick={onClose} aria-label="Close" className="w-9 h-9 flex items-center justify-center hover:text-[#f4d27a] focus:outline focus:outline-2 focus:outline-white">
            <BsX aria-hidden="true" className="text-xl" />
          </button>
        </div>

        {/* the pitch: goal, keeper, ball */}
        <div className="relative mt-3 h-56 overflow-hidden bg-[#2f7d3b] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.05)_0_24px,transparent_24px_48px)]">
          <div className="absolute left-[6%] right-[6%] top-5 h-24 border-4 border-b-0 border-white bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.18)_0_1px,transparent_1px_8px),repeating-linear-gradient(90deg,rgba(255,255,255,0.18)_0_1px,transparent_1px_8px)]" />
          <Keeper
            className="absolute top-10 w-12 h-16 -translate-x-1/2 transition-all duration-500"
            style={{ left: last ? x(last.dive) : "50%", rotate: last && last.dive !== "middle" ? (last.dive === "left" ? "-50deg" : "50deg") : "0deg" }}
          />
          <Ball
            className="absolute w-6 h-6 -translate-x-1/2 transition-all duration-500 drop-shadow-[0_2px_1px_rgba(0,0,0,0.4)]"
            style={last ? { left: x(last.aim), top: last.goal ? "34px" : "62px", rotate: `${540 * (last.n + 1)}deg` } : { left: "50%", top: "150px" }}
          />
          <p role="status" className="absolute inset-x-0 bottom-2 text-center font-mc text-lg drop-shadow">
            {done ? `${goals}/${SHOTS}. ${goals >= 4 ? "Top bins! 🏆" : goals >= 3 ? "Not bad!" : "The keeper's on fire."}` : last ? (last.goal ? "GOAL!" : "Saved!") : "Pick a corner"}
          </p>
        </div>

        <div className="flex gap-1 mt-3" aria-label="Shots" role="img">
          {Array.from({ length: SHOTS }, (_, i) => (
            <span key={i} className={`w-4 h-4 border border-[#f4d27a] ${i < shots.length ? (shots[i] ? "bg-emerald" : "bg-redstone") : ""}`} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {done ? (
            <button type="button" onClick={() => { setShots([]); setLast(null); }} className="col-span-3 mc-bevel tex-plank font-mc py-3 focus:outline focus:outline-2 focus:outline-white">
              Play again
            </button>
          ) : (
            AIMS.map(([aim, label]) => (
              <button key={aim} type="button" onClick={() => shoot(aim)} className="mc-bevel tex-plank font-mc py-3 focus:outline focus:outline-2 focus:outline-white">
                {label}
              </button>
            ))
          )}
        </div>
        <p className="text-[11px] text-white/50 mt-2 text-center">or use ← ↓ →</p>
      </div>
    </dialog>
  );
}

// Pixel-art sprites (1 unit = 1 pixel): a keeper in kit with gloves up, and a
// ball with a pentagon patch.
const px = (rects) => rects.map(([x, y, w, h, c], i) => <rect key={i} x={x} y={y} width={w} height={h} fill={c} />);
const KIT = "#e8622c", KIT_D = "#b8461c", SKIN = "#c68a5c", HAIR = "#1c1c22", GLOVE = "#f4d27a";
function Keeper(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 16" shapeRendering="crispEdges" {...props}>
      {px([
        [4, 0, 4, 1, HAIR], [4, 1, 4, 3, SKIN], [5, 2, 1, 1, HAIR], [7, 2, 1, 1, HAIR], // head
        [0, 1, 2, 2, GLOVE], [1, 3, 2, 2, KIT], [10, 1, 2, 2, GLOVE], [9, 3, 2, 2, KIT], // arms up
        [3, 4, 6, 6, KIT], [3, 4, 6, 1, KIT_D], [5, 6, 2, 2, "#ffffff"], // jersey, number patch
        [3, 10, 6, 2, "#1c1c22"], // shorts
        [3, 12, 2, 3, SKIN], [7, 12, 2, 3, SKIN], [3, 14, 2, 1, KIT], [7, 14, 2, 1, KIT], // legs, socks
        [2, 15, 3, 1, "#111111"], [7, 15, 3, 1, "#111111"], // boots
      ])}
    </svg>
  );
}
function Ball(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" {...props}>
      <circle cx="6" cy="6" r="5.5" fill="#f5f5f5" stroke="#1c1c22" strokeWidth="0.8" />
      <path d="M6 3.6 8.3 5.3 7.4 8 4.6 8 3.7 5.3Z" fill="#1c1c22" />
      <path d="M6 3.6V1M8.3 5.3l2.3-.9M7.4 8l1.4 2.2M4.6 8 3.2 10.2M3.7 5.3l-2.3-.9" stroke="#1c1c22" strokeWidth="0.6" />
      <circle cx="4" cy="3.5" r="1" fill="#ffffff" opacity="0.8" />
    </svg>
  );
}

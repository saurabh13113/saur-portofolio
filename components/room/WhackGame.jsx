"use client";
import { useEffect, useRef, useState } from "react";
import { BsX } from "react-icons/bs";

// The PS4's other game: a 20-second reaction test. Targets pop up one at a
// time in a random cell; click before they vanish. Best score is remembered
// in this browser.
const GRID = 9; // 3x3
const DURATION_MS = 20000;
const SHOW_MS = 800;
const readBest = () => {
  try {
    return Number(localStorage.getItem("whack-best")) || 0;
  } catch {
    return 0;
  }
};

export default function WhackGame({ open, onClose }) {
  const dialog = useRef(null);
  const popTimer = useRef(null);
  const tickTimer = useRef(null);
  const startedAt = useRef(0);
  const [active, setActive] = useState(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION_MS);
  const [running, setRunning] = useState(false);

  function pop() {
    setActive(Math.floor(Math.random() * GRID));
    popTimer.current = setTimeout(pop, SHOW_MS);
  }

  function reset() {
    clearTimeout(popTimer.current);
    clearInterval(tickTimer.current);
    setScore(0);
    setActive(null);
    setBest(readBest());
    setTimeLeft(DURATION_MS);
    setRunning(true);
    startedAt.current = Date.now();
    pop();
    tickTimer.current = setInterval(() => {
      const left = DURATION_MS - (Date.now() - startedAt.current);
      if (left <= 0) {
        clearInterval(tickTimer.current);
        clearTimeout(popTimer.current);
        setTimeLeft(0);
        setActive(null);
        setRunning(false);
      } else {
        setTimeLeft(left);
      }
    }, 200);
  }

  function hit(i) {
    if (!running || i !== active) return;
    clearTimeout(popTimer.current);
    setActive(null);
    setScore((s) => {
      const next = s + 1;
      if (next > readBest()) {
        try {
          localStorage.setItem("whack-best", String(next));
        } catch {}
        setBest(next);
      }
      return next;
    });
    pop();
  }

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      reset();
    }
    if (!open && d.open) d.close();
    return () => {
      clearTimeout(popTimer.current);
      clearInterval(tickTimer.current);
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps -- reset() is stable enough for this

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
      aria-label="Reaction game"
      className="family-album bg-transparent p-0 w-[min(92vw,420px)] text-[#f4e4c1]"
    >
      <div className="mc-bevel tex-obsidian p-4">
        <div className="flex items-center justify-between font-mc text-sm">
          <span className="text-[#f4d27a]">🎯 Reaction game</span>
          <span>
            {score} · best {best} · {Math.ceil(timeLeft / 1000)}s
          </span>
          <button type="button" onClick={onClose} aria-label="Close" className="w-9 h-9 flex items-center justify-center hover:text-[#f4d27a] focus:outline focus:outline-2 focus:outline-white">
            <BsX aria-hidden="true" className="text-xl" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {Array.from({ length: GRID }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => hit(i)}
              aria-label={active === i ? "Target" : "Empty"}
              className={`mc-bevel h-20 flex items-center justify-center text-3xl focus:outline focus:outline-2 focus:outline-white ${active === i ? "tex-plank" : "tex-obsidian"}`}
            >
              {active === i ? "🎯" : ""}
            </button>
          ))}
        </div>

        {!running && timeLeft === 0 ? (
          <p role="status" className="text-center font-mc text-sm mt-3">
            {score} hits. {score >= 12 ? "Lightning reflexes! 🏆" : score >= 7 ? "Solid!" : "Keep practicing."}{" "}
            <button type="button" onClick={reset} className="underline">
              Play again
            </button>
          </p>
        ) : (
          <p className="text-[11px] text-white/50 mt-2 text-center">Click the target before it vanishes</p>
        )}
      </div>
    </dialog>
  );
}

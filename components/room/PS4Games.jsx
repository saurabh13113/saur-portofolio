"use client";
import { useEffect, useRef, useState } from "react";
import { BsX } from "react-icons/bs";
import PenaltyGame from "./PenaltyGame";
import WhackGame from "./WhackGame";

const GAMES = [
  ["penalty", "⚽ Penalty shootout"],
  ["whack", "🎯 Reaction game"],
];

// PS4: pick a game, then play it. Closing a game (or the picker) exits back to
// the room; clicking the PS4 again always starts from the picker.
export default function PS4Games({ open, onClose }) {
  const dialog = useRef(null);
  const [mode, setMode] = useState(null);

  useEffect(() => {
    if (!open) setMode(null);
  }, [open]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && mode === null && !d.open) d.showModal();
    if ((!open || mode !== null) && d.open) d.close();
  }, [open, mode]);

  function closeGame() {
    setMode(null);
    onClose();
  }

  if (mode === "penalty") return <PenaltyGame open onClose={closeGame} />;
  if (mode === "whack") return <WhackGame open onClose={closeGame} />;

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
      aria-label="Choose a game"
      className="family-album bg-transparent p-0 w-[min(92vw,360px)] text-[#f4e4c1]"
    >
      <div className="mc-bevel tex-obsidian p-4">
        <div className="flex items-center justify-between font-mc text-sm mb-3">
          <span className="text-[#f4d27a]">🕹️ PS4</span>
          <button type="button" onClick={onClose} aria-label="Close" className="w-9 h-9 flex items-center justify-center hover:text-[#f4d27a] focus:outline focus:outline-2 focus:outline-white">
            <BsX aria-hidden="true" className="text-xl" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {GAMES.map(([id, label]) => (
            <button key={id} type="button" onClick={() => setMode(id)} className="mc-bevel tex-plank font-mc py-3 focus:outline focus:outline-2 focus:outline-white">
              {label}
            </button>
          ))}
        </div>
      </div>
    </dialog>
  );
}

export function GameHotspot({ label, style }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" aria-label={label} onClick={() => setOpen(true)} className="room-hotspot" style={style}>
        <span className="room-label">{label}</span>
      </button>
      <PS4Games open={open} onClose={() => setOpen(false)} />
    </>
  );
}

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

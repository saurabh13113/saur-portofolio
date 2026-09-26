"use client";
import { useRef, useState } from "react";

const REACTIONS = ["Mrow?", "purrrr", "*stretches*", "not now, human"];

export default function InteractiveCat({ style }) {
  const [reaction, setReaction] = useState(null);
  const timeoutRef = useRef(null);

  function handleClick() {
    setReaction(REACTIONS[Math.floor(Math.random() * REACTIONS.length)]);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setReaction(null), 1500);
  }

  return (
    <button type="button" aria-label="Pet the cat" onClick={handleClick} className="room-hotspot" style={style}>
      <span className="room-label" style={reaction ? { opacity: 1 } : undefined} role={reaction ? "status" : undefined}>
        {reaction ?? "Pet the cat"}
      </span>
    </button>
  );
}

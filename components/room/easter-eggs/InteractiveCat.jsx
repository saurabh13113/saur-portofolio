"use client";
import { useRef, useState } from "react";
import { CAT_REACTIONS as REACTIONS } from "@/components/room/roomObjects";


export default function InteractiveCat({ style }) {
  const [reaction, setReaction] = useState(null);
  const timeoutRef = useRef(null);

  function handleClick() {
    setReaction(REACTIONS[Math.floor(Math.random() * REACTIONS.length)]);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setReaction(null), 1500);
  }

  return (
    <button type="button" aria-label="Pet Tutroo the cat" onClick={handleClick} className="room-hotspot" style={style}>
      <span className="room-label" style={reaction ? { opacity: 1 } : undefined} role={reaction ? "status" : undefined}>
        {reaction ?? "Pet Tutroo"}
      </span>
    </button>
  );
}

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

"use client";
import { useEffect, useRef, useState } from "react";

// The little photo on the desk: click to pop it out as pixel art, click again for the next one.
export default function PhotoFrame({ images, style }) {
  const [index, setIndex] = useState(null);
  const canvas = useRef(null);

  useEffect(() => {
    if (index === null) return;
    const img = new Image();
    img.onload = () => {
      const c = canvas.current;
      if (!c) return;
      const s = Math.max(c.width / img.width, c.height / img.height); // cover-crop
      c.getContext("2d").drawImage(img, (c.width - img.width * s) / 2, (c.height - img.height * s) / 2, img.width * s, img.height * s);
    };
    img.src = images[index];
  }, [images, index]);

  return (
    <button
      type="button"
      aria-label={index === null ? "A photo on the desk" : `Photo ${index + 1} of ${images.length}, click for the next one`}
      onClick={() => setIndex((i) => (i === null ? 0 : (i + 1) % images.length))}
      onBlur={() => setIndex(null)}
      className="room-hotspot"
      style={style}
    >
      <span className="room-label" style={index === null ? undefined : { opacity: 1 }}>
        {index === null ? (
          "A photo"
        ) : (
          <canvas ref={canvas} width={32} height={40} className="block w-24 h-[120px]" style={{ imageRendering: "pixelated" }} />
        )}
      </span>
    </button>
  );
}

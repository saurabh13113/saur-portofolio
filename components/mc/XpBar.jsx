"use client";
import { useEffect, useRef, useState } from "react";

export default function XpBar({ value, max = 100, label, suffix = "", count = false }) {
  const [shown, setShown] = useState(count ? 0 : value);
  const ref = useRef(null);

  useEffect(() => {
    if (!count) {
      setShown(value);
      return;
    }
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 900;
      const tick = (t) => {
        const p = Math.min(1, (t - start) / dur);
        setShown(value * p);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [count, value]);

  const pct = max > 0 ? Math.max(0, Math.min(100, (shown / max) * 100)) : 0;
  const display = Number.isInteger(value) ? String(Math.round(shown)) : shown.toFixed(2);

  return (
    <div ref={ref} className="font-mc">
      <div className="flex justify-between text-sm text-[#f4e4c1]">
        <span>{label}</span>
        <span>
          {display}
          {suffix}
        </span>
      </div>
      <div className="mc-bevel h-4 bg-[#2b2b2b] mt-1">
        <div className="h-full bg-xp" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

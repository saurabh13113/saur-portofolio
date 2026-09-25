"use client";
import { useEffect, useState } from "react";

const SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export default function KonamiUnlock() {
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Secret palette unlocked.");

  useEffect(() => {
    try {
      if (localStorage.getItem("easter-unlocked") === "true") {
        document.documentElement.setAttribute("data-easter", "unlocked");
      }
    } catch {}
  }, []);

  useEffect(() => {
    let progress = 0;

    function onKey(e) {
      const tag = document.activeElement?.tagName ?? "";
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = SEQUENCE[progress];

      if (key === expected) {
        progress += 1;
        if (progress === SEQUENCE.length) {
          progress = 0;
          const isCurrentlyUnlocked = document.documentElement.getAttribute("data-easter") === "unlocked";
          const next = !isCurrentlyUnlocked;
          if (next) {
            document.documentElement.setAttribute("data-easter", "unlocked");
          } else {
            document.documentElement.removeAttribute("data-easter");
          }
          try {
            localStorage.setItem("easter-unlocked", String(next));
          } catch {}
          setToastMessage(next ? "Secret palette unlocked." : "Secret palette restored to normal.");
          setToast(true);
          setTimeout(() => setToast(false), 3000);
        }
      } else {
        progress = key === SEQUENCE[0] ? 1 : 0;
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!toast) return null;

  return (
    <div role="status" className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] mc-bevel tex-plank px-4 py-3 text-xs font-mc text-[#f4e4c1]">
      {toastMessage}
    </div>
  );
}

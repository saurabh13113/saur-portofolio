"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSfx } from "@/hooks/useSfx";

export default function BreakOverlay() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { play } = useSfx();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    play("break");
  }, [pathname, play]);

  if (reduce) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className="fixed inset-0 z-40 pointer-events-none tex-stone"
        initial={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
        animate={{ opacity: [1, 1, 0.6, 0], clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.45, times: [0, 0.3, 0.6, 1], ease: "linear" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0,rgba(0,0,0,0.35)_70%)]" />
        <div
          className="absolute inset-0 mc-crack"
          style={{ opacity: 0.85, animation: "none" }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

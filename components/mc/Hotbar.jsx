"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { hotbar } from "@/data/portfolio";
import { useSfx } from "@/hooks/useSfx";

export default function Hotbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { muted, play, toggle } = useSfx();

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = document.activeElement?.tagName ?? "";
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;
      const slot = hotbar.find((s) => String(s.slot) === e.key);
      if (!slot) return;
      play("click");
      if (slot.kind === "sound") toggle();
      else if (slot.kind === "external") window.open(slot.href, "_blank", "noopener");
      else router.push(slot.href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, play, toggle]);

  // The room is the nav on the home page; number keys above still work there.
  if (pathname === "/") return null;

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex gap-1 p-1 mc-bevel tex-stone">
      {hotbar.map((s) => {
        const active = s.kind === "route" && s.href === pathname;
        const cls = `w-14 h-14 mc-bevel tex-dirt flex flex-col items-center justify-center font-mc text-[10px] leading-tight text-[#f4e4c1] focus:outline focus:outline-2 focus:outline-white ${
          active ? "outline outline-2 outline-[#f4d27a]" : ""
        }`;
        const label = s.kind === "sound" ? (muted ? "OFF" : "ON") : s.label;
        const inner = (
          <>
            <span className="text-[8px] opacity-60">{s.slot}</span>
            <span>{label}</span>
          </>
        );
        if (s.kind === "sound") {
          return (
            <button
              key={s.slot}
              type="button"
              aria-label={`Sound ${muted ? "off" : "on"}`}
              className={cls}
              onClick={() => {
                play("click");
                toggle();
              }}
            >
              {inner}
            </button>
          );
        }
        if (s.kind === "external") {
          return (
            <a key={s.slot} href={s.href} target="_blank" rel="noreferrer" className={cls} onClick={() => play("click")}>
              {inner}
            </a>
          );
        }
        return (
          <Link key={s.slot} href={s.href} className={cls} onClick={() => play("click")}>
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}

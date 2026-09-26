"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BsArrowUpRight, BsGithub, BsChevronLeft, BsChevronRight, BsLink45Deg } from "react-icons/bs";
import { CATEGORIES, filterProjects } from "@/data/portfolio";
import { techIcon } from "@/components/mc/icons";

const pad = (n) => String(n).padStart(2, "0");

// Stand-in artwork for projects without a screenshot.
function Cover({ project, n }) {
  const icons = project.stack.map(techIcon).filter(Boolean).slice(0, 5);
  return (
    <div className="absolute inset-0 flex flex-col justify-end p-6 pb-16 bg-[#17151f] bg-[linear-gradient(rgba(244,210,122,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(244,210,122,0.06)_1px,transparent_1px)] bg-[size:24px_24px]">
      <div aria-hidden="true" className="absolute top-4 right-6 font-mc text-8xl font-extrabold text-[#f4d27a]/15">
        {pad(n)}
      </div>
      <div aria-hidden="true" className="flex gap-3 text-3xl text-[#f4d27a]/80 mb-3">
        {icons.map((Ic, k) => (
          <Ic key={k} />
        ))}
      </div>
      <div className="font-mc text-xl sm:text-2xl text-[#f4e4c1]">{project.title}</div>
    </div>
  );
}

// One project at a time, like flipping through builds: arrows, a numbered strip,
// swipe on touch screens, and ←/→ keys.
export default function WorkCarousel({ projects }) {
  const [cat, setCat] = useState("All");
  const [i, setI] = useState(0);
  const list = filterProjects(projects, cat);
  const p = list[Math.min(i, list.length - 1)];
  const go = (d) => setI((x) => (x + d + list.length) % list.length);

  useEffect(() => {
    const onKey = (e) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? "")) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const strip = useRef(null);
  useEffect(() => {
    strip.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [i, cat]);

  // Shareable links: /work?project=<slug> opens that project, and the URL follows
  // along as you browse (left alone until you actually move off the first slide).
  useEffect(() => {
    const k = projects.findIndex((q) => q.slug === new URLSearchParams(window.location.search).get("project"));
    if (k >= 0) setI(k);
  }, [projects]);
  const synced = useRef(false);
  useEffect(() => {
    if (!synced.current) {
      synced.current = true;
      return;
    }
    if (p) window.history.replaceState(null, "", `?project=${p.slug}`);
  }, [p]);

  const [copied, setCopied] = useState(false);
  const copyLink = () =>
    navigator.clipboard
      ?.writeText(`${window.location.origin}/work?project=${p.slug}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});

  const touchX = useRef(null);
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - (touchX.current ?? 0);
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };

  if (!p) return null;

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-1 p-1 mc-bevel tex-stone w-max max-w-full">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCat(c);
              setI(0);
            }}
            aria-pressed={cat === c}
            className={`mc-bevel tex-dirt font-mc text-xs px-3 py-2 min-h-[44px] text-[#f4e4c1] focus:outline focus:outline-2 focus:outline-white ${
              cat === c ? "outline outline-2 outline-[#f4d27a]" : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8" aria-live="polite">
        <div key={`text-${p.slug}`} className="slide-in order-2 lg:order-1 flex flex-col gap-5">
          <div aria-hidden="true" className="text-7xl font-extrabold leading-none text-transparent" style={{ WebkitTextStroke: "1px #f4d27a" }}>
            {pad(list.indexOf(p) + 1)}
          </div>
          <div className="font-mc text-xs uppercase tracking-widest text-emerald">{p.category} project</div>
          <h2 className="font-mc text-2xl sm:text-3xl text-[#f4e4c1] leading-tight">{p.title}</h2>
          <p className="text-white/70 text-sm leading-relaxed">{p.description}</p>
          <ul className="flex flex-wrap gap-2">
            {p.stack.map((s) => {
              const Ic = techIcon(s);
              return (
                <li key={s} className="mc-bevel tex-obsidian px-2 py-1 text-xs font-mc text-[#a8f0c0] inline-flex items-center gap-1">
                  {Ic ? <Ic aria-hidden="true" /> : null}
                  {s}
                </li>
              );
            })}
          </ul>
          <div className="border-t border-white/10" />
          <div className="flex flex-wrap gap-3">
            {p.links.live ? (
              <a href={p.links.live} target="_blank" rel="noreferrer" className="mc-bevel tex-plank font-mc px-4 py-3 text-[#f4e4c1] inline-flex items-center gap-2 focus:outline focus:outline-2 focus:outline-white">
                <BsArrowUpRight aria-hidden="true" /> Live
              </a>
            ) : null}
            {p.links.github ? (
              <a href={p.links.github} target="_blank" rel="noreferrer" className="mc-bevel tex-obsidian font-mc px-4 py-3 text-[#f4e4c1] inline-flex items-center gap-2 focus:outline focus:outline-2 focus:outline-white">
                <BsGithub aria-hidden="true" /> GitHub
              </a>
            ) : null}
            <button type="button" onClick={copyLink} className="mc-bevel tex-obsidian font-mc px-4 py-3 text-[#f4e4c1] inline-flex items-center gap-2 focus:outline focus:outline-2 focus:outline-white">
              <BsLink45Deg aria-hidden="true" /> {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div
            className="relative aspect-video mc-bevel tex-obsidian overflow-hidden"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={onTouchEnd}
          >
            <div key={`media-${p.slug}`} className="slide-in absolute inset-0">
              {p.image ? (
                <Image src={p.image} alt={`Screenshot of ${p.title}`} fill sizes="(max-width: 960px) 100vw, 600px" className="object-cover object-top" style={{ imageRendering: "auto" }} />
              ) : (
                <Cover project={p} n={list.indexOf(p) + 1} />
              )}
            </div>
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <span className="mc-bevel tex-obsidian px-2 py-1 text-xs font-mc text-[#f4e4c1]">
                {pad(list.indexOf(p) + 1)} / {pad(list.length)}
              </span>
              <button type="button" onClick={() => go(-1)} aria-label="Previous project" className="mc-bevel tex-plank w-11 h-11 flex items-center justify-center text-[#f4d27a] focus:outline focus:outline-2 focus:outline-white">
                <BsChevronLeft aria-hidden="true" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next project" className="mc-bevel tex-plank w-11 h-11 flex items-center justify-center text-[#f4d27a] focus:outline focus:outline-2 focus:outline-white">
                <BsChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>

          <div ref={strip} className="flex gap-1 mt-3 overflow-x-auto pb-2" role="group" aria-label="Jump to project">
            {list.map((q, k) => (
              <button
                key={q.slug}
                type="button"
                onClick={() => setI(k)}
                aria-label={q.title}
                aria-current={q === p}
                title={q.title}
                className={`shrink-0 mc-bevel font-mc text-xs w-11 h-11 focus:outline focus:outline-2 focus:outline-white ${
                  q === p ? "bg-[#f4d27a] text-[#1c1c22]" : "tex-dirt text-[#f4e4c1]"
                }`}
              >
                {pad(k + 1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

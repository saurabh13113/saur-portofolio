"use client";
import { useState } from "react";
import { BsArrowUpRight, BsGithub } from "react-icons/bs";
import { CATEGORIES, filterProjects } from "@/data/portfolio";

// Everything that isn't featured: coursework and smaller builds, as compact
// cards with a category filter. Each card has an id, so /projects?project=<slug>
// can scroll to it.
export default function MoreProjects({ projects }) {
  const [cat, setCat] = useState("All");
  const list = filterProjects(projects, cat);
  const cats = CATEGORIES.filter((c) => c === "All" || projects.some((p) => p.category === c));

  return (
    <section aria-labelledby="more-projects" className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="more-projects" className="font-mc text-xl text-[#f4e4c1]">
          More projects <span className="text-white/40 text-sm">coursework &amp; smaller builds</span>
        </h2>
        <div className="flex gap-1 p-1 mc-bevel tex-stone max-w-full overflow-x-auto">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`shrink-0 font-mc text-xs px-3 min-h-[36px] focus:outline focus:outline-2 focus:outline-white ${
                cat === c ? "bg-[#f4d27a] text-[#1c1c22]" : "tex-dirt text-[#f4e4c1]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
        {list.map((p) => {
          const live = p.links.live && p.links.live !== p.links.github ? p.links.live : null;
          return (
            <li key={p.slug} id={p.slug} className="mc-bevel tex-stone p-4 flex flex-col gap-2 scroll-mt-24 target:outline target:outline-2 target:outline-[#f4d27a]">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-mc text-sm text-[#f4e4c1] leading-snug">{p.title}</h3>
                <span className="font-mc text-[10px] uppercase tracking-wider text-emerald shrink-0 pt-0.5">{p.category}</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed flex-1">{p.blurb}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mc text-white/50 truncate">{p.stack.slice(0, 3).join(" · ")}</span>
                <span className="flex gap-3 shrink-0 text-[#f4d27a]">
                  {live ? (
                    <a href={live} target="_blank" rel="noreferrer" aria-label={`${p.title}: live demo`} className="hover:text-white focus:outline focus:outline-2 focus:outline-white">
                      <BsArrowUpRight aria-hidden="true" />
                    </a>
                  ) : null}
                  {p.links.github ? (
                    <a href={p.links.github} target="_blank" rel="noreferrer" aria-label={`${p.title} on GitHub`} className="hover:text-white focus:outline focus:outline-2 focus:outline-white">
                      <BsGithub aria-hidden="true" />
                    </a>
                  ) : null}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

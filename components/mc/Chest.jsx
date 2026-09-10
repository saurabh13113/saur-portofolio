"use client";
import {
  Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import BlockButton from "@/components/mc/BlockButton";
import { useSfx } from "@/hooks/useSfx";

export default function Chest({ project }) {
  const { play } = useSfx();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          onClick={() => play("orb")}
          className={`group relative mc-bevel tex-plank p-4 text-left w-full h-full focus:outline focus:outline-2 focus:outline-white ${
            project.featured ? "sm:col-span-2" : ""
          }`}
        >
          <div className="font-mc text-[11px] text-[#d9b98a] uppercase">{project.category}</div>
          <div className="font-mc text-lg text-[#f4e4c1] mt-1">{project.title}</div>
          <p className="text-sm text-white/75 mt-2 line-clamp-3 font-primary">{project.blurb}</p>
          <span className="absolute right-3 top-3 text-xl opacity-70 group-hover:opacity-100">▦</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="tex-stone mc-bevel border-t-0 text-[#f4e4c1] max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="font-mc text-2xl text-[#f4e4c1]">{project.title}</SheetTitle>
        </SheetHeader>
        <p className="mt-3 text-white/85 font-primary max-w-[70ch]">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.stack.map((s) => (
            <span key={s} className="mc-bevel tex-obsidian px-2 py-1 text-xs font-mc text-[#a8f0c0]">
              {s}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-5">
          {project.links.live ? (
            <a href={project.links.live} target="_blank" rel="noreferrer">
              <BlockButton>Live</BlockButton>
            </a>
          ) : null}
          {project.links.github ? (
            <a href={project.links.github} target="_blank" rel="noreferrer">
              <BlockButton tex="obsidian">GitHub</BlockButton>
            </a>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

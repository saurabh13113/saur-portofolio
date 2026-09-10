"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { projects, sortedProjects, filterProjects, CATEGORIES } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import Chest from "@/components/mc/Chest";

export default function Work() {
  const [cat, setCat] = useState("All");
  const list = sortedProjects(filterProjects(projects, cat));

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.4 } }}
      className="container mx-auto py-12"
    >
      <Sign>Builds</Sign>

      <div className="flex flex-wrap gap-1 mt-6 p-1 mc-bevel tex-stone w-max max-w-full">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`mc-bevel tex-dirt font-mc text-xs px-3 py-2 text-[#f4e4c1] focus:outline focus:outline-2 focus:outline-white ${
              cat === c ? "outline outline-2 outline-white" : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {list.map((p) => (
          <Chest key={p.slug} project={p} />
        ))}
      </div>
    </motion.section>
  );
}

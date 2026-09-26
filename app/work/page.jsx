import fs from "node:fs";
import path from "node:path";
import { projects, sortedProjects } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import WorkCarousel from "@/components/work/WorkCarousel";

// Checked at build time: only screenshots that actually exist are passed on;
// projects without one get a generated cover in the carousel.
const list = sortedProjects(projects).map((p) => ({
  ...p,
  image: p.image && fs.existsSync(path.join(process.cwd(), "public", p.image)) ? p.image : null,
}));

export const metadata = {
  title: "Work",
  description: "Projects by Saurabh Nair: AI tutors, interview simulators, ML models, full-stack apps and more.",
  alternates: { canonical: "/work" },
};

export default function Work() {
  return (
    <section className="container mx-auto py-8">
      <Sign>Work</Sign>
      <WorkCarousel projects={list} />
    </section>
  );
}

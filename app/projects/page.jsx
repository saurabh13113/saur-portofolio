import fs from "node:fs";
import path from "node:path";
import { projects } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import WorkCarousel from "@/components/work/WorkCarousel";
import MoreProjects from "@/components/work/MoreProjects";

// Checked at build time: only screenshots that actually exist are passed on;
// projects without one get a generated cover in the carousel.
const withImage = (p) => ({ ...p, image: p.image && fs.existsSync(path.join(process.cwd(), "public", p.image)) ? p.image : null });
const featured = projects.filter((p) => p.featured).map(withImage);
const more = projects.filter((p) => !p.featured);

export const metadata = {
  title: "Projects",
  description: "Projects by Saurabh Nair: AI tutors, interview simulators, ML models, full-stack apps and more.",
  alternates: { canonical: "/projects" },
};

export default function Projects() {
  return (
    <section className="container mx-auto py-8">
      <Sign>Projects</Sign>
      <WorkCarousel projects={featured} />
      <MoreProjects projects={more} />
    </section>
  );
}

"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { experience, education, skills, profile } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import Panel from "@/components/mc/Panel";
import XpBar from "@/components/mc/XpBar";
import { techIcon } from "@/components/mc/icons";
import { FiDownload } from "react-icons/fi";

export default function Resume() {
  return (
    <section className="container mx-auto py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <Sign>Resume</Sign>
        <a href="/assets/resume.pdf" download className="mc-bevel tex-plank font-mc px-4 py-3 text-[#f4e4c1] inline-flex items-center gap-2 focus:outline focus:outline-2 focus:outline-white">
          <FiDownload aria-hidden="true" /> Download PDF
        </a>
      </div>

      <Tabs defaultValue="experience" className="flex flex-col xl:flex-row gap-10">
        <TabsList className="grid grid-cols-2 sm:flex xl:flex-col gap-2 h-max bg-transparent p-0">
          {["experience", "education", "skills", "about"].map((v) => (
            <TabsTrigger
              key={v}
              value={v}
              className="mc-bevel tex-dirt font-mc text-sm px-4 py-3 text-[#f4e4c1] capitalize data-[state=active]:outline data-[state=active]:outline-2 data-[state=active]:outline-[#f4d27a]"
            >
              {v}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="w-full">
          <TabsContent value="experience" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {experience.map((e) => (
              <Panel key={e.role + e.org} tex="stone" className="p-5 text-[#f4e4c1]">
                <span className="font-mc text-xs text-emerald">
                  {e.start} – {e.end}
                </span>
                <h3 className="font-mc text-lg mt-1">{e.role}</h3>
                <p className="text-white/70 font-primary text-sm">
                  {e.org} · {e.location}
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-1 text-white/80 font-primary text-sm">
                  {e.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </Panel>
            ))}
          </TabsContent>

          <TabsContent value="education" className="grid grid-cols-1 gap-4">
            {education.map((ed) => (
              <Panel key={ed.school} tex="stone" className="p-5 text-[#f4e4c1]">
                <span className="font-mc text-xs text-emerald">
                  {ed.start} – {ed.end}
                </span>
                <h3 className="font-mc text-lg mt-1">{ed.school}</h3>
                <p className="text-white/80 font-primary text-sm">
                  {ed.credential} — {ed.detail}
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-1 text-white/80 font-primary text-sm">
                  {ed.honors.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </Panel>
            ))}
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            {skills.map((g) => (
              <div key={g.group}>
                <h3 className="font-mc text-lg text-[#f4e4c1] mb-3">{g.group}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {g.items.map((it) => {
                    const Ic = techIcon(it.name);
                    return (
                      <div key={it.name} className="flex items-center gap-2">
                        {Ic ? (
                          <span className="text-emerald text-lg shrink-0" aria-hidden="true">
                            <Ic />
                          </span>
                        ) : null}
                        <div className="flex-1">
                          <XpBar label={it.name} value={it.level} max={100} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="about" className="text-[#f4e4c1]">
            <Panel tex="stone" className="p-5">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-primary text-sm">
                <li><span className="text-white/60">Name:</span> {profile.name}</li>
                <li><span className="text-white/60">Role:</span> {profile.role}</li>
                <li><span className="text-white/60">Location:</span> {profile.location}</li>
                <li><span className="text-white/60">Website:</span> {profile.website}</li>
                <li><span className="text-white/60">Email:</span> {profile.email}</li>
                <li><span className="text-white/60">Phone:</span> {profile.phone}</li>
              </ul>
              <p className="mt-4 text-white/80 font-primary text-sm max-w-[70ch]">{profile.tagline}</p>
            </Panel>
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}

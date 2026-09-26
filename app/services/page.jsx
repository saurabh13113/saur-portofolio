import Link from "next/link";
import { services } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import Panel from "@/components/mc/Panel";

export const metadata = {
  title: "What I do",
  description: "What Saurabh Nair builds: full-stack web apps, backend APIs, ML and data, DevOps and cloud automation.",
  alternates: { canonical: "/services" },
};

export default function Services() {
  return (
    <section className="container mx-auto py-8">
      <Sign>What I do</Sign>
      <p className="text-white/70 text-sm mt-3 mb-8">How I can help your team, and where I&apos;ve done it before.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((s) => (
          <Panel key={s.num} tex="stone" className="p-6 text-[#f4e4c1] flex flex-col">
            <div className="font-mc text-3xl text-emerald">{s.num}</div>
            <h2 className="font-mc text-xl mt-2">{s.title}</h2>
            <p className="text-white/80 font-primary text-sm mt-2 flex-1">{s.description}</p>
            <Link href={s.proof.href} className="mt-4 text-xs font-mc text-[#f4d27a] hover:underline underline-offset-4">
              → {s.proof.text}
            </Link>
          </Panel>
        ))}
      </div>
    </section>
  );
}

import { services } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import Panel from "@/components/mc/Panel";

export const metadata = {
  title: "Services",
  description: "What Saurabh Nair builds: full-stack web apps, backend APIs, ML and data, DevOps and cloud automation.",
  alternates: { canonical: "/services" },
};

export default function Services() {
  return (
    <section className="container mx-auto py-12">
      <Sign className="mb-8">Services</Sign>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((s) => (
          <Panel key={s.num} tex="stone" className="p-6 text-[#f4e4c1]">
            <div className="font-mc text-3xl text-emerald">{s.num}</div>
            <h2 className="font-mc text-xl mt-2">{s.title}</h2>
            <p className="text-white/80 font-primary text-sm mt-2">{s.description}</p>
          </Panel>
        ))}
      </div>
    </section>
  );
}

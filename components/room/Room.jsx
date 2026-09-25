import { profile } from "@/data/portfolio";
import RoomHotspot from "@/components/room/RoomHotspot";
import HiddenObject from "@/components/room/easter-eggs/HiddenObject";
import InteractiveCat from "@/components/room/easter-eggs/InteractiveCat";

const HOTSPOTS = [
  { href: "/work", label: "Work", icon: "🖥️", style: { left: "18%", top: "55%" } },
  { href: "/resume", label: "Resume", icon: "📚", style: { left: "82%", top: "42%" } },
  { href: "/contact", label: "Contact", icon: "☎️", style: { left: "12%", top: "85%" } },
  { href: "/services", label: "Services", icon: "🚪", style: { left: "50%", top: "12%" } },
];

export default function Room() {
  return (
    <section className="container mx-auto py-10">
      <div className="text-center mb-6">
        <h1 className="font-mc text-2xl text-[#f4e4c1]">{profile.name}</h1>
        <p className="font-mc text-sm text-emerald mt-1">{profile.tagline}</p>
      </div>

      <div className="relative aspect-[16/10] w-full max-w-[900px] mx-auto mc-bevel tex-stone overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-[18%] tex-plank" aria-hidden="true" />
        <div
          className="absolute w-10 h-14 rounded-t-full bg-[#f4d27a] shadow-[0_0_24px_10px_rgba(244,210,122,0.35)] mc-lamp"
          style={{ left: "5%", top: "6%" }}
          aria-hidden="true"
        />
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 mc-bevel tex-plank px-2 py-1 text-[9px] font-mc text-[#f4e4c1] text-center leading-tight max-w-[110px]"
          style={{ left: "90%", top: "10%" }}
        >
          🏆 TMU Solution Hacks &apos;25 winner
          <br />
          🌱 Dean&apos;s List, 4 yrs
        </div>
        {HOTSPOTS.map((h) => (
          <RoomHotspot key={h.href} {...h} />
        ))}
        <HiddenObject
          icon="🦆"
          label="A rubber duck"
          tooltip="Just a debugging duck. Carry on."
          style={{ left: "88%", top: "82%" }}
        />
        <HiddenObject
          icon="🖼️"
          label="A framed poster"
          tooltip="Dean's List Scholar, 2022-2025."
          style={{ left: "38%", top: "10%" }}
        />
        <InteractiveCat style={{ left: "60%", top: "75%" }} />
      </div>
    </section>
  );
}

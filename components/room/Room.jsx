import { profile } from "@/data/portfolio";
import { socialIcon } from "@/components/mc/icons";
import RoomHotspot from "@/components/room/RoomHotspot";
import HiddenObject from "@/components/room/easter-eggs/HiddenObject";
import InteractiveCat from "@/components/room/easter-eggs/InteractiveCat";
import PhotoFrame from "@/components/room/easter-eggs/PhotoFrame";
import AudioObject from "@/components/room/easter-eggs/AudioObject";

const HOTSPOTS = [
  { href: "/work", label: "Work", icon: "🖥️", style: { left: "30%", top: "48%" } },
  { href: "/resume", label: "Resume", icon: "📚", style: { left: "90%", top: "50%" } },
  { href: "/contact", label: "Contact", icon: "☎️", style: { left: "15%", top: "80%" } },
  { href: "/services", label: "Services", icon: "🚪", style: { left: "50%", top: "10%" } },
];

export default function Room() {
  return (
    <section className="container mx-auto py-10">
      <div className="text-center mb-6">
        <h1 className="font-mc text-2xl text-[#f4e4c1]">{profile.name}</h1>
        <p className="font-mc text-sm text-emerald mt-1">{profile.tagline}</p>
        <div className="flex justify-center gap-2 mt-3">
          {profile.socials.map((s) => {
            const Icon = socialIcon(s.key);
            return (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.key}
                className="mc-bevel tex-obsidian w-9 h-9 flex items-center justify-center text-[#a8f0c0] text-base focus:outline focus:outline-2 focus:outline-white"
              >
                {Icon ? <Icon /> : "▦"}
              </a>
            );
          })}
        </div>
      </div>

      <div className="relative aspect-[16/10] w-full max-w-[900px] mx-auto mc-bevel tex-stone overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-[18%] tex-plank" aria-hidden="true" />
        <div
          className="absolute w-10 h-14 rounded-t-full bg-[#f4d27a] shadow-[0_0_24px_10px_rgba(244,210,122,0.35)] mc-lamp"
          style={{ left: "5%", top: "6%" }}
          aria-hidden="true"
        />
        <div
          className="absolute -translate-x-1/2 mc-bevel tex-plank px-2 py-1 text-[9px] font-mc text-[#f4e4c1] text-center leading-tight w-[112px]"
          style={{ left: "80%", top: "3%" }}
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
          tooltipAlign="right"
          tooltipSide="top"
          style={{ left: "90%", top: "80%" }}
        />
        <HiddenObject
          icon="🖼️"
          label="A framed poster"
          tooltip="Dean's List Scholar, 2022-2025."
          tooltipAlign="right"
          style={{ left: "70%", top: "48%" }}
        />
        <InteractiveCat style={{ left: "55%", top: "80%" }} />
        <PhotoFrame images={["/assets/photo.jpg", "/assets/photo.png"]} style={{ left: "15%", top: "15%" }} />
        <AudioObject icon="🎹" label="Play a favorite piece" src="/sfx/keyboard-piece.mp3" style={{ left: "55%", top: "40%" }} />
        <AudioObject icon="🔊" label="Play a song on loop" src="/sfx/speaker-loop.mp3" loop style={{ left: "10%", top: "45%" }} />
      </div>
    </section>
  );
}

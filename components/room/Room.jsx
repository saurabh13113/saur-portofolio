import Image from "next/image";
import { profile } from "@/data/portfolio";
import { socialIcon } from "@/components/mc/icons";
import RoomHotspot from "@/components/room/RoomHotspot";
import HiddenObject from "@/components/room/easter-eggs/HiddenObject";
import InteractiveCat from "@/components/room/easter-eggs/InteractiveCat";
import PhotoFrame from "@/components/room/easter-eggs/PhotoFrame";
import AudioObject from "@/components/room/easter-eggs/AudioObject";

// Hotspots are [left, top, width, height] in % of public/assets/room.png (square).
// If the art is regenerated, re-measure these against the new image.
const at = ([left, top, width, height]) => ({ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` });

const NAV = [
  { href: "/work", label: "Work", rect: [53.5, 20, 19, 17.5] },
  { href: "/resume", label: "Resume", rect: [16.8, 10.5, 18.3, 38] },
  { href: "/resume", label: "Skills", rect: [76, 73.5, 24, 26.5] },
  { href: "/services", label: "Services", rect: [0, 10.5, 13, 41.5] },
  { href: "/contact", label: "Say hi", rect: [42, 22.5, 14.5, 28.5], below: true },
];

const EGGS = [
  { label: "UTM pennant", tooltip: "CS & Economics @ University of Toronto", rect: [34, 2, 7.5, 18.5] },
  { label: "Trophy shelf", tooltip: "🏆 TMU Solution Hacks '25 winner · 🌱 Dean's List, 4 yrs", rect: [42.5, 4.5, 21, 14] },
  { label: "A framed poster", tooltip: "Dean's List Scholar, 2022-2025.", rect: [67, 4.5, 11.8, 19.5] },
  { label: "Backpack", tooltip: "Always packed for the next hackathon.", rect: [14.5, 38.5, 8, 12.5] },
  { label: "The bed", tooltip: "5 more minutes... then one more commit.", rect: [4, 53, 37, 40] },
  { label: "Nightstand books", tooltip: "Bedtime reading: Better Code, Better Days.", rect: [0, 81, 16, 17] },
  { label: "Hoodie on the hook", tooltip: "The hackathon hoodie. Undefeated.", rect: [13.6, 18.5, 6, 17.5] },
  { label: "Beanbag", tooltip: "Where the hardest bugs get solved.", rect: [83, 64, 17, 9.5] },
  { label: "Laundry basket", tooltip: "Scheduled for after the next deploy.", rect: [88.5, 52, 11.5, 11.5] },
];

export default function Room() {
  return (
    <section className="container mx-auto pt-6 overflow-hidden">
      <div className="text-center mb-3">
        <h1 className="font-mc text-2xl text-[#f4e4c1]">{profile.name}</h1>
        <p className="text-sm text-emerald mt-1">{profile.tagline}</p>
        <div className="flex justify-center gap-2 mt-2">
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

      <div data-room className="relative w-full max-w-[min(900px,calc(100vh-11rem))] mx-auto aspect-square">
        <Image
          src="/assets/room.png"
          alt="Isometric pixel-art bedroom at night: Saurabh coding at a triple-monitor desk, bookshelf, trophies, a cat on the window sill."
          fill
          priority
          sizes="(max-width: 900px) 100vw, 900px"
          className="object-cover select-none room-img"
        />
        <div className="room-fx room-rain" style={{ clipPath: "polygon(85.5% 14%, 100% 9.5%, 100% 47%, 85.5% 37%)" }} />
        <div className="room-fx room-screen" style={at([53, 19, 21, 20])} />
        <div className="room-fx room-lamp mc-lamp" style={at([40, 13, 14, 14])} />
        <div className="room-fx room-lamp mc-lamp" style={at([0, 74, 13, 13])} />

        {NAV.map((n) => (
          <RoomHotspot key={n.label} href={n.href} label={n.label} below={n.below} style={at(n.rect)} />
        ))}
        {EGGS.map((e) => (
          <HiddenObject key={e.label} label={e.label} tooltip={e.tooltip} style={at(e.rect)} />
        ))}
        <InteractiveCat style={at([87, 36, 10, 9])} />
        <PhotoFrame images={["/assets/photo.jpg", "/assets/photo.png"]} style={at([49.5, 18.5, 3, 4])} />
        <AudioObject label="Play a favorite piece" src="/sfx/keyboard-piece.mp3" style={at([51, 29.5, 10.5, 6.5])} />
        <AudioObject label="Play a song on loop" src="/sfx/speaker-loop.mp3" loop style={at([67, 41.5, 12, 17])} />
        <HiddenObject label="Student ID" tooltip="UTM student card. Access level: caffeine." style={at([66, 37.8, 8, 5])} />
      </div>
    </section>
  );
}

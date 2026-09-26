import { profile } from "@/data/portfolio";
import { socialIcon } from "@/components/mc/icons";
import RoomStage from "@/components/room/RoomStage";

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
        <RoomStage />
      </div>
    </section>
  );
}

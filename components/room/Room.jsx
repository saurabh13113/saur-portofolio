import { profile } from "@/data/portfolio";
import { socialIcon } from "@/components/mc/icons";
import RoomStage from "@/components/room/RoomStage";
import Avatar from "@/components/room/Avatar";

// Home: the 3D me, my name and socials beside the room (stacked on phones).
// The room box keeps the camera's aspect (projection.js ASPECT = 1.15) and grows
// to whatever the viewport height allows.
export default function Room() {
  return (
    <section className="px-4 lg:px-8 pt-3 overflow-hidden">
      <div className="mx-auto max-w-[1800px] grid gap-4 lg:gap-6 lg:grid-cols-[260px_1fr] lg:items-center">
        <aside className="flex flex-row lg:flex-col items-center lg:items-start gap-4">
          <Avatar className="w-[110px] shrink-0 lg:w-[260px]" />
          <div className="flex flex-col gap-2">
            <h1 className="font-mc text-2xl lg:text-4xl text-[#f4e4c1] leading-tight">{profile.name}</h1>
            <p className="font-mc text-sm lg:text-base text-[#f4d27a]">{profile.role}</p>
            <div className="flex gap-2 mt-1">
              {profile.socials.map((s) => {
                const Icon = socialIcon(s.key);
                return (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.key}
                    className="mc-bevel tex-obsidian w-11 h-11 flex items-center justify-center text-[#a8f0c0] text-base focus:outline focus:outline-2 focus:outline-white"
                  >
                    {Icon ? <Icon /> : "▦"}
                  </a>
                );
              })}
            </div>
          </div>
        </aside>

        <div data-room className="relative w-full max-w-[min(100%,calc((100vh-1.5rem)*1.15))] mx-auto aspect-[1.15/1]">
          <RoomStage />
        </div>
      </div>
    </section>
  );
}

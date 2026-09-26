"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/data/portfolio";
import { socialIcon } from "@/components/mc/icons";
import Avatar from "@/components/room/Avatar";

// The 3D me, my name and socials, beside every page (mounted once in the root
// layout, so the avatar keeps running across navigation). Off the home page the
// avatar is the way back: a link with a speech bubble saying so.
export default function Sidebar() {
  const home = usePathname() === "/";
  const avatarCls = "w-[110px] shrink-0 lg:w-[260px]";
  const Name = home ? "h1" : "p"; // inner pages have their own h1
  return (
    <aside className={`${home ? "" : "pt-8 lg:pt-0"} flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:sticky lg:top-0 lg:h-screen lg:justify-center`}>
      {/* same tree on every page so the avatar's canvas survives navigation */}
      <div className={`relative ${avatarCls}`}>
        <Avatar bubble={home ? null : "Click me to go back home!"} />
        {home ? null : (
          <Link href="/" aria-label="Back to my room (home)" className="absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f4d27a]" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Name className="font-mc text-2xl lg:text-4xl text-[#f4e4c1] leading-tight">{profile.name}</Name>
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
  );
}

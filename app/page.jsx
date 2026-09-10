import Image from "next/image";
import { profile, stats } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import BlockButton from "@/components/mc/BlockButton";
import XpBar from "@/components/mc/XpBar";
import StatusRow from "@/components/mc/StatusRow";
import { socialIcon } from "@/components/mc/icons";

export default function Home() {
  return (
    <section className="container mx-auto py-10">
      <StatusRow />

      <div className="flex flex-col xl:flex-row items-center justify-between gap-12 mt-8">
        <div className="order-2 xl:order-none text-center xl:text-left">
          <Sign className="mb-6">{profile.name}</Sign>
          <p className="font-mc text-lg text-emerald">{profile.role}</p>
          <p className="max-w-[520px] mt-4 text-white/80 font-primary">{profile.tagline}</p>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-8">
            <a href={profile.resumePdf} download>
              <BlockButton>Get the Resume</BlockButton>
            </a>
            <div className="flex gap-2">
              {profile.socials.map((s) => {
                const Icon = socialIcon(s.key);
                return (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.key}
                    className="mc-bevel tex-obsidian w-11 h-11 flex items-center justify-center text-[#a8f0c0] text-lg focus:outline focus:outline-2 focus:outline-white"
                  >
                    {Icon ? <Icon /> : "▦"}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="order-1 xl:order-none mc-bevel tex-plank p-3">
          <div className="relative w-[260px] h-[260px] xl:w-[320px] xl:h-[320px]">
            <Image src="/assets/photo.png" alt={profile.name} fill className="object-cover" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
        {stats.map((s) => (
          <XpBar key={s.label} label={s.label} value={s.value} max={s.max} suffix={s.suffix} count />
        ))}
      </div>
    </section>
  );
}

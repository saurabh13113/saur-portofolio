import Link from "next/link";
import Sign from "@/components/mc/Sign";

export const metadata = { title: "Page not found", alternates: { canonical: null } };

// In-theme 404: the sidebar (and the avatar's "go back home" bubble) stays beside it.
export default function NotFound() {
  return (
    <section className="container mx-auto py-8">
      <Sign className="mb-6">404</Sign>
      <p className="font-mc text-lg text-[#f4e4c1]">Oops, you&apos;re not supposed to be here!</p>
      <p className="text-white/70 text-sm mt-2">This page doesn&apos;t exist (or it moved).</p>
      <div className="flex flex-wrap gap-3 mt-6">
        {[
          ["/", "Back to my room"],
          ["/projects", "Projects"],
          ["/resume", "Resume"],
          ["/contact", "Contact"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="mc-bevel tex-plank font-mc px-4 py-3 text-[#f4e4c1] focus:outline focus:outline-2 focus:outline-white">
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}

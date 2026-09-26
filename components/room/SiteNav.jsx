"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["/work", "Work"],
  ["/resume", "Resume"],
  ["/services", "What I do"],
  ["/contact", "Contact"],
];

// Page-to-page nav for the inner pages (the room is the nav on the home page,
// and the avatar in the sidebar goes back there).
export default function SiteNav() {
  const path = usePathname();
  if (path === "/") return null;
  return (
    <nav aria-label="Pages" className="container mx-auto pt-4 lg:pt-6">
      <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mc text-sm">
        {LINKS.map(([href, label]) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={path === href ? "page" : undefined}
              className={`underline-offset-8 decoration-2 hover:text-[#f4d27a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f4d27a] ${
                path === href ? "text-[#f4d27a] underline" : "text-white/70"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

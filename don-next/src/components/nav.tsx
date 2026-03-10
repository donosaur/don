"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/play", label: "Play" },
  { href: "/taste", label: "Taste" },
  { href: "/projects", label: "Projects" },
];

export function Nav() {
  const pathname = usePathname();
  const portfolioUrl = process.env.NODE_ENV === "development" ? "http://localhost:5500" : "https://don.polisti.co";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10">
      {/* Logo */}
      <Link
        href="/"
        className="font-playfair text-[17px] font-semibold text-white/90 hover:text-white transition-colors no-underline"
        style={{ textDecoration: "none" }}
      >
        don polistico
      </Link>

      {/* Nav links */}
      <ul className="flex items-center gap-6 list-none m-0 p-0">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "text-[13px] font-medium tracking-wide transition-colors no-underline",
                pathname === href || pathname.startsWith(href + "/")
                  ? "text-white"
                  : "text-white/50 hover:text-white/80"
              )}
              style={{ textDecoration: "none" }}
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <a
            href={portfolioUrl}
            className="text-[13px] font-medium tracking-wide text-white/40 hover:text-white/70 transition-colors"
            style={{ textDecoration: "none" }}
          >
            Portfolio ↗
          </a>
        </li>
      </ul>
    </nav>
  );
}

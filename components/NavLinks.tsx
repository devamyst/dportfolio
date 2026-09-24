"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/servers", label: "Servers" },
  { href: "/commissions", label: "Commissions" },
  { href: "/reviews", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-stretch overflow-x-auto border-2 border-black bg-black/60 p-0.5 text-sm">
      {LINKS.map((l, i) => {
        const active = l.href === pathname;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`relative flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 ${
              active
                ? "text-accent2 outline outline-2 -outline-offset-2 outline-white mc-slot-dark"
                : "mc-slot-dark text-neutral-300 hover:text-white"
            }`}
          >
            <span className="text-[10px] text-neutral-500">{i + 1}</span>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

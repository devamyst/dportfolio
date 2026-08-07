import Link from "next/link";
import AuthControl from "./AuthControl";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/servers", label: "Servers" },
  { href: "/reviews", label: "Reviews" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight text-white">
          Devamy
        </Link>
        <nav className="flex items-center gap-6 text-sm text-neutral-400">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-white">
              {l.label}
            </Link>
          ))}
          <a href="/#contact" className="transition hover:text-white">
            Contact
          </a>
        </nav>
        <AuthControl />
      </div>
    </header>
  );
}

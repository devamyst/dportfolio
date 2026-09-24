import Link from "next/link";
import AuthControl from "./AuthControl";
import GrassBlock from "./GrassBlock";
import NavLinks from "./NavLinks";

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-black bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-pixel text-lg text-white">
          <GrassBlock className="h-7 w-7 animate-bob" />
          Devamy
        </Link>
        <div className="hidden min-w-0 md:block">
          <NavLinks />
        </div>
        <AuthControl />
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-3 md:hidden">
        <NavLinks />
      </div>
    </header>
  );
}

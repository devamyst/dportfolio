import { Github, Mail } from "lucide-react";

export default function Footer({ email, github }: { email: string; github: string }) {
  return (
    <footer className="grass-edge mt-8 border-t-2 border-black">
      <div className="mx-auto max-w-5xl px-6 pb-8 pt-10 text-center">
        <div className="mb-4 flex justify-center gap-3">
          <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub" className="mc-btn p-2">
            <Github className="h-4 w-4" />
          </a>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Email"
            className="mc-btn p-2"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
        <p className="mc-shadow font-pixel text-xs text-neutral-200">
          © {new Date().getFullYear()} Devamy. Not an official Minecraft product.
        </p>
      </div>
    </footer>
  );
}

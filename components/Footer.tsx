import { Github, Mail } from "lucide-react";

export default function Footer({ email, github }: { email: string; github: string }) {
  return (
    <footer className="mx-auto max-w-5xl px-6 pb-10 pt-6 text-center">
      <div className="mx-auto mb-6 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="mb-4 flex justify-center gap-4 text-neutral-500">
        <a href={github} target="_blank" rel="noreferrer" className="hover:text-accent">
          <Github className="h-4 w-4" />
        </a>
        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-accent"
        >
          <Mail className="h-4 w-4" />
        </a>
      </div>
      <p className="text-xs text-neutral-600">© {new Date().getFullYear()} Devamy. All rights reserved.</p>
    </footer>
  );
}

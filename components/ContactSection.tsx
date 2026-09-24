"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Mail, MessageCircle, Send } from "lucide-react";
import Reveal from "./Reveal";
import { withProtocol } from "@/lib/url";

export default function ContactSection({
  email,
  github,
  discord,
}: {
  email: string;
  github: string;
  discord: string;
}) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const socials = [
    { icon: Github, href: github, label: "GitHub" },
    { icon: MessageCircle, href: discord, label: "Discord" },
    {
      icon: Mail,
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`,
      label: "Email",
    },
  ];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    const subject = encodeURIComponent("Portfolio contact");
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <section id="contact" className="mx-auto mb-24 max-w-2xl px-6">
      <Reveal>
        <h2 className="mb-8 text-center text-2xl font-bold text-white">Send a message</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <form onSubmit={submit} className="glass glow-border space-y-4 p-8">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            required
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
          />
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
          />
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Message"
            required
            rows={4}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="mc-btn w-full px-4 py-2.5 text-sm"
          >
            <Send className="h-4 w-4" /> Send message
          </motion.button>
        </form>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="mt-8 flex justify-center gap-5">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={withProtocol(href)}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="mc-btn p-3"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

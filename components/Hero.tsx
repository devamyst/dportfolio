"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BASE_SPLASHES = [
  "Folia-safe!",
  "Now with 0 TPS drops!",
  "Made in Java!",
  "100% bug-free*",
  "Hot-swapped, not restarted!",
  "Async all the things!",
  "Ships on time!",
  "Also a web dev!",
];

export default function Hero({
  title,
  subtitle,
  description,
  splashExtras = [],
}: {
  title: string;
  subtitle: string;
  description: string;
  splashExtras?: string[];
}) {
  const [splash, setSplash] = useState<string | null>(null);

  useEffect(() => {
    const pool = [...BASE_SPLASHES, ...splashExtras];
    setSplash(pool[Math.floor(Math.random() * pool.length)]);
  }, [splashExtras]);

  return (
    <div className="flex flex-col items-start text-left">
      <div className="relative">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          className="mc-logo font-pixel text-6xl font-bold uppercase tracking-wider sm:text-7xl"
        >
          {title}
        </motion.h1>
        {splash && (
          <span className="mc-splash pointer-events-none absolute -right-8 bottom-0 origin-center animate-splash whitespace-nowrap font-pixel text-base sm:-right-24 sm:text-lg">
            {splash}
          </span>
        )}
      </div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.1 }}
        className="mt-6 font-pixel text-lg text-accent"
      >
        {subtitle}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.2 }}
        className="mt-4 max-w-xl text-neutral-300"
      >
        {description}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.3 }}
        className="mt-8 flex flex-wrap gap-3"
      >
        <a href="/projects" className="mc-btn min-w-40 px-5 py-2.5">
          Singleplayer
        </a>
        <a href="/servers" className="mc-btn min-w-40 px-5 py-2.5">
          Multiplayer
        </a>
        <a href="/#contact" className="mc-btn px-5 py-2.5">
          Hire me
        </a>
      </motion.div>
    </div>
  );
}

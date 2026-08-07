"use client";

import { motion } from "framer-motion";

export default function Hero({
  title,
  subtitle,
  description,
}: {
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-start text-left">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
        className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.1 }}
        className="mt-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-lg font-medium text-transparent"
      >
        {subtitle}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.2 }}
        className="mt-5 max-w-xl text-neutral-400"
      >
        {description}
      </motion.p>
    </div>
  );
}

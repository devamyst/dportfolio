"use client";

import { motion } from "framer-motion";

const COLORS = ["text-accent", "text-accent2", "text-accent3", "text-enchant", "text-accent4"];

export default function SkillBadge({ label, index = 0 }: { label: string; index?: number }) {
  return (
    <motion.span
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="mc-slot-dark group relative inline-flex items-center gap-2 border-2 border-black px-4 py-2 font-pixel text-sm text-neutral-200 hover:text-white"
    >
      <span className={`h-2 w-2 ${COLORS[index % COLORS.length].replace("text-", "bg-")}`} />
      {label}
    </motion.span>
  );
}

"use client";

import { motion } from "framer-motion";

const COLORS = [
  { border: "rgba(59,130,246,0.7)", glow: "rgba(59,130,246,0.6)" },
  { border: "rgba(168,85,247,0.7)", glow: "rgba(168,85,247,0.6)" },
  { border: "rgba(34,211,238,0.7)", glow: "rgba(34,211,238,0.6)" },
  { border: "rgba(244,114,182,0.7)", glow: "rgba(244,114,182,0.6)" },
];

export default function SkillBadge({ label, index = 0 }: { label: string; index?: number }) {
  const color = COLORS[index % COLORS.length];
  return (
    <motion.span
      whileHover={{ scale: 1.08, borderColor: color.border }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      style={{ ["--glow" as string]: color.glow }}
      className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-neutral-300 hover:text-white hover:shadow-[0_0_20px_-4px_var(--glow)]"
    >
      {label}
    </motion.span>
  );
}

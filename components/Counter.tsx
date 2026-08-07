"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function parseStat(text: string): { value: number; decimals: number; suffix: string } {
  const match = text.match(/^([\d]+(?:\.[\d]+)?)(.*)$/);
  if (!match) return { value: 0, decimals: 0, suffix: text };
  const [, num, rest] = match;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return { value: parseFloat(num), decimals, suffix: rest };
}

export default function Counter({ text }: { text: string }) {
  const { value, decimals, suffix } = parseStat(text);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || value === 0) return;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {value === 0 ? suffix : display.toFixed(decimals)}
      {value !== 0 && suffix}
    </motion.span>
  );
}

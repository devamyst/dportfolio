"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    function onMove(e: MouseEvent) {
      if (!ref.current) return;
      ref.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 -z-[5] h-[400px] w-[400px] rounded-full opacity-[0.15] blur-[100px] transition-transform duration-150 ease-out"
      style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }}
    />
  );
}

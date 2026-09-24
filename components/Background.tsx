"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; size: number; phase: number };

const CLOUDS = [
  { top: "9%", delay: "0s", scale: 1 },
  { top: "22%", delay: "-50s", scale: 0.7 },
  { top: "14%", delay: "-95s", scale: 1.3 },
];

const HILLS = [3, 4, 4, 5, 6, 6, 5, 4, 4, 3, 3, 4, 5, 7, 8, 8, 7, 6, 5, 5, 4, 3, 3, 4, 4, 5, 6, 5, 4, 3, 3, 3];

function Cloud({ top, delay, scale }: { top: string; delay: string; scale: number }) {
  return (
    <div
      className="absolute left-0 animate-drift opacity-[0.07]"
      style={{ top, animationDelay: delay }}
    >
      <div style={{ transform: `scale(${scale})` }} className="relative h-12 w-64">
        <div className="absolute bottom-0 left-0 h-6 w-64 bg-white" />
        <div className="absolute bottom-6 left-10 h-6 w-36 bg-white" />
        <div className="absolute bottom-6 left-28 h-10 w-16 bg-white" />
      </div>
    </div>
  );
}

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];

    function seed() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
      const count = Math.min(110, Math.floor((width * height) / 14000));
      stars = Array.from({ length: count }, () => ({
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height * 0.75),
        size: Math.random() < 0.15 ? 3 : 2,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    let raf = 0;
    let last = 0;
    function draw(now: number) {
      if (now - last > 120) {
        last = now;
        ctx!.clearRect(0, 0, width, height);
        for (const s of stars) {
          const a = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(now * 0.0012 + s.phase));
          ctx!.fillStyle = `rgba(255, 255, 255, ${a})`;
          ctx!.fillRect(s.x, s.y, s.size, s.size);
        }
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    }

    seed();
    raf = requestAnimationFrame(draw);

    function onResize() {
      seed();
      last = 0;
      if (reduced) requestAnimationFrame(draw);
    }
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-night via-night2 to-night3" />
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute right-[12%] top-[8%] h-16 w-16 bg-moon opacity-80 shadow-[0_0_60px_12px_rgba(232,236,216,0.12)]">
        <div className="absolute left-3 top-3 h-4 w-4 bg-moonShade" />
        <div className="absolute bottom-4 right-3 h-3 w-5 bg-moonShade" />
        <div className="absolute bottom-2 left-5 h-2 w-2 bg-moonShade" />
      </div>
      {CLOUDS.map((c) => (
        <Cloud key={c.top} {...c} />
      ))}
      <div className="absolute inset-x-0 bottom-0 flex items-end opacity-60">
        {HILLS.map((h, i) => (
          <div key={i} className="flex-1 bg-hill" style={{ height: h * 14 }}>
            <div className="h-2 w-full bg-hillTop" />
          </div>
        ))}
      </div>
    </div>
  );
}

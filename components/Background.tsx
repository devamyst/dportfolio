"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; speed: number; opacity: number };

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const STAR_COUNT = Math.min(140, Math.floor((width * height) / 12000));
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.15 + 0.03,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    let frame = 0;
    let raf = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        s.y += s.speed;
        if (s.y > height) s.y = 0;
        const twinkle = 0.5 + 0.5 * Math.sin(frame * 0.01 + s.x);
        ctx.beginPath();
        ctx.fillStyle = `rgba(150, 190, 255, ${s.opacity * twinkle})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame++;
      raf = requestAnimationFrame(draw);
    }

    draw();
    if (reduced) cancelAnimationFrame(raf);

    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }
    window.addEventListener("resize", onResize);

    function onMouseMove(e: MouseEvent) {
      if (!orbsRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      orbsRef.current.style.transform = `translate(${x * 18}px, ${y * 18}px)`;
    }
    if (!reduced) window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-bg">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "linear-gradient(120deg, #090909, #0d1526, #090909, #0a1020)",
          backgroundSize: "300% 300%",
        }}
      />
      <div className="absolute inset-0 animate-gradientShift opacity-40 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-cyan-800/10" />
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div ref={orbsRef} className="absolute inset-0 transition-transform duration-300 ease-out">
        <div className="absolute left-[8%] top-[12%] h-72 w-72 animate-float rounded-full bg-blue-500/20 blur-[90px]" />
        <div className="absolute right-[10%] top-[30%] h-96 w-96 animate-pulseGlow rounded-full bg-purple-500/15 blur-[110px]" />
        <div className="absolute bottom-[15%] left-[20%] h-80 w-80 animate-float rounded-full bg-cyan-400/15 blur-[100px]" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-[5%] right-[25%] h-64 w-64 animate-pulseGlow rounded-full bg-pink-500/10 blur-[80px]" style={{ animationDelay: "3s" }} />
      </div>
    </div>
  );
}

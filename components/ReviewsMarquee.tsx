"use client";

import { useEffect, useRef, useState } from "react";
import type { Review } from "@/lib/db";

export default function ReviewsMarquee({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [boxed, setBoxed] = useState(false);
  const [boxWidth, setBoxWidth] = useState<number | null>(null);

  useEffect(() => {
    function measure() {
      if (!trackRef.current) return;
      const pageWidth = window.innerWidth;
      const singleSetWidth = trackRef.current.scrollWidth / 2;
      if (singleSetWidth < pageWidth * 0.9) {
        setBoxed(true);
        setBoxWidth(Math.min(singleSetWidth, pageWidth * 0.9));
      } else {
        setBoxed(false);
        setBoxWidth(null);
      }
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reviews]);

  if (reviews.length === 0) return null;
  const loop = [...reviews, ...reviews];

  return (
    <div
      className={`group relative mx-auto mb-16 overflow-hidden ${
        boxed ? "glass glow-border" : "w-full"
      }`}
      style={boxed && boxWidth ? { width: boxWidth } : undefined}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent" />
      <div
        ref={trackRef}
        className="flex w-max animate-marquee gap-4 py-5 group-hover:[animation-play-state:paused]"
      >
        {loop.map((r, i) => (
          <div
            key={`${r.id}-${i}`}
            className="mc-tooltip flex w-72 shrink-0 flex-col p-5"
          >
            <span className="font-pixel text-sm text-accent2">★★★★★</span>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-300">{r.text}</p>
            {r.author && <span className="mt-3 font-pixel text-xs text-enchant">{r.author}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Settings } from "@/lib/settings";
import type { Experience } from "@/lib/db";
import Reveal from "./Reveal";

function buildScript(settings: Settings, experiences: Experience[]) {
  const projects = experiences.filter((e) => e.type === "plugin").map((e) => e.title);
  const servers = experiences.filter((e) => e.type === "server").map((e) => e.title);
  const skills = settings.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" · ");

  const script: { cmd: string; output: string[] }[] = [
    { cmd: "/whoami", output: [`${settings.hero_title} — ${settings.hero_subtitle}`] },
    { cmd: "/skills", output: [skills || "no skills listed yet"] },
  ];
  if (projects.length > 0) {
    script.push({ cmd: "/plugins list", output: [projects.join(", ")] });
  }
  if (servers.length > 0) {
    script.push({ cmd: "/servers list", output: [servers.join(", ")] });
  }
  script.push({
    cmd: "/plm reload portfolio",
    output: ["Unloading portfolio... done", "Loading portfolio... done", `Enabled · ${settings.stat_downloads} downloads · ${settings.stat_years} years experience`],
  });
  return script;
}

const TYPE_MS = 32;
const LINE_PAUSE_MS = 500;
const CMD_PAUSE_MS = 900;
const RESTART_PAUSE_MS = 1600;

type Line = { kind: "cmd" | "output"; text: string };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function TerminalDemo({
  settings,
  experiences,
}: {
  settings: Settings;
  experiences: Experience[];
}) {
  const script = useMemo(() => buildScript(settings, experiences), [settings, experiences]);
  const [lines, setLines] = useState<Line[]>([]);
  const [caret, setCaret] = useState(true);
  const aliveRef = useRef(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    aliveRef.current = true;
    const blink = setInterval(() => setCaret((c) => !c), 500);

    async function run() {
      while (aliveRef.current) {
        setLines([]);
        for (const step of script) {
          if (!aliveRef.current) return;
          let typed = "";
          setLines((prev) => [...prev, { kind: "cmd", text: "" }]);
          for (const ch of step.cmd) {
            if (!aliveRef.current) return;
            typed += ch;
            setLines((prev) => {
              const next = [...prev];
              next[next.length - 1] = { kind: "cmd", text: typed };
              return next;
            });
            await sleep(TYPE_MS);
          }
          await sleep(CMD_PAUSE_MS);
          for (const out of step.output) {
            if (!aliveRef.current) return;
            setLines((prev) => [...prev, { kind: "output", text: out }]);
            await sleep(LINE_PAUSE_MS);
          }
          await sleep(CMD_PAUSE_MS);
        }
        await sleep(RESTART_PAUSE_MS);
      }
    }
    run();

    return () => {
      aliveRef.current = false;
      clearInterval(blink);
    };
  }, [script]);

  return (
    <Reveal className="w-full">
      <div className="glass glow-border overflow-hidden">
        <div className="flex items-center justify-between border-b-2 border-black bg-surface2 px-4 py-2">
          <span className="font-pixel text-xs text-neutral-300">Server Console</span>
          <span className="flex items-center gap-1.5 font-pixel text-xs text-accent">
            <span className="h-2 w-2 bg-accent" /> 20.0 TPS
          </span>
        </div>
        <div ref={scrollRef} className="h-[280px] overflow-y-auto bg-black/60 p-4 font-mono text-xl leading-snug">
          {lines.map((line, i) =>
            line.kind === "cmd" ? (
              <div key={i} className="mc-shadow flex text-white">
                <span className="mr-2 shrink-0 text-accent2">&gt;</span>
                <span>
                  {line.text}
                  {i === lines.length - 1 && <span className={caret ? "opacity-100" : "opacity-0"}>_</span>}
                </span>
              </div>
            ) : (
              <div key={i} className="mc-shadow pl-5 text-accent3">
                {line.text}
              </div>
            )
          )}
        </div>
      </div>
    </Reveal>
  );
}

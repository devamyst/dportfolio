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
    { cmd: "whoami", output: [`${settings.hero_title} — ${settings.hero_subtitle}`] },
    { cmd: "cat skills.txt", output: [skills || "no skills listed yet"] },
  ];
  if (projects.length > 0) {
    script.push({ cmd: "ls projects/", output: [projects.join(", ")] });
  }
  if (servers.length > 0) {
    script.push({ cmd: "ls servers/", output: [servers.join(", ")] });
  }
  script.push({
    cmd: "./deploy.sh --prod",
    output: ["Building...     done", "Deploying...    done", `Live · ${settings.stat_downloads} downloads · ${settings.stat_years} years experience`],
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
      <div className="glass glow-border overflow-hidden rounded-2xl">
        <div className="flex items-center gap-2 border-b border-border/60 bg-surface2/80 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-xs text-neutral-500">devamy@portfolio: ~</span>
        </div>
        <div ref={scrollRef} className="h-[260px] overflow-y-auto p-5 font-mono text-sm leading-relaxed">
          {lines.map((line, i) =>
            line.kind === "cmd" ? (
              <div key={i} className="flex text-neutral-200">
                <span className="mr-2 shrink-0 text-accent">➜</span>
                <span className="mr-2 shrink-0 text-accent3">~</span>
                <span>
                  {line.text}
                  {i === lines.length - 1 && (
                    <span className={caret ? "opacity-100" : "opacity-0"}>▌</span>
                  )}
                </span>
              </div>
            ) : (
              <div key={i} className="pl-6 text-neutral-500">
                {line.text}
              </div>
            )
          )}
        </div>
      </div>
    </Reveal>
  );
}

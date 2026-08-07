import type { Experience } from "@/lib/db";
import { withProtocol } from "@/lib/url";
import Reveal from "./Reveal";
import DateRangeBar from "./DateRangeBar";
import EntryLogo from "./EntryLogo";

export default function Timeline({ experiences }: { experiences: Experience[] }) {
  const servers = experiences.filter((e) => e.type === "server");
  if (servers.length === 0) return null;

  return (
    <section className="mx-auto mb-24 max-w-3xl px-6">
      <Reveal>
        <h2 className="mb-10 text-center text-2xl font-bold text-white">Timeline</h2>
      </Reveal>
      <div className="relative border-l border-border pl-8">
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent shadow-[0_0_12px_1px_rgba(59,130,246,0.5)]" />
        {servers.map((exp, i) => (
          <Reveal key={exp.id} delay={i * 0.08} className="relative mb-10 last:mb-0">
            <span className="absolute -left-[38px] top-1 h-3 w-3 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(59,130,246,0.7)]" />
            <div className="flex items-start gap-4">
              <EntryLogo title={exp.title} url={exp.image_url} size="h-12 w-12" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {!exp.start_date && (
                    <time className="text-xs uppercase tracking-wide text-blue-400">
                      {new Date(exp.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                      })}
                    </time>
                  )}
                  {exp.role && (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      {exp.role}
                    </span>
                  )}
                </div>
                <h3 className="mt-1 text-lg font-semibold text-white">{exp.title}</h3>
                <DateRangeBar start={exp.start_date} end={exp.end_date} status={exp.status} />
                {exp.description && (
                  <p className="mt-1 text-sm text-neutral-400">{exp.description}</p>
                )}
                {exp.tags && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {exp.tags.split(",").filter(Boolean).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border px-2 py-0.5 text-xs text-neutral-400"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                {(exp.server_ip || exp.discord_url) && (
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {exp.server_ip && (
                      <p className="font-mono text-xs text-neutral-500">{exp.server_ip}</p>
                    )}
                    {exp.discord_url && (
                      <a
                        href={withProtocol(exp.discord_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-accent hover:underline"
                      >
                        Discord
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

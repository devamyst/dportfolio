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
      <div className="relative border-l-4 border-black pl-8">
        <div className="absolute -left-1 top-0 h-full w-1 bg-gradient-to-b from-accent via-accentDark to-transparent" />
        {servers.map((exp, i) => (
          <Reveal key={exp.id} delay={i * 0.08} className="relative mb-10 last:mb-0">
            <span className="absolute -left-[42px] top-1 h-4 w-4 border-2 border-black bg-accent" />
            <div className="flex items-start gap-4">
              <EntryLogo title={exp.title} url={exp.image_url} size="h-12 w-12" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {!exp.start_date && (
                    <time className="text-xs uppercase tracking-wide text-accent3">
                      {new Date(exp.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                      })}
                    </time>
                  )}
                  {exp.role && (
                    <span className="border border-accent/40 bg-accent/10 px-2 py-0.5 font-pixel text-xs text-accent">
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
                      <p className="font-mono text-base text-neutral-400">{exp.server_ip}</p>
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

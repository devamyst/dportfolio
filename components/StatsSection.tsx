import TiltCard from "./TiltCard";
import Reveal from "./Reveal";
import Counter from "./Counter";

const COLORS = ["text-accent", "text-accent2", "text-accent3", "text-enchant"];

export default function StatsSection({
  projectsCount,
  serversCount,
  downloads,
  years,
}: {
  projectsCount: number;
  serversCount: number;
  downloads: string;
  years: string;
}) {
  const stats = [
    { label: "Projects", text: `${projectsCount}+` },
    { label: "Servers", text: `${serversCount}+` },
    { label: "Downloads", text: downloads },
    { label: "Years Experience", text: years },
  ];

  return (
    <section className="mx-auto mb-24 max-w-5xl px-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <TiltCard
              max={5}
              className="glass glow-border p-6 text-center"
            >
              <div
                className={`mc-shadow font-pixel text-4xl ${COLORS[i % COLORS.length]}`}
              >
                <Counter text={stat.text} />
              </div>
              <div className="mt-2 font-pixel text-xs uppercase tracking-wider text-neutral-400">{stat.label}</div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

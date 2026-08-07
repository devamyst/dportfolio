import TiltCard from "./TiltCard";
import Reveal from "./Reveal";
import Counter from "./Counter";

const GRADIENTS = [
  "from-blue-400 to-blue-600",
  "from-purple-400 to-purple-600",
  "from-cyan-300 to-cyan-500",
  "from-pink-400 to-pink-600",
];

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
              className="glass rounded-2xl p-6 text-center transition-shadow hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.4)]"
            >
              <div
                className={`bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} bg-clip-text text-3xl font-bold text-transparent`}
              >
                <Counter text={stat.text} />
              </div>
              <div className="mt-2 text-xs text-neutral-400">{stat.label}</div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

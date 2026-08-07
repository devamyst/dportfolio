import Reveal from "./Reveal";
import SkillBadge from "./SkillBadge";

export default function SkillsSection({ skills }: { skills: string }) {
  const list = skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <section className="mx-auto mb-24 max-w-5xl px-6">
      <Reveal>
        <h2 className="mb-8 text-center text-2xl font-bold text-white">Skills</h2>
      </Reveal>
      <div className="flex flex-wrap justify-center gap-3">
        {list.map((skill, i) => (
          <Reveal key={skill} delay={i * 0.03}>
            <SkillBadge label={skill} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

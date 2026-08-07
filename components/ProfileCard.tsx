import TiltCard from "./TiltCard";
import Reveal from "./Reveal";

const STATUS_COLOR: Record<string, string> = {
  online: "bg-green-400",
  idle: "bg-yellow-400",
  dnd: "bg-red-500",
  offline: "bg-neutral-500",
};

export default function ProfileCard({
  bio1,
  bio2,
  avatarUrl,
  status,
}: {
  bio1: string;
  bio2: string;
  avatarUrl: string | null;
  status: string | null;
}) {
  return (
    <Reveal className="mx-auto mb-24 max-w-3xl px-6" delay={0.3}>
      <TiltCard className="glass glow-border rounded-3xl p-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                className="h-20 w-20 rounded-2xl border border-border object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-bold text-white">
                D
              </div>
            )}
            <span
              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-surface ${
                status ? STATUS_COLOR[status] : "bg-green-400"
              }`}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Devamy</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">{bio1}</p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">{bio2}</p>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

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
      <TiltCard className="glass glow-border p-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                className="h-20 w-20 border-2 border-black object-cover"
              />
            ) : (
              <div className="mc-slot-dark flex h-20 w-20 items-center justify-center font-pixel text-2xl text-accent">
                D
              </div>
            )}
            <span
              className={`absolute -bottom-1 -right-1 h-4 w-4 border-2 border-black ${
                status ? STATUS_COLOR[status] : "bg-green-400"
              }`}
            />
          </div>
          <div>
            <h2 className="font-pixel text-xl text-white">
              Devamy <span className="text-sm text-accent2">Lvl {new Date().getFullYear() - 2019}</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">{bio1}</p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">{bio2}</p>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

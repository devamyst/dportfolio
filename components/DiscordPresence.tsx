"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { activityImageUrl, avatarUrl, bannerUrl, type LanyardActivity, type LanyardData } from "@/lib/lanyard";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

const STATUS_COLOR: Record<string, string> = {
  online: "bg-green-400",
  idle: "bg-yellow-400",
  dnd: "bg-red-500",
  offline: "bg-neutral-500",
};

const STATUS_LABEL: Record<string, string> = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline",
};

function elapsed(startMs: number, now: number): string {
  const s = Math.max(0, Math.floor((now - startMs) / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function DiscordPresence({
  data,
  loading,
}: {
  data: LanyardData | null;
  loading: boolean;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (loading || !data) {
    return (
      <section className="mx-auto mb-24 max-w-3xl px-6">
        <Reveal>
          <div className="glass glow-border animate-pulse rounded-3xl p-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-surface2" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-surface2" />
                <div className="h-3 w-24 rounded bg-surface2" />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    );
  }

  const customStatus = data.activities.find((a) => a.type === 4);
  const otherActivities = data.activities.filter((a) => a.type !== 4);
  const banner = bannerUrl(data);
  const displayName = data.discord_user.global_name || data.discord_user.display_name || data.discord_user.username;
  const status = data.discord_status;

  return (
    <section className="mx-auto mb-24 max-w-3xl px-6">
      <Reveal>
        <h2 className="mb-8 text-center text-2xl font-bold text-white">Discord</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <TiltCard max={4} className="glass glow-border overflow-hidden rounded-3xl">
          {banner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={banner} alt="" className="h-28 w-full object-cover" />
          )}
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl(data)}
                  alt=""
                  className="h-16 w-16 rounded-full border-2 border-surface"
                />
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-surface ${STATUS_COLOR[status]}`}
                  title={STATUS_LABEL[status]}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-semibold text-white">{displayName}</h3>
                <p className="text-sm text-neutral-500">@{data.discord_user.username}</p>
                <AnimatePresence mode="wait">
                  {customStatus?.state && (
                    <motion.p
                      key={customStatus.state}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-1 truncate text-sm text-neutral-400"
                    >
                      {customStatus.state}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {data.listening_to_spotify && data.spotify && (
              <SpotifyCard spotify={data.spotify} now={now} />
            )}

            <AnimatePresence>
              {otherActivities
                .filter((a) => a.type !== 2)
                .map((activity) => (
                  <ActivityRow key={activity.id} activity={activity} now={now} />
                ))}
            </AnimatePresence>
          </div>
        </TiltCard>
      </Reveal>
    </section>
  );
}

function SpotifyCard({
  spotify,
  now,
}: {
  spotify: NonNullable<import("@/lib/lanyard").LanyardData["spotify"]>;
  now: number;
}) {
  const { timestamps, album_art_url, artist, song } = spotify;
  const total = timestamps.end - timestamps.start;
  const progress = Math.min(1, Math.max(0, (now - timestamps.start) / total));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-bg/60 p-3"
    >
      <motion.img
        src={album_art_url}
        alt=""
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="h-12 w-12 shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{song}</p>
        <p className="truncate text-xs text-neutral-400">{artist}</p>
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-surface2">
          <motion.div
            className="h-full rounded-full bg-accent"
            animate={{ width: `${progress * 100}%` }}
            transition={{ ease: "linear", duration: 1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function ActivityRow({ activity, now }: { activity: LanyardActivity; now: number }) {
  const large = activityImageUrl(activity, "large_image");
  const small = activityImageUrl(activity, "small_image");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-bg/60 p-3"
    >
      <div className="relative shrink-0">
        {large ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={large} alt="" className="h-12 w-12 rounded-lg object-cover" />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-surface2" />
        )}
        {small && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={small}
            alt=""
            className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-surface"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{activity.name}</p>
        {activity.details && <p className="truncate text-xs text-neutral-400">{activity.details}</p>}
        {activity.state && <p className="truncate text-xs text-neutral-500">{activity.state}</p>}
        {activity.timestamps?.start && (
          <p className="mt-0.5 text-xs text-accent">{elapsed(activity.timestamps.start, now)} elapsed</p>
        )}
      </div>
    </motion.div>
  );
}

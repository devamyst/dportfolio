"use client";

import { useState } from "react";
import Link from "next/link";
import { Blocks, Server } from "lucide-react";
import type { Settings } from "@/lib/settings";
import type { Experience, Review } from "@/lib/db";
import EditSitePanel from "./EditSitePanel";
import Hero from "./Hero";
import ReviewsMarquee from "./ReviewsMarquee";
import TerminalDemo from "./TerminalDemo";
import ProfileCard from "./ProfileCard";
import StatsSection from "./StatsSection";
import SkillsSection from "./SkillsSection";
import DiscordPresence from "./DiscordPresence";
import ContactSection from "./ContactSection";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { useLanyard } from "./useLanyard";
import { avatarUrl as lanyardAvatarUrl } from "@/lib/lanyard";

export default function HomeContent({
  initialSettings,
  experiences,
  reviews,
}: {
  initialSettings: Settings;
  experiences: Experience[];
  reviews: Review[];
}) {
  const [settings, setSettings] = useState(initialSettings);
  const projectsCount = experiences.filter((e) => e.type === "plugin").length;
  const serversCount = experiences.filter((e) => e.type === "server").length;
  const { data: lanyard, loading: lanyardLoading } = useLanyard();

  return (
    <>
      <EditSitePanel settings={settings} onUpdate={setSettings} />
      <section className="mx-auto mb-16 grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-20 pb-4 lg:grid-cols-2">
        <Hero
          title={settings.hero_title}
          subtitle={settings.hero_subtitle}
          description={settings.hero_description}
        />
        <TerminalDemo settings={settings} experiences={experiences} />
      </section>
      <ReviewsMarquee reviews={reviews} />
      <ProfileCard
        bio1={settings.profile_bio_1}
        bio2={settings.profile_bio_2}
        avatarUrl={lanyard ? lanyardAvatarUrl(lanyard) : null}
        status={lanyard?.discord_status ?? null}
      />
      <StatsSection
        projectsCount={projectsCount}
        serversCount={serversCount}
        downloads={settings.stat_downloads}
        years={settings.stat_years}
      />

      <section className="mx-auto mb-24 grid max-w-5xl grid-cols-1 gap-6 px-6 sm:grid-cols-2">
        <Reveal>
          <Link href="/projects">
            <TiltCard className="glass glow-border flex items-center gap-4 rounded-2xl p-8">
              <Blocks className="h-8 w-8 text-accent" />
              <div>
                <h3 className="text-lg font-semibold text-white">Projects</h3>
                <p className="mt-1 text-sm text-neutral-400">Plugins, proxies, and other things I&apos;ve built</p>
              </div>
            </TiltCard>
          </Link>
        </Reveal>
        <Reveal delay={0.08}>
          <Link href="/servers">
            <TiltCard className="glass glow-border flex items-center gap-4 rounded-2xl p-8">
              <Server className="h-8 w-8 text-accent2" />
              <div>
                <h3 className="text-lg font-semibold text-white">Servers</h3>
                <p className="mt-1 text-sm text-neutral-400">Servers I&apos;ve worked at</p>
              </div>
            </TiltCard>
          </Link>
        </Reveal>
      </section>

      <SkillsSection skills={settings.skills} />
      <DiscordPresence data={lanyard} loading={lanyardLoading} />
      <ContactSection
        email={settings.social_email}
        github={settings.social_github}
        discord={settings.social_discord}
      />
    </>
  );
}

import { getSettings } from "@/lib/settings";
import { listExperiences, listReviews } from "@/lib/db";
import HomeContent from "@/components/HomeContent";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, experiences, reviews] = await Promise.all([
    getSettings(),
    listExperiences(),
    listReviews(),
  ]);
  return <HomeContent initialSettings={settings} experiences={experiences} reviews={reviews} />;
}

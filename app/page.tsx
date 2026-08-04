import { listExperiences } from "@/lib/db";
import ExperienceBoard from "@/components/ExperienceBoard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const experiences = await listExperiences();
  return <ExperienceBoard initialExperiences={experiences} />;
}

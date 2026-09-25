import { listExperiences } from "@/lib/db";
import ProjectsSection from "@/components/ProjectsSection";
import Timeline from "@/components/Timeline";

export const revalidate = 3600;

export default async function ServersPage() {
  const experiences = await listExperiences();
  return (
    <div className="pt-16">
      <ProjectsSection initialExperiences={experiences} filterType="server" heading="Servers" />
      <Timeline experiences={experiences} />
    </div>
  );
}

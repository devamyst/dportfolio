import { listExperiences } from "@/lib/db";
import ProjectsSection from "@/components/ProjectsSection";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const experiences = await listExperiences();
  return (
    <div className="pt-16">
      <ProjectsSection initialExperiences={experiences} filterType="plugin" heading="Projects" />
    </div>
  );
}

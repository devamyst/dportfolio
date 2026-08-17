import { listExperiences } from "@/lib/db";
import ProjectsSection from "@/components/ProjectsSection";

export const dynamic = "force-dynamic";

export default async function CommissionsPage() {
  const experiences = await listExperiences();
  return (
    <div className="pt-16">
      <ProjectsSection initialExperiences={experiences} filterType="commission" heading="Commissions" />
    </div>
  );
}

import { InfractionGrid } from "@/components/infractions/infraction-grid";
import { fetchInfractions } from "@/lib/infractions";

export default async function AgentDashboard() {
  const infractions = await fetchInfractions();

  return (
    <div className="min-h-screen bg-background text-white px-4 py-10 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <InfractionGrid
          infractions={infractions}
          title="Espace agent"
          subtitle="Référentiel des infractions"
        />
      </div>
    </div>
  );
}


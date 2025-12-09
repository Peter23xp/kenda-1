import { InfractionGrid } from "@/components/infractions/infraction-grid";
import { fetchInfractions } from "@/lib/infractions";
import Link from 'next/link';
import { AgentProfileMenu } from "@/components/agents/AgentProfileMenu";

export default async function AgentDashboard() {
  const infractions = await fetchInfractions();

  return (
    <div className="min-h-screen bg-background text-white px-4 py-10 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Espace Agent</h1>
            <AgentProfileMenu />
          </div>

          {/* Autres contenus de l'espace agent */}
          <InfractionGrid
            infractions={infractions}
            title="Espace agent"
            subtitle="Référentiel des infractions"
          />
        </div>
      </div>
    </div>
  );
}

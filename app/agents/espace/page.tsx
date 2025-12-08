import { InfractionGrid } from "@/components/infractions/infraction-grid";
import { fetchInfractions } from "@/lib/infractions";
import Link from 'next/link';

export default async function AgentDashboard() {
  const infractions = await fetchInfractions();

  return (
    <div className="min-h-screen bg-background text-white px-4 py-10 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Espace Agent</h1>
          {/* Bouton Create pour accéder au formulaire de contravention */}
          <Link
            href="/agents/add"
            className="inline-block mb-6 rounded bg-[#F0B90B] px-4 py-2 font-semibold text-black hover:bg-yellow-500"
          >
            Créer une contravention
          </Link>

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

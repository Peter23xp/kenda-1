import { InfractionGrid } from "@/components/infractions/infraction-grid";
import { fetchInfractions } from "@/lib/infractions";

export default async function UsagerDashboard() {
  const infractions = await fetchInfractions();

  return (
    <div className="min-h-screen bg-background text-white px-4 py-10 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <InfractionGrid
          infractions={infractions}
          title="Espace usager"
          subtitle="Consultez les infractions officielles"
        />
      </div>
    </div>
  );
}


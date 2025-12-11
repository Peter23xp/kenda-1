import { InfractionGrid } from "@/components/infractions/infraction-grid";
import { fetchInfractions } from "@/lib/infractions";
import { UsagerProfileMenu } from "@/components/usagers/UsagerProfileMenu";

export default async function UsagerDashboard() {
  const infractions = await fetchInfractions();

  return (
    <div className="min-h-screen bg-background text-white px-4 py-10 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Espace Usager</h1>
            <UsagerProfileMenu />
          </div>
          <InfractionGrid
            infractions={infractions}
            title="Espace usager"
            subtitle="Consultez les infractions officielles"
          />
        </div>
      </div>
    </div>
  );
}


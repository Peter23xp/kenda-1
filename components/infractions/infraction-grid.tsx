import type { Infraction } from "@/lib/infractions";

interface InfractionGridProps {
  infractions: Infraction[];
  title: string;
  subtitle: string;
}

export function InfractionGrid({
  infractions,
  title,
  subtitle,
}: InfractionGridProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-[#F0B90B]">
          {title}
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-semibold mt-3">
          {subtitle}
        </h1>
        <p className="text-gray-300 mt-3">
          Aperçu des infractions et montants utilisés uniquement pour les tests
          du MVP. Ces tarifs ne sont pas officiels et servent à simuler les flux
          de paiement ADA.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {infractions.map((infraction) => (
          <article
            key={infraction.id}
            className="rounded-2xl border border-[#1f1f1f] bg-[#0A0A0A] p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                #{String(infraction.id).padStart(2, "0")}
              </p>
              <span className="rounded-full bg-[#F0B90B]/10 text-[#F0B90B] text-xs font-semibold px-3 py-1">
                {infraction.tarif_usd} USD
              </span>
            </div>
            <h2 className="text-lg font-semibold text-white">
              {infraction.nom}
            </h2>
            <p className="text-sm text-gray-400">{infraction.description}</p>
            <p className="text-xs text-gray-500">
              Véhicules concernés : {infraction.vehicule}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}


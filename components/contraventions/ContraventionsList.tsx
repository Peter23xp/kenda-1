import { ContraventionCard } from "./ContraventionCard";

interface Contravention {
    id: string;
    agentId: string;
    usagerId: string;
    txHash: string;
    paymentTxHash?: string; // Nouveau champ optionnel
    createdAt: string;
    statut: "active" | "payed";
}

interface ContraventionsListProps {
    contraventions: Contravention[];
}

export function ContraventionsList({ contraventions }: ContraventionsListProps) {
    if (contraventions.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-400 text-lg">Aucune contravention trouvée</p>
                <p className="text-gray-500 text-sm mt-2">
                    Vous n'avez pas encore de contraventions enregistrées.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contraventions.map((contravention) => (
                <ContraventionCard
                    key={contravention.id}
                    id={contravention.id}
                    agentId={contravention.agentId}
                    usagerId={contravention.usagerId}
                    txHash={contravention.txHash}
                    paymentTxHash={contravention.paymentTxHash} // Passage de la prop
                    createdAt={contravention.createdAt}
                    statut={contravention.statut}
                />
            ))}
        </div>
    );
}

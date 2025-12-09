"use client";

import { ContraventionsList } from "@/components/contraventions/ContraventionsList";
import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";

interface Contravention {
    id: string;
    agentId: string;
    usagerId: string;
    txHash: string;
    createdAt: string;
    statut: "active" | "payed";
}

export default function MesContraventionsPage() {
    const [contraventions, setContraventions] = useState<Contravention[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchContraventions() {
            try {
                // Récupérer l'utilisateur connecté
                const { data: { user } } = await supabaseBrowserClient.auth.getUser();

                if (!user) {
                    setError("Vous devez être connecté pour voir vos contraventions");
                    setIsLoading(false);
                    return;
                }

                // Appeler l'API (l'utilisateur sera identifié via les cookies de session)
                const response = await fetch('/api/usagers/contraventions');

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
                    console.error("Erreur API:", response.status, errorData);
                    throw new Error(errorData.error || `Erreur ${response.status}`);
                }

                const data = await response.json();
                setContraventions(data.contraventions);
            } catch (err) {
                console.error("Erreur:", err);
                setError(err instanceof Error ? err.message : "Une erreur est survenue");
            } finally {
                setIsLoading(false);
            }
        }

        fetchContraventions();
    }, []);

    return (
        <div className="min-h-screen bg-background text-white px-4 py-10 sm:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <p className="text-sm uppercase tracking-[0.25em] text-[#F0B90B]">
                        Historique
                    </p>
                    <h1 className="font-heading text-3xl md:text-4xl font-semibold mt-3">
                        Mes Contraventions
                    </h1>
                    <p className="text-gray-300 mt-3">
                        Consultez l'historique de vos contraventions et leur statut de paiement.
                    </p>
                </div>

                {isLoading && (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F0B90B]"></div>
                        <p className="text-gray-400 mt-4">Chargement de vos contraventions...</p>
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {!isLoading && !error && (
                    <ContraventionsList contraventions={contraventions} />
                )}
            </div>
        </div>
    );
}

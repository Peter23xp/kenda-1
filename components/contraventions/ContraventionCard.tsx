"use client";

import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { MetadataModal } from "./MetadataModal";

interface ContraventionCardProps {
    id: string;
    agentId: string;
    usagerId: string;
    txHash: string;
    paymentTxHash?: string; // Nouveau champ
    createdAt: string;
    statut: "active" | "payed";
}

export function ContraventionCard({
    id,
    agentId,
    usagerId,
    txHash,
    paymentTxHash,
    createdAt,
    statut,
}: ContraventionCardProps) {
    const [copied, setCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [metadata, setMetadata] = useState<{
        agent: string;
        usager: string;
        plaque: string;
        montant: string;
        description: string;
    } | null>(null);
    const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(txHash);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Erreur lors de la copie:", error);
        }
    };

    const fetchMetadata = async () => {
        setIsLoadingMetadata(true);
        setIsModalOpen(true);

        try {
            const BLOCKFROST_API_KEY = "preprod6eb6sa6Y14nBKQqffIGOCkDCRACxRRHd";
            const response = await fetch(
                `https://cardano-preprod.blockfrost.io/api/v0/txs/${txHash}/metadata`,
                {
                    headers: {
                        project_id: BLOCKFROST_API_KEY,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Impossible de récupérer les métadonnées");
            }

            const data = await response.json();

            // Rechercher le label 674 (CIP-20)
            const metadata674 = data.find((item: any) => item.label === "674");

            if (metadata674 && metadata674.json_metadata?.msg) {
                const msg = metadata674.json_metadata.msg;

                // Parser les messages
                const agent = msg.find((m: string) => m.startsWith("Agent:"))?.replace("Agent: ", "") || "N/A";
                const plaque = msg.find((m: string) => m.startsWith("Plaque:"))?.replace("Plaque: ", "") || "N/A";
                const usager = msg.find((m: string) => m.startsWith("Usager:"))?.replace("Usager: ", "") || "N/A";
                const description = msg.find((m: string) => m.startsWith("Description:"))?.replace("Description: ", "") || "N/A";
                const montant = msg.find((m: string) => m.startsWith("Montant:"))?.replace("Montant: ", "") || "N/A";

                setMetadata({ agent, usager, plaque, description, montant });
            } else {
                setMetadata(null);
            }
        } catch (error) {
            console.error("Erreur:", error);
            setMetadata(null);
        } finally {
            setIsLoadingMetadata(false);
        }
    };

    const truncateHash = (hash: string) => {
        if (hash.length <= 16) return hash;
        return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
    };

    const statutConfig = {
        active: {
            label: "Active",
            bgColor: "bg-orange-500/10",
            textColor: "text-orange-400",
            borderColor: "border-orange-500/30",
        },
        payed: {
            label: "Payée",
            bgColor: "bg-green-500/10",
            textColor: "text-green-400",
            borderColor: "border-green-500/30",
        },
    };

    const config = statutConfig[statut];

    return (
        <>
            <div className="bg-[#0C0C0C] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#2a2a2a] transition-all duration-200 group">
                {/* Header avec statut et bouton détails */}
                <div className="flex items-center justify-between mb-4">
                    <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
                    >
                        {config.label}
                    </span>
                    <button
                        onClick={fetchMetadata}
                        className="text-sm text-gray-400 hover:text-[#F0B90B] transition-colors flex items-center gap-1"
                    >
                        Détails
                        <ExternalLink size={14} />
                    </button>
                </div>

                {/* Informations principales */}
                <div className="space-y-3">
                    {/* Agent */}
                    <div className="flex items-start gap-2">
                        <span className="text-gray-500 text-sm min-w-[70px]">👮 Agent:</span>
                        <span className="text-white text-sm font-mono">{agentId}</span>
                    </div>

                    {/* Usager */}
                    <div className="flex items-start gap-2">
                        <span className="text-gray-500 text-sm min-w-[70px]">👤 Usager:</span>
                        <span className="text-white text-sm font-mono">{usagerId}</span>
                    </div>

                    {/* Transaction Hash */}
                    <div className="flex items-start gap-2">
                        <span className="text-gray-500 text-sm min-w-[70px]">🔗 Hash:</span>
                        <div className="flex-1 flex items-center gap-2">
                            <span className="text-gray-300 text-xs font-mono break-all">
                                {truncateHash(txHash)}
                            </span>
                            <button
                                onClick={handleCopy}
                                className="flex-shrink-0 p-1.5 hover:bg-[#1f1f1f] rounded-lg transition-colors group/copy"
                                title="Copier le hash"
                            >
                                <Copy
                                    size={14}
                                    className={`${copied ? "text-green-400" : "text-gray-400 group-hover/copy:text-[#F0B90B]"
                                        } transition-colors`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Payment Transaction Hash (si payé) */}
                    {paymentTxHash && (
                        <div className="flex items-start gap-2">
                            <span className="text-green-500 text-sm min-w-[70px]">🧾 Reçu:</span>
                            <div className="flex-1 flex items-center gap-2">
                                <span className="text-green-400 text-xs font-mono break-all">
                                    {truncateHash(paymentTxHash)}
                                </span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(paymentTxHash);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="flex-shrink-0 p-1.5 hover:bg-[#1f1f1f] rounded-lg transition-colors group/copy"
                                    title="Copier le hash de paiement"
                                >
                                    <Copy
                                        size={14}
                                        className="text-green-500/50 hover:text-green-400 transition-colors"
                                    />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Date */}
                    <div className="flex items-start gap-2 pt-2 border-t border-[#1f1f1f]">
                        <span className="text-gray-500 text-sm min-w-[70px]">📅 Date:</span>
                        <span className="text-gray-300 text-sm">{createdAt}</span>
                    </div>
                </div>
            </div>

            <MetadataModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                metadata={metadata}
                isLoading={isLoadingMetadata}
                contraventionId={id}
                status={statut}
            />
        </>
    );
}

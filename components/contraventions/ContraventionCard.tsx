"use client";

import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

interface ContraventionCardProps {
    agentId: string;
    usagerId: string;
    txHash: string;
    createdAt: string;
    statut: "active" | "payed";
}

export function ContraventionCard({
    agentId,
    usagerId,
    txHash,
    createdAt,
    statut,
}: ContraventionCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(txHash);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Erreur lors de la copie:", error);
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
        <div className="bg-[#0C0C0C] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#2a2a2a] transition-all duration-200 group">
            {/* Header avec statut et bouton détails */}
            <div className="flex items-center justify-between mb-4">
                <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
                >
                    {config.label}
                </span>
                <button
                    className="text-sm text-gray-400 hover:text-[#F0B90B] transition-colors flex items-center gap-1 opacity-50 cursor-not-allowed"
                    disabled
                    title="Bientôt disponible"
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

                {/* Date */}
                <div className="flex items-start gap-2 pt-2 border-t border-[#1f1f1f]">
                    <span className="text-gray-500 text-sm min-w-[70px]">📅 Date:</span>
                    <span className="text-gray-300 text-sm">{createdAt}</span>
                </div>
            </div>
        </div>
    );
}

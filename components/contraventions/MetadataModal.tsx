"use client";

import { X } from "lucide-react";

interface TransactionMetadata {
    agent: string;
    usager: string;
    plaque: string;
    montant: string;
}

interface MetadataModalProps {
    isOpen: boolean;
    onClose: () => void;
    metadata: TransactionMetadata | null;
    isLoading: boolean;
}

export function MetadataModal({ isOpen, onClose, metadata, isLoading }: MetadataModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-lg rounded-2xl border border-[#2f2f2f] bg-[#050505] p-8 shadow-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="Fermer"
                >
                    <X size={24} />
                </button>

                <p className="text-sm uppercase tracking-[0.25em] text-[#F0B90B]">
                    Détails de la transaction
                </p>
                <h3 className="font-heading text-2xl mt-3">Métadonnées Blockchain</h3>
                <p className="text-gray-400 mt-2 text-sm">
                    Informations enregistrées sur Cardano
                </p>

                <div className="mt-6">
                    {isLoading && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B]"></div>
                            <p className="text-gray-400 mt-4 text-sm">Chargement des métadonnées...</p>
                        </div>
                    )}

                    {!isLoading && !metadata && (
                        <div className="text-center py-8">
                            <p className="text-red-400">Impossible de récupérer les métadonnées</p>
                        </div>
                    )}

                    {!isLoading && metadata && (
                        <div className="space-y-4">
                            <div className="border border-[#1f1f1f] rounded-xl p-4 bg-[#0A0A0A]">
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Agent</p>
                                <p className="text-white font-mono">{metadata.agent}</p>
                            </div>

                            <div className="border border-[#1f1f1f] rounded-xl p-4 bg-[#0A0A0A]">
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Usager</p>
                                <p className="text-white font-mono">{metadata.usager}</p>
                            </div>

                            <div className="border border-[#1f1f1f] rounded-xl p-4 bg-[#0A0A0A]">
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Plaque</p>
                                <p className="text-white font-mono">{metadata.plaque}</p>
                            </div>

                            <div className="border border-[#1f1f1f] rounded-xl p-4 bg-[#0A0A0A]">
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Montant</p>
                                <p className="text-white font-mono">{metadata.montant}</p>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="mt-8 w-full bg-[#F0B90B] text-black font-semibold py-3 rounded-full hover:bg-[#e0b010] transition-colors"
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}

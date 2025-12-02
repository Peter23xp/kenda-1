"use client";

import { BackgroundCells } from "@/components/ui/background-ripple-effect";
import { CheckCircle } from "lucide-react";

export default function Home() {
  const features = [
    "Gestion numérique et sécurisée des contraventions routières",
    "Émission automatique d'infractions sous forme de NFTs immuables",
    "Paiement rapide et transparent en ADA",
    "Suivi en temps réel du statut des contraventions",
    "Authentification des usagers et agents",
    "Historique complet des infractions et transactions",
    "Preuve cryptographique de paiement conservée sur la blockchain",
    "Interface intuitive et adaptée aux appareils mobiles",
    "Dashboard dédié pour les usagers, agents et l'administration",
    "Système décentralisé garantissant l'intégrité des données"
  ];

  return (
    <BackgroundCells className="bg-background flex flex-col justify-center items-center min-h-screen py-12">
      <div className="max-w-5xl px-6 text-center">
        <h1 className="font-heading text-white text-2xl font-bold md:text-3xl lg:text-4xl mb-12">
          Kenda — Digitaliser la sécurité routière grâce à la blockchain
        </h1>
        
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#F0B90B]" />
                <p className="text-gray-300">{feature}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-12">
          <button 
            className="bg-[#F0B90B] hover:bg-[#e0b010] text-black font-medium py-2.5 px-6 text-sm rounded-full transition-all duration-200 transform hover:scale-[1.03] shadow-sm hover:shadow-[0_4px_12px_rgba(240,185,11,0.3)]"
            onClick={() => {}}
          >
            Get Started
          </button>
          <button 
            className="bg-transparent border-2 border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B]/15 font-medium py-2.5 px-6 text-sm rounded-full transition-all duration-200 transform hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(240,185,11,0.15)]"
            onClick={() => {}}
          >
            Portail Agent
          </button>
        </div>
      </div>
    </BackgroundCells>
  );
};
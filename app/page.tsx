"use client";

import Link from "next/link";
import { BackgroundCells } from "@/components/ui/background-ripple-effect";
import { CheckCircle } from "lucide-react";

export default function Home() {
  const features = [
    "Gestion numérique et sécurisée des contraventions routières",
    "Émission de contraventions sous forme de NFTs immuables",
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
    <BackgroundCells className="bg-background flex flex-col justify-start md:justify-center items-center min-h-screen py-8 md:py-12">
      <div className="w-full max-w-5xl px-4 sm:px-6 text-center">
        <h1 className="font-heading text-white text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl mb-8 sm:mb-12 px-2">
          Kenda — Digitaliser la sécurité routière grâce à la blockchain
        </h1>
        
        <div className="mt-8 sm:mt-12 max-w-4xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#F0B90B]" />
                <p className="text-gray-300">{feature}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10 sm:mt-12 max-w-md mx-auto">
            <Link
              href="/usagers/creation"
              className="bg-[#F0B90B] hover:bg-[#e0b010] text-black font-medium py-3 px-6 text-base sm:text-sm rounded-full transition-all duration-200 transform hover:scale-[1.03] shadow-sm hover:shadow-[0_4px_12px_rgba(240,185,11,0.3)] w-full sm:w-auto text-center"
            >
              Get Started
            </Link>
            <Link 
              href="/agents/creation"
              className="bg-transparent border-2 border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B]/15 font-medium py-3 px-6 text-base sm:text-sm rounded-full transition-all duration-200 transform hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(240,185,11,0.15)] w-full sm:w-auto text-center"
            >
              Portail Agent
            </Link>
          </div>
        </div>
      </div>
    </BackgroundCells>
  );
};
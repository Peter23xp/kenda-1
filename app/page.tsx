"use client";

import { BackgroundCells } from "@/components/ui/background-ripple-effect";

export default function Home() {
  return (
    <BackgroundCells className="bg-background flex flex-col justify-center items-center h-screen">
      <div className="max-w-4xl px-6 text-center">
        <h1 className="font-heading text-white text-4xl font-bold md:text-5xl lg:text-6xl mb-6">
          Kenda — Digitaliser la sécurité routière grâce à la blockchain
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
          Une plateforme Web3 innovante qui transforme la gestion des contraventions en un système transparent, automatisé et infalsifiable, offrant aux usagers comme aux autorités une expérience sécurisée, rapide et entièrement numérique.
        </p>
      </div>
    </BackgroundCells>
  );
};
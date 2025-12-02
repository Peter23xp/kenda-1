"use client";

import { BackgroundCells } from "@/components/ui/background-ripple-effect";

export default function Home() {
  return (
    <BackgroundCells className="bg-background flex flex-col justify-center items-center h-screen">
      <h1 className="font-heading text-text-primary text-center text-4xl font-bold md:text-5xl lg:text-6xl pointer-events-none">
        Background cell animation <br />
        with framer motion
      </h1>
    </BackgroundCells>
  );
};
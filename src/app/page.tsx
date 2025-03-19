"use client";
import React from "react";
// import { motion } from "motion/react";
// import { LampContainer } from "../../components/ui/lamp"
import Preview from "../../components/Preview";
import Features from "../../components/Features";
import { cn } from "../../lib/utils";
import { Spotlight } from "../../components/ui/Spotlight";
export default function Home() {
  return (
    <main>
      <div className="relative flex h-screen w-full overflow-hidden rounded-md bg-black/[0.96] antialiased md:items-center md:justify-center">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
        )}
      />
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl p-5 pt-20 md:pt-0">
        <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
          Build Habits <br /> in the right way.
        </h1>
      </div>
        <span className="absolute bottom-6 text-center text-gray-600 text-md md:text-xl">
          &quot;The best way to end something is to starve it&quot;
        </span>
      </div>
      <Preview />
      <Features />
    </main>
  );
}

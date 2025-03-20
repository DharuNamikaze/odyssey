"use client";
import React from "react";
// import { motion } from "motion/react";
// import { LampContainer } from "../../components/ui/lamp"
import Preview from "../../components/Preview";
import Features from "../../components/Features";
import { cn } from "../../lib/utils";
import Join from "../../components/Join";
import Footer from "../../components/Footer";
export default function Home() {
  return (
    <main>
      <div className="relative flex h-screen w-full items-center justify-center bg-white dark:bg-black">
            <div
              className={cn(
                "absolute inset-0",
                "[background-size:20px_20px]",
                "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
                "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
                "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
                "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
              )}
            />
            {/* Radial gradient for the container to give a faded look */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
            <div>      
            <h1 className="text-center relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-5xl font-bold text-transparent sm:text-7xl">
            Build Habits <br /> in right way
            </h1>
            </div>
        {/* Centered Quote */}
        <span className="absolute bottom-6 w-full text-center text-green-400 sm:text-lg md:text-xl">
          {`~`} The best way to end something is to starve it
        </span>
      </div>

      <Preview />
      <Features />
      <Join/>
      <Footer/>
    </main>
  );
}

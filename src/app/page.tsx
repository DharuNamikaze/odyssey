"use client";
import React from "react";
import { motion } from "motion/react";
import { LampContainer } from "../../components/ui/lamp"
import Preview from "../../components/Preview";
import Features from "../../components/Features";
export default function Home() {
  return (
      <main>
        <LampContainer>
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="max-h-screen bg-gradient-to-br from-slate-300 to-slate-500 py-2 bg-clip-text text-center text-5xl font-medium tracking-tight text-transparent md:text-7xl md:font-semibold"
          >
            Build habits <br /> the right way
          </motion.h1>
        </LampContainer>
        <Preview/>
        <Features/>
      </main>
  );
}

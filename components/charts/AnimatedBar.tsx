"use client";

import { motion } from "motion/react";

export function AnimatedBar({
  index = 0,
  children,
}: {
  index?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ transform: "translateX(-100%)" }}
      animate={{ transform: "translateX(0)" }}
      className="absolute inset-0"
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.075, // Staggered delay effect
      }}
    >
      {children}
    </motion.div>
  );
}

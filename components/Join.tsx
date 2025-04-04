"use client";
import React from 'react'
import Link from 'next/link';
import { motion } from "framer-motion";
import { SparklesCore } from "../components/ui/Sparkles";
import { IconBulb, IconBoltFilled, IconAward, IconBellRinging, IconBrain, IconSend } from '@tabler/icons-react';

export function SparklesPreview() {
  return (
    <div className="h-[40rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <motion.div
        className="flex space-x-4 space-y-5 justify-center"
        initial={{ opacity: 0, y: 50 }} // Fade in + Move up effect
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Brain Icon */}
        <motion.div
          className="w-10 h-10 text-purple-300"
          whileInView={{ scale: [1, 1.2, 1] }} // Pulsing effect
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          <IconBrain />
        </motion.div>

        {/* Bulb Icon */}
        <motion.div
          className="w-10 h-10 text-yellow-300"
          whileInView={{ rotate: [0, 15, -15, 0] }} // Swing effect
          transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
        >
          <IconBulb />
        </motion.div>

        {/* Bolt Icon */}
        <motion.div
          className="w-10 h-10 text-orange-400"
          whileInView={{ y: [0, -10, 0] }} // Floating effect
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <IconBoltFilled />
        </motion.div>

        {/* Award Icon */}
        <motion.div
          className="w-10 h-10 text-red-400"
          whileInView={{ scale: [1, 1.3, 1] }} // Zoom effect
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          <IconAward />
        </motion.div>

        {/* Bell Icon */}
        <motion.div
          className="w-10 h-10 text-green-400"
          whileInView={{ rotate: [0, 10, -10, 0] }} // Shake effect
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
        >
          <IconBellRinging />
        </motion.div>
      </motion.div>
      <h1 className="md:text-7xl text-4xl lg:text-7xl font-bold text-center text-white relative z-20">
        Create your Odyssey
      </h1>
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        <span >
          <button className='flex justify-center mx-auto text-[1em] font-medium bg-white text-black px-5 py-2 rounded-lg hover:cursor-pointer hover:bg-gray-300'><Link href="SignUp">Join Now</Link></button>
        </span>

        <motion.div
          className="flex space-x-4 space-y-5 justify-center"
          initial={{ opacity: 0, y: 100, x: 250 }} // Fade in + Move up effect
          whileInView={{ opacity: 1, y: -5, x: 5 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <motion.div
            className="flex space-x-4 space-y-5 justify-center"
            initial={{ opacity: 0, y: 50, rotateZ: 50 }} // Fade in + Move up effect
            whileInView={{ opacity: 1, y: 0, rotateZ: 280 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <IconSend />
          </motion.div>
        </motion.div>


        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>

    </div>

  );
}
const Join = () => {
  return (
    <section>
      <SparklesPreview />
    </section>
  )
}

export default Join
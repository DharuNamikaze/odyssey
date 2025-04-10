'use client'
import React from 'react'
import { cn } from "../lib/utils";
import { IconSquareRoundedCheckFilled } from "@tabler/icons-react"
export function DotBackgroundDemo() {
  return (
    <div className="relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black">
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
          Why <br /> Odyssey?
        </h1>
        <div className="max-w-lg flex items-center mx-auto text-center z-20 text-neutral-300">
          <ul className="max-w-lg space-y-3 text-neutral-300 z-20">
            <li className="flex items-start gap-2">
              <IconSquareRoundedCheckFilled className="min-w-4 min-h-4 text-green-400" />
              <span>Tracks habits and encourages consistency.</span>
            </li>
            <li className="flex items-start gap-2">
              <IconSquareRoundedCheckFilled className="min-w-4 min-h-4 text-green-400" />
              <span>Improves attention span and focus over time.</span>
            </li>
            <li className="flex items-start gap-2">
              <IconSquareRoundedCheckFilled className="min-w-4 min-h-4 text-green-400" />
              <span>Boosts productivity and efficiency in your daily tasks.</span>
            </li>
            <li className="flex items-start gap-2">
              <IconSquareRoundedCheckFilled className="min-w-4 min-h-4 text-green-400" />
              <span>Creates awareness about actions and choices.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
const Features = () => {
  return (
    <section className=''>
      {/* <Image className='-z-10 absolute w-screen  min-h-60' alt='' src="/feature-bg.jpg" width={300} height={100} />
      <div className='text-4xl py-10'>Why Odyssey?</div> */}
      {/* <  /> */}
      <DotBackgroundDemo />
    </section>
  )
}

export default Features;
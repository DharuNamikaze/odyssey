import React from 'react'
import { cn } from "../lib/utils";
export function SpotlightPreview() {
  return (
    <div className="relative flex h-screen w-full overflow-hidden rounded-md bg-black/[0.96] antialiased md:items-center md:justify-center">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
        )}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-30">
        <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-500 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
          Why <br /> Odyssey?
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-300">
          Odyssey helps you to rewire your brain neurons aids in increasing productivity at work, improve attention span. Here, we are drawing the attention towards the text
          section of the page. I don&apos;t know why but I&apos;m running out of
          copy.
        </p>
      </div>
    </div>  
  );
}

const Features = () => {
  return (
    <section className=''>
      {/* <Image className='-z-10 absolute w-screen  min-h-60' alt='' src="/feature-bg.jpg" width={300} height={100} />
      <div className='text-4xl py-10'>Why Odyssey?</div> */}
      <SpotlightPreview />
    </section>
  )
}

export default Features;
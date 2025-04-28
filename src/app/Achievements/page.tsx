'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import { IconFidgetSpinner } from '@tabler/icons-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { GlareCard } from '../../../components/ui/glare-card' ;
import Image from "next/image";
export function GlareCardDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <GlareCard className="flex flex-col items-center justify-center">
        <svg
          width="66"
          height="65"
          viewBox="0 0 66 65"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-14 w-14 text-white"
        >
          <path
            d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
            stroke="currentColor"
            strokeWidth="15"
            strokeMiterlimit="3.86874"
            strokeLinecap="round"
          />
        </svg>
      </GlareCard>
      <GlareCard className="flex flex-col items-center justify-center">
        <Image
          className="h-full w-full absolute inset-0 object-cover"
          src="https://images.unsplash.com/photo-1512618831669-521d4b375f5d?q=80&w=3388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          height={30}
          width={30}
          alt="ad.com"
        />
      </GlareCard>
      <GlareCard className="flex flex-col items-start justify-end py-8 px-6">
        <p className="font-bold text-white text-lg">The greatest trick</p>
        <p className="font-normal text-base text-neutral-200 mt-4">
          The greatest trick the devil ever pulled was to convince the world
          that he didn&apos;t exist.
        </p>
      </GlareCard>
    </div>
  );
}

export default function page() {

  const [bro, setBro] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    const fetchBro = () => {
      try {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentBro) => {
          if (currentBro) setBro(currentBro);
          else setBro(null);
          setLoading(false)
        })
        return () => unsubscribe;
      } catch (err) {
        console.log(err, "Error ra elai")
        setLoading(false)
      }
    }
    fetchBro()
  }, [bro])
  const LoadingModal = () => (
    <div className="fixed h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100">
      <div className="p-6 flex items-center justify-center h-screen">
        <div className='mb-3 flex items-center justify-center h-screen'><IconFidgetSpinner className='loader' /></div>
      </div>
    </div>
  );
  return (

    <>
      {loading && LoadingModal()}
      Hi
      <GlareCardDemo/>
    </>
  )
}
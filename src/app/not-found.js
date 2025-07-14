import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import './globals.css' 

export default function NotFound() {
  return (
    <div className='flex flex-col justify-center text-center min-h-screen bg-gradient-to-b bg-black text-white font-bold'>
     <h1 className='pb-1 text-2xl'>Oh! I See, This page went rogue.</h1>
      <p className='text-xl font-bold'>Houston, we have a problem... finding that page.🗣️</p>
      <span className=''>
        <Image src='/not-found.png' className='animate-pulse flex justify-center items-center mx-auto -z-50 bg-inherit shadow-black' alt='Odyssey' width={150} height={150} />
        <Link href="/Dashboard" className='border-black p-2 hover:text -amber-600 rounded-lg text-2xl font-extrabold'>Return Home</Link>
        </span>
    </div>
  )
}
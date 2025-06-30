import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import './globals.css' 

export default function NotFound() {
  return (
    <div className='flex flex-col justify-center text-center min-h-screen bg-gradient-to-b to-purple-400 from-violet-900 text-white font-bold'>
     <h1 className='pb-1'>Oh! I See, This page went rogue.</h1>
      <p className='text-xl font-bold'>Houston, we have a problem... finding that page.🗣️</p>
      <span className=''>
        <Image src='/not-found.png' className='flex justify-center items-center mx-auto -z-50 bg-inherit shadow-black  ' alt='Odyssey' width={150} height={150} />
        <Link href="/" className='border-black px-2 py-1 hover:bg-violet-400 rounded-3xl text-2xl font-extrabold'>Return Home</Link>
        </span>
    </div>
  )
}
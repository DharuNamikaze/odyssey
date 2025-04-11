import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
const Footer = () => {
  return (
    <section className='h-[17rem] bg-black border-t-1 border-t-gray-600 flex max-sm:flex-col-reverse max-sm:justify-center max-sm:items-center'>
      <div className='flex flex-1 flex-col px-2 py-2 justify-center items-center'>
        <Image src='/Odyssey1.png' className='ico' alt='Odyssey' width={20} height={20} />
        <span>Odyssey</span>
        <span>Build by <span className='hover:text-gray-400 cursor-pointer'>@dharu_namikaze</span></span>
      </div>
      <div className='flex flex-1 flex-row space-x-20 px-2 py-2 justify-center items-center font-light'>
        <ul>
          <Link href='/' target='_blank'><li>Pricing</li></Link>
          <Link href='mailto:dharunamikaze@gmail.com' target='_blank'><li>Contact</li></Link>
          <Link href="https://ui.aceternity.com/" target='_blank'> <li> Build</li></Link>
          <Link href='/' target='_blank'><li>About</li> </Link>
        </ul>
        <ul className='flex flex-col'>
          <Link href='https://www.instagram.com/dharu_namikaze/' target='_blank'><li>Instagram</li></Link>
          <Link href='https://github.com/DharuNamikaze/' target='_blank'><li>Github</li></Link>
          <Link href="https://ui.aceternity.com/" target='_blank'> <li> X</li></Link>
          <Link href='/' target='_blank'><li>About</li> </Link>
        </ul>
      </div>
    </section>
  )
}
export default Footer;
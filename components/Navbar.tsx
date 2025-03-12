import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
    return (
        <>
        <div className='mx-5 my-10 2xl:mx-10 2xl:my-10 rounded-full bg-amber-50 text-blue-900 flex justify-center items-center text-center gap-[10vh]'>
            <Link href={'/'}>
                <Image alt='logo' src='/logo.png' width={30} height={30} ></Image>
            </Link>
            <Link href={'/'} >
                <button>
                    Home
                </button>
            </Link>
            <Link href={'./achievements'} >
                <button>
                    Acheivements
                </button>
            </Link>
            <Link href={'./profile'} >
                <button>
                    Profile
                </button>
            </Link>
        </div>
        </>
    )
}

export default Navbar
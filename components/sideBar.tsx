'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconEdit, IconFidgetSpinner, IconLogout2, IconLayoutDashboard, IconAward, IconUser, IconCannabis, IconBrain } from '@tabler/icons-react'
import { onAuthStateChanged, User } from 'firebase/auth';
import { getAuth, signOut } from "../lib/firebase";
import { useRouter } from 'next/navigation';

export function Sidebar() {
    const [bro, setBro] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const router = useRouter();

    const handleSignOut = () => {
        setLoading(true);
        const auth = getAuth();
        signOut(auth);
        console.log("user signout successfully");
        router.push("/");
        setLoading(false)
    }
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
    }, [])
    const LoadingModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <IconFidgetSpinner className="w-8 h-8 text-white animate-spin" />
        </div>
    );

    return (
        <nav className="text-xs  bg-black p-3 flex flex-col h-full w-[30vh] rounded-lg z-50 space-y-5 sticky">
            {loading && <LoadingModal />}
            <span className="cursor-pointerborder-2 border-black rounded-lg p-1 flex justify-between items-center text-center "> <strong>{bro?.displayName}</strong> <Link href="" className="">
                <IconEdit className='w-5 h-5' />
            </Link>
            </span>
            <menu className="cursor-pointer border-2 border-black p-0.5 rounded-lg flex flex-col justify-between space-y-2">
                <span className='cursor-pointer text-blue-400' >Menu</span>
                <input className='rounded-lg p-1  hover:bg-[#3e3e3e] text-white' placeholder='Search' id="searchBar" type='text' />
                <Link href="/Inbox"><li className='rounded-lg p-1 hover:bg-[#3e3e3e] text-white'>Inbox</li></Link>
                <Link href="/"><li className='rounded-lg p-1 hover:bg-[#3e3e3e] text-white'>Odyssey AI</li></Link>
            </menu>
            <menu className="p-0.5 rounded-lg flex flex-col justify-between space-y-2">
                <span className='cursor-pointer text-blue-400'>Personal</span>
                <Link href="/Dashboard"><li className='rounded-lg p-1 hover:bg-[#3e3e3e]  text-white flex items-center gap-1'>
                    <IconLayoutDashboard className='w-4 h-4 text-indigo-500 ' /> Dashboard </li> </Link>
                <Link href="/Achievements"><li className='rounded-lg p-1 hover:bg-[#3e3e3e] text-white flex items-center gap-1'>
                    <IconAward className='w-4 h-4 text-yellow-300 ' />  Achievements</li></Link>
                <Link href="/Profile"><li className='rounded-lg p-1 hover:bg-[#3e3e3e] text-white flex items-center gap-1'>
                    <IconUser className='w-4 h-4 text-green-500' /> Profile</li></Link>
                <Link href="/Habits"><li className='rounded-lg p-1 hover:bg-[#3e3e3e] text-white flex items-center gap-1'>
                    <IconCannabis className='w-4 h-4 text-red-400' />Habits</li> </Link>
                <Link href="/GritEngine"><li className='rounded-lg p-1 hover:bg-[#3e3e3e] text-white flex items-center gap-1'>
                    <IconBrain className='w-4 h-4 text-pink-400' />Grit Engine</li> </Link>

            </menu>
            <menu className="p-0.5 rounded-lg flex flex-col justify-between space-y-2">
                <span className='cursor-pointer text-blue-400'>Favorites</span>
                <li className='hover:bg-[#3e3e3e] rounded-lg p-1'></li>
                <li className='hover:bg-[#3e3e3e] rounded-lg p-1'></li>
            </menu>
            <menu className="border-2 border-black p-0.5 rounded-lg flex flex-col justify-between space-y-4">
                <span className='cursor-pointer text-blue-400'>Private</span>
                <li className='hover:bg-[#3e3e3e] rounded-lg p-1'></li>
                <li className='hover:bg-[#3e3e3e] rounded-lg p-1'></li>
            </menu>
            <Link href="/" className='flex gap-5 p-2 cursor-pointer hover:bg-[#3e3e3e] rounded-lg items-center' onClick={handleSignOut}><IconLogout2 /> Logout </Link>

        </nav>
    )
}
export default Sidebar;
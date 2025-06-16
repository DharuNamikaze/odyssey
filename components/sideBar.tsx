'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconEdit, IconNotes, IconFidgetSpinner, IconLayoutDashboard, IconAward, IconUser, IconCannabis, IconBrain } from '@tabler/icons-react'
import { onAuthStateChanged, User } from 'firebase/auth';
import { getAuth, signOut } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { usePage } from '../context/PageContext'
import { Page } from '../src/app/Pages/types';
export function SideBar() {

    const { page, setPage } = usePage();
    const [bro, setBro] = useState<User | null>(null);
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
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return;
            try {
                const token = await user.getIdToken();
                const response = await fetch('/api/pages', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setPage(data.pages); // ✅ update global context for access in Sidebar
            } catch (err) {
                console.error('Failed to fetch pages in Sidebar:', err);
            }
        });

        return () => unsubscribe();
    }, []);

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
            <span className="cursor-pointerborder-2 border-black rounded-lg p-1 flex justify-between items-center text-center " > <strong>{bro?.displayName}</strong> <Link href="/Pages" className="">
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
            <menu className="border-2 border-black rounded-lg flex flex-col justify-between space-y-4">
                <span className='cursor-pointer text-blue-400'>Private</span>
                <div className='z-10 text-white w-full h-4 rounded-lg flex flex-col gap-2 ' >
                    {page && page.length > 0 ? (
                        page.map((i: Page) => (
                            <div key={i.id} className='flex items-center text-center w-full rounded-lg p-1 hover:bg-[#3e3e3e] gap-1 '>
                                {/* <li className="hover:bg-[#3e3e3e] rounded-lg px-2 py-1 text-sm bg-[#2e2e2f] flex flex-col gap-10"> </li> */}
                                <IconNotes  className='w-4 h-4'/> <Link href={`/Pages/${i.id}`} className='hover:cursor-pointer'>
                                    {i.title}
                                </Link>
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-500">No pages yet</span>
                    )}
                </div>
            </menu>
        </nav>
    )
}
export default React.memo(SideBar);
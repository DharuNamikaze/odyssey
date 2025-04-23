import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconEdit, IconFidgetSpinner, IconLogout2 } from '@tabler/icons-react'
import { onAuthStateChanged, User } from 'firebase/auth';
import { getAuth, signOut } from "../../lib/firebase";
import { useRouter } from 'next/navigation';

export function Sidebar() {
    const [bro, setBro] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const router = useRouter()
    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth);
        setLoading(false);
        console.log("user signout successfully");
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
        <div className="fixed h-screen inset-0 flex items-center justify-center bg-black z-50">
            <div className='flex h-screen items-center justify-center bg-black'><IconFidgetSpinner className='loader' /></div>
        </div>
    );

    return (
        <nav className="bg-black p-2 flex flex-col h-full w-[30vh] rounded-lg z-50 space-y-5">
            {loading && <LoadingModal />}
            <span className="cursor-pointerborder-2 border-black rounded-lg p-1 flex justify-between space-y-1"> <strong>{bro?.displayName}</strong> <Link href="" className="">
                <IconEdit />
            </Link> </span>
            <menu className="cursor-pointer border-2 border-black p-0.5 rounded-lg flex flex-col justify-between space-y-2">
                <span className='cursor-pointer underline-offset-3 underline text-blue-400' >Menu</span>
                <input className='rounded-lg p-1  hover:bg-gray-800' placeholder='Search' />
                <Link href="/"><li className='rounded-lg p-1 hover:bg-gray-800'>Inbox</li></Link>
                <Link href="/"><li className='rounded-lg p-1 hover:bg-gray-800'>Odyssey AI</li></Link>
            </menu>
            <menu className="p-0.5 rounded-lg flex flex-col justify-between space-y-2">
                <span className='cursor-pointer underline-offset-3 underline text-blue-400'>Personal</span>
                <Link href="/Dashboard"><li className='rounded-lg p-1 hover:bg-gray-800'>Dashboard</li> </Link>
                <Link href="/Achievements"><li className='rounded-lg p-1 hover:bg-gray-800'>Achievements</li></Link>
                <Link href="/Profile"><li className='rounded-lg p-1 hover:bg-gray-800'>Profile</li></Link>
                <Link href="/Wellness"><li className='rounded-lg p-1 hover:bg-gray-800'>Wellness</li> </Link>
                <Link href="/Habits"><li className='rounded-lg p-1 hover:bg-gray-800'>Habits</li> </Link>

            </menu>
            <menu className="p-0.5 rounded-lg flex flex-col justify-between space-y-2">
                <span className='cursor-pointer underline-offset-3 underline text-blue-400'>Favorites</span>
                <li className='hover:bg-gray-800 rounded-lg p-1'></li>
                <li className='hover:bg-gray-800 rounded-lg p-1'></li>
            </menu>
            <menu className="border-2 border-black p-0.5 rounded-lg flex flex-col justify-between space-y-4">
                <span className='cursor-pointer underline underline-offset-3 text-blue-400'>Private</span>
                <li className='hover:bg-gray-800 rounded-lg p-1'></li>
                <li className='hover:bg-gray-800 rounded-lg p-1'></li>
            </menu>
            <Link href="/" className='flex gap-5 p-2 cursor-pointer' onClick={handleSignOut}><IconLogout2 /> Logout </Link>
        </nav>
    )
}
export default Sidebar;
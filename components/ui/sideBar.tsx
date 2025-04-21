import React, {  useEffect, useState } from 'react'
import Link from 'next/link'
import { IconEdit, IconFidgetSpinner, IconLogout2 } from '@tabler/icons-react'
import { onAuthStateChanged, User } from 'firebase/auth';
import { getAuth, signOut } from "../../lib/firebase";

export function Sidebar() {
    const [bro, setBro] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const handleSignOut = () => {
        setLoading(true);
        const auth = getAuth();
        signOut(auth);
        console.log(signOut(auth));
        setLoading(false);
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
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
            <div className='flex items-center justify-center bg-black'><IconFidgetSpinner className='loader' /></div>
        </div>
    );

    return (
        <nav className="text-black bg-amber-100 p-2 flex flex-col h-screen w-[30vh] rounded-lg z-50">
            {loading && <LoadingModal />}
            <span className="border-2 border-blue-600 rounded-lg p-1 flex justify-between "> <strong>{bro?.displayName}</strong> <Link href="" className="">
                <IconEdit />
            </Link> </span>
            <menu className="border-2 border-blue-600 p-0.5 rounded-lg flex flex-col justify-between space-y-5">
                <span>Menu</span>
                <li >Search</li>
                <li>Inbox</li>
                <li>Odyssey AI</li>
            </menu>
            <menu className="flex flex-col flex-1">
                Favorites
                <li >Projects</li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </menu>
            <button className='flex gap-5 p-2 cursor-pointer' onClick={handleSignOut}><IconLogout2 /> Logout </button>
        </nav>
    )
}
export default Sidebar;
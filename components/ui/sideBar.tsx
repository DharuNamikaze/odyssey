import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconEdit, IconFidgetSpinner } from '@tabler/icons-react'
import { onAuthStateChanged, User } from 'firebase/auth';
import { getAuth } from "../../lib/firebase";

export function Sidebar() {
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
    }, [])
    const LoadingModal = () => (
        <div className="fixed inset-100 flex items-center justify-center">
            <div className='mb-3 p-6 flex items-center justify-center'><IconFidgetSpinner className='loader' /></div>
        </div>
    );

    return (
        <nav className="text-black bg-amber-100 p-2 flex flex-col h-screen w-[25vh] rounded-lg z-50">
            {loading && <LoadingModal />}
            <span className="border-2 border-amber-600 rounded-lg p-1 flex justify-between "> <strong>{bro?.displayName}</strong> <Link href="" className="">
                <IconEdit />
            </Link> </span>
            <menu className="flex flex-col">
                Menu
                <li >Search</li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </menu>
            <menu className="flex flex-col">
                Favorites
                <li >Projects</li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </menu>
        </nav>
    )
}
export default Sidebar;
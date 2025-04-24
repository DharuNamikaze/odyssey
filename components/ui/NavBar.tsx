'use client';
import React from 'react'
import { useState, useEffect } from 'react'
import { User, onAuthStateChanged, getAuth } from 'firebase/auth';
export const NavBar = () => {
    const [streak, setStreak] = useState<number>(0)
    const [bro, setBro] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        const fetchBro = () => {
            try {
                setLoading(true);
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

    const day = new Date();
    const time = day.getHours();
    const greeting = () => {
        if (time >= 1 && time < 12) { return "Good Morning" }
        else if (time >= 12 && time < 16) { return "Good Afternoon" }
        else if (time >= 16 && time < 19) { return "Good Evening" }
        else { return "Good Night" }
    }
    return (
        <>
            <div className='flex flex-col bg-amber-300 h-[7vh] w-screen '>
                <span className="text-2xl"> {greeting()}, {bro?.displayName} </span>
                <span>{streak}</span>
            </div>
        </>
    )
}

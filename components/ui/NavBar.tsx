'use client';
import React from 'react'
import Image from 'next/image';
import { useState, useEffect } from 'react'
import { User, onAuthStateChanged, getAuth } from 'firebase/auth';
export const NavBar = () => {
    const [streak, setStreak] = useState<number>(0)
    const [bro, setBro] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [avatar, setAvatar] = useState<string | null>(null)

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
    useEffect(() => {

        if (bro) {
            setLoading(true)
            setAvatar(bro.photoURL)
            setStreak(prev => prev + 1);
        } else {
            setStreak(0);
        }

    }, [bro])


    const day = new Date();
    const time = day.getHours();
    const greeting = () => {
        if (time >= 1 && time < 12) { return "Good Morning 🌞" }
        else if (time >= 12 && time < 16) { return "Good Afternoon ☀️" }
        else if (time >= 16 && time < 19) { return "Good Evening 🌇" }
        else { return "Good Night 🌝" }
    }
    return (
        <>
            <div className='flex bg-black shadow-2xl shadow-black rounded-full p-4 h-[7vh] w-full items-center gap-10 '>
                <span className="text-lg "> {greeting()}</span>
                <span className='flex justify-start flex-row-reverse flex-1 gap-5 text-sm'>
                    <Image className='hover:bg-[#688069] cursor-pointer rounded-full px-4 py-2' src={avatar || '/Odyssey1.png'} width="10" height="10" alt="DP"></Image > 
                    <button className='hover:bg-[#688069] cursor-pointer rounded-full px-4 py-2 text-white'>{streak}🔥</button>
                    <button className='hover:bg-[#688069] cursor-pointer rounded-full px-4 py-2 text-white'>🌟 125</button>
                </span>
            </div>
        </>
    )
}

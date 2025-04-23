"use client";
import React, { useState, useEffect } from "react";
import '../globals.css'
import dynamic from 'next/dynamic';
import { User, onAuthStateChanged } from 'firebase/auth'
import { getAuth } from "../../../lib/firebase";
import { LineChartStep } from "../../../components/charts/LineChartStep";

const Dashboard = () => {
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
    }, [bro])

    const Heatmap = dynamic(() => import('../../../components/charts/Heatmap'), {
        ssr: false,
    });

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
            <main className="bg-[#1E1E1E] flex flex-col gap-10 p-10 rounded-xl">
                <span className="flex justify-center items-center text-center text-2xl "> {greeting()}, {bro?.displayName} </span>
                <div className="p-10 rounded-xl gap-5 flex flex-col shadow-2xl shadow-black ">
                    <span className="text-3xl text-blue-500 font-medium">Sleep Hours 💤</span>
                    <LineChartStep />
                </div>
                <div className="p-10 rounded-xl gap-5 flex flex-col shadow-2xl shadow-black">
                    <span className="text-3xl text-blue-500 font-medium ">Habit Consistency 💪 💤</span>
                    <Heatmap />
                </div>


            </main>
        </>
        // {/* <FullSidebar /> */ }
        // <section>
        //     <div className='px-10 py-10 mx-10 my-10 bg-amber-500' >
        //         Logout
        //         <button>Logout</button>
        //         <div></div>
        //     </div>
        // </section>
    )
}

export default Dashboard



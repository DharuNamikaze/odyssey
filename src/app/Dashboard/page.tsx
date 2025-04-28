"use client";
import React, { useState, useEffect } from "react";
import '../globals.css'
// import dynamic from 'next/dynamic';
import { HorizontalBarChart } from "../../../components/charts/BarChartHorizontal";
import { User, onAuthStateChanged } from 'firebase/auth'
import { getAuth } from "../../../lib/firebase";
import { IconFidgetSpinner } from '@tabler/icons-react';
import { LineChart } from '../../../components/charts/LineChart';
import { LineCustomChart } from '../../../components/charts/LineCustomChart'
// import { LineChartStep } from "../../../components/charts/LineChartStep";

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

    // const Heatmap = dynamic(() => import('../../../components/charts/Heatmap'), {
    //     ssr: false,
    // });
    const LoadingModal = () => (
        <div className="fixed h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="p-6 flex items-center justify-center h-screen">
                <div className='mb-3 flex items-center justify-center h-screen'><IconFidgetSpinner className='loader' /></div>
            </div>
        </div>
    );
    return (
        <>
            <main className="flex flex-col gap-10 ">
                {loading && LoadingModal()}
                <div className="grid grid-cols-1 gap-6 z-5">
                    <h6 className="text-xl mt-5">Summary</h6>
                    <div className="flex gap-6 z-5 p-4 rounded-2xl bg-[var(--bggray)] items-center ">
                        <div className="grid grid-cols-2 gap-5 items-center text-sm">
                            <div className="rounded-2xl bg-black p-3 ">Streak 🔥: 1</div>
                            <div className="rounded-2xl bg-black p-3 ">Aura 🌟: 125</div>
                            <div className="rounded-2xl bg-black p-3 ">Level:</div>
                        </div>
                    </div>
                    <div className="p-8 rounded-2xl bg-[var(--bggray)] flex flex-col space-y-3 ">
                        <HorizontalBarChart />
                        <span className="flex justify-center">Habits</span>
                    </div>
                    <div className="p-8 rounded-2xl bg-[var(--bggray)] flex flex-col space-y-3" >
                        <LineChart />
                        <span className="flex justify-center">Sleep Hours</span>
                    </div>
                    <div className="p-8 rounded-2xl bg-[var(--bggray)] flex flex-col space-y-3" >
                        <LineCustomChart />
                        <span className="flex justify-center">Sleep Hours</span>
                    </div>

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



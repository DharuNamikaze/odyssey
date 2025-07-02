"use client";
import React, { useState, useEffect } from "react";
import '../globals.css'
import Heatmap from '@/components/charts/Heatmap'
import DonutChartCenterText from '../../../components/charts/DonutChartCenterText'
import BarChartHorizontalLogo from '../../../components/charts/BarChartHorizontalLogo'
import { HorizontalBarChart } from "../../../components/charts/BarChartHorizontal";
import { User, onAuthStateChanged } from 'firebase/auth'
import { getAuth } from '../../../lib/firebase';
import { LineChart } from '../../../components/charts/LineChart';
import { LineCustomChart } from '../../../components/charts/LineCustomChart'
import Levels from '../../../data/levels';

const Dashboard = () => {
    const [date, setDate] = useState<Date | null>(null);
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

    // const LoadingModal = () => (
    //     <div className="fixed h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    //         <div className="p-6 flex items-center justify-center h-screen">
    //             <div className='mb-3 flex items-center justify-center h-screen'><IconFidgetSpinner className='loader' /></div>
    //         </div>
    //     </div>
    // );

    return (
        <>
            <main className="flex flex-col gap-10 overflow-hidden ">
                <div className="grid grid-cols-1 gap-5 z-4 mb-10 ">
                    <div >
                        <h1 className="mt-5 text-4xl font-bold p-0 mb-0">Summary</h1>
                        <p className="text-neutral-400 mt-1">Welcome back! Here's an overview of your Activites.</p>
                    </div>
                    <div className="flex gap-6 z-5 p-4 rounded-2xl bg-gradient-to-tr from-black to-zinc-700 items-center border-[0.2px] border-neutral-700 ">
                        <div className="max-md:grid max-md:grid-cols-1 flex gap-5 items-center text-sm">
                            <div className="rounded-2xl bg-gradient-to-br from-black to-neutral-800 flex flex-col py-6 pr-20 pl-5 text-base gap-1 justify-evenly">
                                <h1 className="font-semibold text-xl">Streak 🔥</h1>
                                <span className="text-xl pt-3 text-neutral-400">1</span>
                            </div>
                            <div className="rounded-2xl bg-gradient-to-br from-black to-neutral-800 py-6 pr-20 pl-5 flex flex-col text-base gap-1">
                                <h1 className="font-semibold text-xl">Aura 🌟</h1>
                                <span className="text-xl pt-3 text-neutral-400"> 1223</span>
                            </div>
                            <div className="rounded-2xl  bg-gradient-to-br from-black to-neutral-800 py-6 pr-20 pl-5 flex flex-col text-base gap-1 ">
                                <h1 className="font-semibold text-xl">Level 🚀</h1>
                                <span className="text-xl pt-3 text-neutral-400">{Levels[0][0]}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-2xl bg-gradient-to-tr from-black to-zinc-700 grid max-md:grid-cols-1 grid-cols-2 flex-1 space-y-2 border-[0.1px] border-neutral-700" >
                        <div className="space-y-9">
                            <DonutChartCenterText />
                            <span className="flex justify-center font-semibold text-lg">Habits</span>
                        </div>
                        <div><HorizontalBarChart /></div>

                        {/* <span className="flex justify-center">Habits</span> */}
                    </div>

                    <div className="p-8 rounded-2xl bg-gradient-to-tr from-black to-zinc-700 flex flex-col space-y-3 border-[0.2px] border-neutral-700" >
                        <LineChart />
                        <span className="flex justify-center font-semibold text-lg">Sleep Hours</span>
                    </div>

                    <div className="p-8 rounded-2xl bg-gradient-to-tr from-black to-zinc-700 flex flex-col space-y-3 border-[0.2px] border-neutral-700" >
                        <LineCustomChart />
                        <span className="flex justify-center font-semibold text-lg">Emotion Timeline</span>
                    </div>

                    <div className="p-8 rounded-2xl bg-gradient-to-tr from-black to-zinc-700 flex flex-col space-y-3 border-[0.2px] border-neutral-700 " >
                        <BarChartHorizontalLogo />
                        <span className="flex justify-center font-semibold text-lg">Valued Emotion</span>
                    </div>

                    <div className="p-8 rounded-2xl bg-gradient-to-tr from-black to-zinc-900 flex flex-col space-y-3 border-[0.2px] border-neutral-700 " >
                        <Heatmap />
                        <span className="flex justify-center font-semibold text-lg">Heatmap</span>
                    </div>

                </div>
            </main>
        </>
    )
}

export default Dashboard

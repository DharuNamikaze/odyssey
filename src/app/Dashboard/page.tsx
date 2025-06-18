"use client";
import React, { useState, useEffect } from "react";
import '../globals.css'
import DonutChartCenterText from '../../../components/charts/DonutChartCenterText'
import BarChartHorizontalLogo from '../../../components/charts/BarChartHorizontalLogo'
import { HorizontalBarChart } from "../../../components/charts/BarChartHorizontal";
import { User, onAuthStateChanged } from 'firebase/auth'
import { getAuth } from '../../../lib/firebase';
import { LineChart } from '../../../components/charts/LineChart';
import { LineCustomChart } from '../../../components/charts/LineCustomChart'
import Levels from '../../../data/levels';

const Dashboard = () => {
    const [date, setDate] = useState<Nullable<Date>>(null);
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
                <div className="grid grid-cols-1 gap-6 z-4 mb-10">
                    <h6 className="text-xl mt-5">Summary</h6>
                    <div className="flex gap-6 z-5 p-4 rounded-2xl bg-[var(--bggray)] items-center ">
                        <div className="max-md:grid max-md:grid-cols-1 flex gap-5 items-center text-sm">
                            <div className="rounded-2xl bg-black p-2 flex flex-col text-base gap-1">Streak <span className="text-xl">1🔥</span></div>
                            <div className="rounded-2xl bg-black p-2 flex flex-col text-base gap-1">Aura <span className="text-xl">1223🌟</span></div>
                            <div className="rounded-2xl bg-black p-2 flex flex-col text-base gap-1">Level <span className="text-xl">{Levels[0][0]}</span> </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-2xl bg-[var(--bggray)] grid max-md:grid-cols-1 grid-cols-2 flex-1 space-y-2" >
                        <div className="space-y-9"><DonutChartCenterText /> <span className="flex justify-center">Habits</span></div>
                        <div><HorizontalBarChart /></div>

                        {/* <span className="flex justify-center">Habits</span> */}
                    </div>

                    <div className="p-8 rounded-2xl bg-[var(--bggray)] flex flex-col space-y-3" >
                        <LineChart />
                        <span className="flex justify-center">Sleep Hours</span>
                    </div>

                    <div className="p-8 rounded-2xl bg-[var(--bggray)] flex flex-col space-y-3" >
                        <LineCustomChart />
                        <span className="flex justify-center">Emotion Timeline</span>
                    </div>

                    <div className="p-8 rounded-2xl bg-[var(--bggray)] flex flex-col space-y-3 " >
                        <BarChartHorizontalLogo />
                        <span className="flex justify-center">Valued Emotion</span>
                    </div>

                </div>
            </main>
        </>
    )
}

export default Dashboard

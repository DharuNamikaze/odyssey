"use client";
import React, { useState, useEffect } from "react";
import '../globals.css'
import '../calendar.css';
// import Heatmap from '@/components/charts/Heatmap'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import DonutChartCenterText from '../../../components/charts/DonutChartCenterText'
import BarChartHorizontalLogo from '../../../components/charts/BarChartHorizontalLogo'
import { HorizontalBarChart } from "../../../components/charts/BarChartHorizontal";
import { User, onAuthStateChanged } from 'firebase/auth'
import { getAuth } from '../../../lib/firebase';
import { LineChart } from '../../../components/charts/LineChart';
import { LineCustomChart } from '../../../components/charts/LineCustomChart'
import Levels from '../../../data/levels';
import Loader from "@/components/Loader";

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

    return (
        <>
            <main className="flex flex-col gap-10 overflow-hidden">
                <div className="grid grid-cols-1 gap-5 z-4 mb-10">
                    <div>
                        <h1 className="mt-5 text-3xl md:text-4xl font-bold p-0 mb-0">Summary</h1>
                        <p className="text-neutral-400 mt-1 text-base md:text-lg">Welcome back! Here's an overview of your Activites.</p>
                    </div>
                    {/* Stats + Calendar */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 z-5 p-4 rounded-2xl bg-gradient-to-tr from-black to-zinc-700 items-center border-[0.2px] border-neutral-700">
                        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4 md:gap-5 items-center text-sm">
                            <div className="rounded-2xl bg-gradient-to-br from-black to-neutral-800 flex flex-col py-6 pr-10 pl-5 text-base gap-1 justify-evenly w-full md:w-auto">
                                <h1 className="font-semibold text-xl">Streak 🔥</h1>
                                <span className="text-xl pt-3 text-neutral-400">1</span>
                            </div>
                            <div className="rounded-2xl bg-gradient-to-br from-black to-neutral-800 py-6 pr-10 pl-5 flex flex-col text-base gap-1 w-full md:w-auto">
                                <h1 className="font-semibold text-xl">Aura 🌟</h1>
                                <span className="text-xl pt-3 text-neutral-400">1223</span>
                            </div>
                            <div className="rounded-2xl bg-gradient-to-br from-black to-neutral-800 py-6 pr-10 pl-5 flex flex-col text-base gap-1 w-full md:w-auto">
                                <h1 className="font-semibold text-xl">Level 🚀</h1>
                                <span className="text-xl pt-3 text-neutral-400">{Levels[0][0]}</span>
                            </div>
                        </div>
                        <div className="w-full md:w-auto mt-4 md:mt-0 mx-auto max-md:flex max-md:justify-center">
                            <Calendar className="w-full" />
                        </div>
                    </div>
                    {/* Habits */}
                    <div className="p-4 md:p-8 rounded-2xl bg-gradient-to-tr from-black to-zinc-700 grid grid-cols-1 md:grid-cols-2 flex-1 gap-4 md:gap-2 border-[0.1px] border-neutral-700">
                        <div className="space-y-6 md:space-y-9">
                            <DonutChartCenterText />
                            <span className="flex justify-center font-semibold text-lg">Habits</span>
                        </div>
                        <div className="overflow-x-auto"><HorizontalBarChart /></div>
                    </div>
                    {/* Sleep Hours */}
                    <div className="p-4 md:p-8 rounded-2xl bg-gradient-to-tr from-black to-zinc-700 flex flex-col space-y-3 border-[0.2px] border-neutral-700">
                        <LineChart />
                        <span className="flex justify-center font-semibold text-lg">Sleep Hours</span>
                    </div>
                    {/* Emotion Timeline */}
                    <div className="p-4 md:p-8 rounded-2xl bg-gradient-to-tr from-black to-zinc-700 flex flex-col space-y-3 border-[0.2px] border-neutral-700">
                        <LineCustomChart />
                        <span className="flex justify-center font-semibold text-lg">Emotion Timeline</span>
                    </div>
                    {/* Valued Emotion */}
                    <div className="p-4 md:p-8 rounded-2xl bg-gradient-to-tr from-black to-zinc-700 flex flex-col space-y-3 border-[0.2px] border-neutral-700">
                        <BarChartHorizontalLogo />
                        <span className="flex justify-center font-semibold text-lg">Valued Emotion</span>
                    </div>
                    {/* Heatmap */}
                    <div className="p-4 md:p-8 rounded-2xl bg-gradient-to-tr from-black to-zinc-900 flex flex-col space-y-3 border-[0.2px] border-neutral-700">
                        {/* <Heatmap /> */}
                        <span className="flex justify-center font-semibold text-lg">Heatmap</span>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Dashboard

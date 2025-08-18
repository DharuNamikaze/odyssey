"use client";
import React, { useState, useEffect } from "react";
import '../globals.css'
import Loader from "@/components/Loader";
import '../calendar.css';
// import Heatmap from '@/components/charts/Heatmap'
import { Calendar } from 'react-calendar';
import { CalendarDays, TrendingUp, Zap, Trophy, Target, Clock } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import DonutChartCenterText from '../../../components/charts/DonutChartCenterText'
import BarChartHorizontalLogo from '../../../components/charts/BarChartHorizontalLogo'
import { HorizontalBarChart } from "../../../components/charts/BarChartHorizontal";
import { User, onAuthStateChanged } from 'firebase/auth'
import { getAuth } from '../../../lib/firebase';
import { LineChart } from '../../../components/charts/LineChart';
import { LineCustomChart } from '../../../components/charts/LineCustomChart'
import Levels from '../../../data/levels';
import { IconMoneybag } from "@tabler/icons-react";

const Dashboard = () => {
    const [date, setDate] = useState<Date | null>(null);
    const [bro, setBro] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true);

    // useEffect(() => {

    // }, [])

    // useEffect(() => {
    //     const handleResize = () => {
    //         setIsMobile(prev => true)
    //     }
    //     window.innerWidth <
    //         window.addEventListener('')
    // }
    // }, [])

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

    const Levels = [["Soul"]]; // Sample data for your Level component

    return (
        <>
            {/* Mobile Version */}

            {/* Desktop Version */}
            {loading ? <Loader /> :
                < main className="flex flex-col gap-10 overflow-hidden">
                    <div className="grid gap-5 z-4 mb-10">
                        <div>
                            <h1 className=" text-3xl md:text-4xl font-bold p-0 mb-0">Summary</h1>
                            <p className="text-neutral-400 mt-1 text-base md:text-lg">Welcome back! Here's an overview of your Activites.</p>
                        </div>
                        {/* Stats + Calendar */}
                        {/* Bento Grid Container */}
                        <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-2 auto-rows-auto ">
                            {/* Streak Card - Takes 2 columns */}
                            <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-6 border border-neutral-700 hover:border-neutral-500 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-500/20 rounded-lg">
                                        <Zap className="w-6 text-orange-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Streak 🔥</h2>
                                </div>
                                <p className="text-3xl font-bold text-orange-400">1</p>
                                <p className="text-neutral-400 text-sm mt-2">Day streak</p>
                            </div>

                            {/* Aura Card - Takes 2 columns */}
                            <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-6 border border-neutral-700 hover:border-neutral-600 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                                        <Trophy className="w-6 text-yellow-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Aura 🌟</h2>
                                </div>
                                <p className="text-3xl font-bold text-yellow-400">1,223</p>
                                <p className="text-neutral-400 text-sm mt-2">Total Aura</p>
                            </div>

                            {/* Level Card - Takes 2 columns */}
                            <div className="md:col-span-4 lg:col-span-2 bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-6 border border-neutral-700 hover:border-neutral-600 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Level 🚀</h2>
                                </div>
                                <p className="text-3xl font-bold text-blue-400">{Levels[0][0]}</p>
                                <p className="text-neutral-400 text-sm mt-2">Current level</p>
                            </div>

                            {/* Additional Stats Cards */}
                            <div className="md:col-span-2 lg:col-span-4  bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-6 border border-neutral-700 hover:border-neutral-600 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <Target className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Habits</h2>
                                </div>
                                <p className="text-3xl font-bold text-purple-400">2.4k</p>
                                <p className="text-neutral-400 text-sm mt-2">Followers</p>
                            </div>

                            {/* Calendar Card - Takes full width on mobile, 4 columns on larger screens */}
                            <div className="md:col-span-4 lg:col-span-2 lg:row-span-2    bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-6 border border-neutral-700 hover:border-neutral-600 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-500/20 rounded-lg">
                                        <CalendarDays className="w-6 h-6 text-green-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Achievements</h2>
                                </div>
                                <div className="bg-neutral-900/50 rounded-lg p-4 h-48 flex items-center justify-center">
                                    <CalendarDays className="w-24 h-24 text-neutral-600" />
                                    <span className="ml-4 text-neutral-400">Calendar component goes here</span>
                                </div>
                            </div>


                            {/* Time Spent Card */}
                            <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-6 border border-neutral-700 hover:border-neutral-600 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-500/20 rounded-lg">
                                        <Clock className="w-6 h-6 text-red-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Time Spent</h2>
                                </div>
                                <p className="text-3xl font-bold text-red-400">24h</p>
                                <p className="text-neutral-400 text-sm mt-2">This week</p>
                            </div>

                             {/* Some Spent Card */}
                            <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-6 border border-neutral-700 hover:border-neutral-600 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-600/50 rounded-lg">
                                        <IconMoneybag className="w-6 h-6 text-red-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Money Spent</h2>
                                </div>
                                <p className="text-3xl font-bold text-red-400">24h</p>
                                <p className="text-neutral-400 text-sm mt-2">This week</p>
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
                </main >
            }
        </>
    )
}

export default Dashboard

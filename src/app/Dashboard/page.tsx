"use client";
import React, { useState, useEffect } from "react";
import '../globals.css'
import '../calendar.css';
import Heatmap from '@/components/charts/Heatmap'
import { Calendar } from 'react-calendar';
import { CalendarDays, TrendingUp, Zap, Trophy, Target, Clock } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import DonutChartCenterText from '../../../components/charts/DonutChartCenterText'
import BarChartHorizontalLogo from '../../../components/charts/BarChartHorizontalLogo'
import { HorizontalBarChart } from "../../../components/charts/BarChartHorizontal";
import { LineChart } from '../../../components/charts/LineChart';
import { LineCustomChart } from '../../../components/charts/LineCustomChart'
import Levels from '../../../data/levels';
import { IconMoneybag } from "@tabler/icons-react";
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useHabits } from '../Habits/useHabits';

const Dashboard = () => {
    const [date, setDate] = useState<Date | null>(null);
    const { habits, stats, loading } = useHabits();
    const Levels = [["Soul"]]; // Sample data for your Level component

    // Transform habit data for charts
    const habitCategoryData = React.useMemo(() => {
        if (!habits || habits.length === 0) return [];

        const categoryCounts = habits.reduce((acc, habit) => {
            acc[habit.category] = (acc[habit.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(categoryCounts).map(([category, count]) => ({
            name: category.charAt(0).toUpperCase() + category.slice(1),
            value: count
        }));
    }, [habits]);

    const weeklyProgressData = React.useMemo(() => {
        if (!stats?.weeklyProgress) return [];

        return Object.entries(stats.weeklyProgress).map(([day, count]) => ({
            key: day.charAt(0).toUpperCase() + day.slice(1),
            value: count,
            color: getDayColor(day)
        })).sort((a, b) => b.value - a.value);
    }, [stats?.weeklyProgress]);

    const sleepHoursData = React.useMemo(() => {
        if (!stats) return [];

        // Generate last 7 days of sleep data based on habit completion
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date;
        }).reverse();

        return last7Days.map(date => ({
            date,
            value: Math.floor(Math.random() * 3) + 6 + (stats.successRate / 100) * 2 // Base 6-8 hours + bonus based on success rate
        }));
    }, [stats]);

    const emotionData = React.useMemo(() => {
        if (!stats) return [];

        // Generate emotion data based on habit performance
        const emotions = ['Happy', 'Focused', 'Energetic', 'Calm', 'Motivated'];
        const baseValues = [85, 78, 72, 68, 65];

        return emotions.map((emotion, index) => ({
            key: emotion,
            value: Math.max(50, baseValues[index] + (stats.successRate - 50) / 10),
            color: getEmotionColor(emotion)
        }));
    }, [stats]);

    function getDayColor(day: string): string {
        const colors = {
            monday: "#F5A5DB",
            tuesday: "#B89DFB",
            wednesday: "#758bcf",
            thursday: "#33C2EA",
            friday: "#FFC182",
            saturday: "#87db72",
            sunday: "#FF6B6B"
        };
        return colors[day as keyof typeof colors] || "#7e4cfe";
    }

    function getEmotionColor(emotion: string): string {
        const colors = {
            Happy: "#FFD93D",
            Focused: "#6BCF7F",
            Energetic: "#FF6B6B",
            Calm: "#4ECDC4",
            Motivated: "#A8E6CF"
        };
        return colors[emotion as keyof typeof colors] || "#7e4cfe";
    }

    return (
        <ProtectedRoute>
            <main className="flex flex-col gap-10 overflow-hidden">
                <div className="grid gap-5 z-4 mb-10">
                    <div>
                        <h1 className=" text-3xl md:text-4xl font-bold p-0 mb-0">Summary</h1>
                        <p className="text-neutral-400 mt-1 text-base md:text-lg">Welcome back! Here's an overview of your Activities.</p>
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
                            <p className="text-3xl font-bold text-orange-400">
                                {loading ? '...' : stats?.totalStreak || 0}
                            </p>
                            <p className="text-neutral-400 text-sm mt-2">Day streak</p>
                        </div>

                        {/* Aura Card - Takes 2 columns */}
                        <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-6 border border-neutral-700 hover:border-neutral-600 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                    <Trophy className="w-6 text-yellow-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Success Rate 🌟</h2>
                            </div>
                            <p className="text-3xl font-bold text-yellow-400">
                                {loading ? '...' : `${stats?.successRate || 0}%`}
                            </p>
                            <p className="text-neutral-400 text-sm mt-2">Today's completion</p>
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
                            <p className="text-3xl font-bold text-purple-400">
                                {loading ? '...' : stats?.totalHabits || 0}
                            </p>
                            <p className="text-neutral-400 text-sm mt-2">Total habits</p>
                        </div>

                        {/* Calendar Card - Takes full width on mobile, 4 columns on larger screens */}
                        <div className="md:col-span-4 lg:col-span-2 lg:row-span-2    bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-6 border border-neutral-700 hover:border-neutral-600 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <CalendarDays className="w-6 h-6 text-green-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">This Week</h2>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-4 h-48 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-400">
                                        {loading ? '...' : stats?.thisWeekCompleted || 0}
                                    </p>
                                    <p className="text-neutral-400 text-sm">completions</p>
                                </div>
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
                            <p className="text-3xl font-bold text-red-400">
                                {loading ? '...' : `${stats?.totalTimeHours || 0}h`}
                            </p>
                            <p className="text-neutral-400 text-sm mt-2">Total time</p>
                        </div>

                        {/* Some Spent Card */}
                        <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-black to-neutral-800 rounded-2xl p-6 border border-neutral-700 hover:border-neutral-600 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-600/50 rounded-lg">
                                    <IconMoneybag className="w-6 h-6 text-red-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Active Streaks</h2>
                            </div>
                            <p className="text-3xl font-bold text-red-400">
                                {loading ? '...' : stats?.activeStreaks || 0}
                            </p>
                            <p className="text-neutral-400 text-sm mt-2">Current streaks</p>
                        </div>
                    </div>


                    {/* Habits */}
                    <div className="p-4 md:p-8 rounded-2xl bg-gradient-to-tr from-black to-zinc-700 grid grid-cols-1 md:grid-cols-2 flex-1 gap-4 md:gap-2 border-[0.1px] border-neutral-700">
                        <div className="space-y-6 md:space-y-9">
                            <DonutChartCenterText
                                data={habitCategoryData}
                                title="Habits"
                                loading={loading}
                            />
                            <span className="flex justify-center font-semibold text-lg">Habits by Category</span>
                        </div>
                        <div className="overflow-x-auto">
                            <CustomHorizontalBarChart data={weeklyProgressData} />
                        </div>
                    </div>
                    {/* Sleep Hours */}
                    <div className="p-4 md:p-8 rounded-2xl bg-gradient-to-tr from-black to-zinc-700 flex flex-col space-y-3 border-[0.2px] border-neutral-700">
                        <CustomLineChart data={sleepHoursData} />
                        <span className="flex justify-center font-semibold text-lg">Sleep Hours</span>
                    </div>
                    {/* Emotion Timeline */}
                    <div className="p-4 md:p-8 rounded-2xl bg-gradient-to-tr from-black to-zinc-700 flex flex-col space-y-3 border-[0.2px] border-neutral-700">
                        <CustomLineChart data={sleepHoursData} />
                        <span className="flex justify-center font-semibold text-lg">Weekly Progress</span>
                    </div>
                    {/* Valued Emotion */}
                    <div className="p-4 md:p-8 rounded-2xl bg-gradient-to-tr from-black to-zinc-700 flex flex-col space-y-3 border-[0.2px] border-neutral-700">
                        <CustomBarChart data={emotionData} />
                        <span className="flex justify-center font-semibold text-lg">Emotional State</span>
                    </div>
                    {/* Heatmap */}
                    <div className="p-4 md:p-8 rounded-2xl bg-gradient-to-tr from-black to-zinc-900 flex flex-col space-y-3 border-[0.2px] border-neutral-700">
                        <Heatmap />
                        <span className="flex justify-center font-semibold text-lg">Heatmap</span>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    )
}

// Custom chart components that accept data props
const CustomHorizontalBarChart = ({ data }: { data: any[] }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-72 flex items-center justify-center text-neutral-400">
                <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p>No weekly progress data available</p>
                    <p className="text-sm text-neutral-500">Complete some habits to see your progress</p>
                </div>
            </div>
        );
    }
    return <HorizontalBarChart data={data} />;
};

const CustomLineChart = ({ data }: { data: any[] }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-72 flex items-center justify-center text-neutral-400">
                <div className="text-center">
                    <div className="text-4xl mb-2">📈</div>
                    <p>No trend data available</p>
                    <p className="text-sm text-neutral-500">Start tracking habits to see trends</p>
                </div>
            </div>
        );
    }
    return <LineChart data={data} />;
};

const CustomBarChart = ({ data }: { data: any[] }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-72 flex items-center justify-center text-neutral-400">
                <div className="text-center">
                    <div className="text-4xl mb-2">🎯</div>
                    <p>No emotional state data available</p>
                    <p className="text-sm text-neutral-500">Complete habits to see your emotional progress</p>
                </div>
            </div>
        );
    }
    return <BarChartHorizontalLogo data={data} />;
};

export default Dashboard

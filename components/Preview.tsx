import React from 'react'
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
import {
  IconFlame,
  IconChartLine,
  IconMedal,
  IconList,
  IconUsers,
  IconClock,
  IconHeart,
} from "@tabler/icons-react";
import chalk from 'chalk';

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
const items = [
  {
    title: "Streak & Progress Tracking",
    description: "Visualize your journey with streaks, heatmaps, and progress charts.",
    header: <Skeleton />,
    icon: <IconFlame className="h-4 w-4 text-red-500" />, // Represents habit streaks
  },
  {
    title: "Smart Insights & Trends",
    description: "AI-powered analytics for tracking patterns and self-improvement.",
    header: <Skeleton />,
    icon: <IconChartLine className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Gamification & Rewards",
    description: "Earn badges, milestones, and unlock levels as you progress.",
    header: <Skeleton />,
    icon: <IconMedal className="h-4 w-4 text-yellow-500" />,
  },
  {
    title: "Custom Habit Categories",
    description: "Create personalized habits with detailed tracking and reminders.",
    header: <Skeleton />,
    icon: <IconList className="h-4 w-4 text-green-500" />,
  },
  {
    title: "Community & Challenges",
    description: "Compete with friends or join challenges for extra motivation.",
    header: <Skeleton />,
    icon: <IconUsers className="h-4 w-4 text-purple-500" />,
  },
  {
    title: "Focus Mode & Deep Work",
    description: "Use Pomodoro timers and focus tools to stay on track.",
    header: <Skeleton />,
    icon: <IconClock className="h-4 w-4 text-orange-500" />,
  },
  {
    title: "Mood & Wellness Tracking",
    description: "Monitor emotional well-being alongside your habits.",
    header: <Skeleton />,
    icon: <IconHeart className="h-4 w-4 text-pink-500" />,
  },

];


const Preview = () => {
  return (
    <div className='flex justify-center items-center min-h-screen bg-black'>

      <BentoGrid className="max-w-4xl mx-auto mt-10 mb-10 md:mt-20">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    </div>
  )
}

export default Preview
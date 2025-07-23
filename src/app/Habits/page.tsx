'use client'
import React, { JSX, useState } from 'react';
import {
  Plus,
  Target,
  RefreshCw,
  X,
  Check,
  Calendar,
  TrendingUp,
  PersonStanding,
  Zap,
  Clock,
  ChevronRight,
  Star,
  Flame,
  Award,
  MoreHorizontal,
  Edit3,
  Trash2,
  TargetIcon,
  StarIcon,
  StarHalf
} from 'lucide-react';

interface Habit {
  id: number;
  name: string;
  type: 'new' | 'continue' | 'quit';
  streak: number;
  target: number;
  completed: boolean;
  category: 'wellness' | 'learning' | 'health' | 'skill' | 'digital';
}

interface Tab {
  id: string;
  label: string;
  count: number;
}

const Habits = () => {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: "Morning meditation", type: "new", streak: 7, target: 21, completed: true, category: "wellness" },
    { id: 2, name: "Read 30 minutes", type: "continue", streak: 45, target: 100, completed: false, category: "learning" },
    { id: 3, name: "Smoking", type: "quit", streak: 12, target: 30, completed: true, category: "health" },
    { id: 4, name: "Daily coding", type: "new", streak: 3, target: 14, completed: false, category: "skill" },
    { id: 5, name: "Social media scrolling", type: "quit", streak: 5, target: 21, completed: true, category: "digital" },
  ]);

  const getCategoryColor = (category: Habit['category']): string => {
    const colors = {
      wellness: "bg-green-500/20 text-green-400",
      learning: "bg-blue-500/20 text-blue-400",
      health: "bg-red-500/20 text-red-400",
      skill: "bg-purple-500/20 text-purple-400",
      digital: "bg-orange-500/20 text-orange-400"
    };
    return colors[category] || "bg-gray-500/20 text-gray-400";
  };

  const getTypeIcon = (type: Habit['type']): JSX.Element => {
    switch (type) {
      case 'new': return <Target className="w-4 h-4" />;
      case 'continue': return <RefreshCw className="w-4 h-4" />;
      case 'quit': return <X className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const filteredHabits: Habit[] = selectedTab === 'all' ? habits : habits.filter(habit => habit.type === selectedTab);

  return (
    <main className="text-white mb-[1.3vh] rounded-lg pt-5">
      <div className="max-w-7xl ">

        {/* Header Section */}
        <div className="mb-8">
          <span className=" gap-2 flex items-center">
            <h1 className="text-4xl font-bold mb-2">Your Habits</h1> <TargetIcon className='w-6 h-6 text-purple-600' />
          </span>
          <p className="text-neutral-400">Build better habits, one day at a time</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 h-auto gap-4 mb-8">
          <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 rounded-2xl p-6 border border-amber-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-6 h-6 text-amber-400" />
              <span className="text-amber-400 font-medium">Active Streaks</span>
            </div>
            <p className="text-3xl font-bold text-white">12</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-2xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-blue-400" />
              <span className="text-blue-400 font-medium">Completed Today</span>
            </div>
            <p className="text-3xl font-bold text-white">3/5</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <span className="text-purple-400 font-medium">Success Rate</span>
            </div>
            <p className="text-3xl font-bold text-white">78%</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <PersonStanding className="w-6 h-6 text-green-500" />
              <span className="text-green-500 font-medium">Lifestyle Raing</span>
            </div>
            <p className="text-3xl font-bold text-white flex items-center "><StarIcon className='w-9 h-9' /> <StarHalf className='w-9 h-9' /></p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Right Column - Habits List */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl border border-neutral-700">

              {/* Tabs */}
              <div className="flex border-b border-neutral-700">
                {([
                  { id: 'all', label: 'All Habits', count: habits.length },
                  { id: 'new', label: 'New', count: habits.filter(h => h.type === 'new').length },
                  { id: 'continue', label: 'Continue', count: habits.filter(h => h.type === 'continue').length },
                  { id: 'quit', label: 'Quit', count: habits.filter(h => h.type === 'quit').length }
                ] as Tab[]).map((tab: Tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${selectedTab === tab.id
                      ? 'border-white text-white'
                      : 'border-transparent text-neutral-400 hover:text-white'
                      }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>


              {/* Habits List */}
              <div className="p-6">
                <div className="space-y-4">
                  {filteredHabits.map((habit: Habit) => (
                    <div key={habit.id} className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-700 hover:border-neutral-600 transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">

                          {/* Habit Status */}
                          <div className={`p-2 rounded-lg ${habit.type === 'new' ? 'bg-green-500/20' :
                            habit.type === 'continue' ? 'bg-blue-500/20' :
                              'bg-red-500/20'
                            }`}>
                            {getTypeIcon(habit.type)}
                          </div>

                          {/* Habit Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">{habit.name}</h4>
                              <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(habit.category)}`}>
                                {habit.category}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-neutral-400">
                              <span className="flex items-center gap-1">
                                <Flame className="w-4 h-4" />
                                {habit.streak} day streak
                              </span>
                              <span>Target: {habit.target} days</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-neutral-400 mb-1">
                                <span>Progress</span>
                                <span>{Math.round((habit.streak / habit.target) * 100)}%</span>
                              </div>
                              <div className="w-full bg-neutral-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${habit.type === 'quit' ? 'bg-red-500' :
                                    habit.type === 'continue' ? 'bg-blue-500' :
                                      'bg-green-500'
                                    }`}
                                  style={{ width: `${Math.min((habit.streak / habit.target) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          {/* Today's Status */}
                          <button className={`p-2 rounded-lg transition-all ${habit.completed
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                            }`}>
                            <Check className="w-5 h-5" />
                          </button>

                          {/* More Options */}
                          <div className="relative">
                            <button className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-all">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Left Column - Habit Actions */}
          <div className="lg:col-span-1 space-y-6">

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl p-4 flex items-center gap-3 transition-all duration-200">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Start New Habit</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>

                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl p-4 flex items-center gap-3 transition-all duration-200">
                  <RefreshCw className="w-5 h-5" />
                  <span className="font-medium">Continue Old Habit</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>

                <button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl p-4 flex items-center gap-3 transition-all duration-200">
                  <X className="w-5 h-5" />
                  <span className="font-medium">Quit Bad Habit</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                This Week
              </h3>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="text-xs text-neutral-400 mb-2">{day}</div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${index < 4 ? 'bg-green-500/20 text-green-400' :
                      index === 4 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-neutral-700 text-neutral-500'
                      }`}>
                      {index < 4 ? '✓' : index === 4 ? '!' : ''}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-sm text-neutral-400">
                <span className="text-green-400 font-medium">4 days</span> completed this week
              </div>
            </div>

            {/* Motivation */}
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold">Daily Motivation</h3>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed">
                "Success is the sum of small efforts repeated day in and day out."
              </p>
              <p className="text-purple-400 text-xs mt-2">— Robert Collier</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Habits;
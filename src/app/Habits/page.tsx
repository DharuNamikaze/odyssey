'use client'
import React, { JSX, useState, useEffect } from 'react';
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
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useHabits, Habit, CreateHabitData } from './useHabits';
import HabitModal from './HabitModal';
import HabitActions from './HabitActions';

interface Tab {
  id: string;
  label: string;
  count: number;
}

const Habits = () => {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'quit'>('create');
  const [weekDays, setWeekDays] = useState<string[]>([]);

  const {
    habits,
    stats,
    loading,
    error,
    createHabit,
    toggleHabitCompletion,
    updateHabit,
    deleteHabit,
    setError
  } = useHabits();

  useEffect(() => {
    if (habits.length > 0) {
      // Find earliest habit creation date
      const creationDates = habits.map(h => h.createdAt).filter(Boolean);
      if (creationDates.length > 0) {
        try {
          const earliestDate = new Date(Math.min(...creationDates.map(d => new Date(d).getTime())));
          // Validate the date before using it
          if (!isNaN(earliestDate.getTime())) {
            const dynamicWeek = generateDynamicWeek(earliestDate);
            setWeekDays(dynamicWeek);
          } else {
            // Fallback to current week if date is invalid
            console.log('Earliest date invalid, using fallback');
            const currentWeek = generateCurrentWeek();
            setWeekDays(currentWeek);
          }
        } catch (error) {
          console.error('Error generating dynamic week:', error);
          // Fallback to current week
          const currentWeek = generateCurrentWeek();
          setWeekDays(currentWeek);
        }
      } else {
        // No habits with creation dates, use current week
        const currentWeek = generateCurrentWeek();
        setWeekDays(currentWeek);
      }
    } else {
      // No habits, use current week
      const currentWeek = generateCurrentWeek();
      setWeekDays(currentWeek);
    }
  }, [habits]);

  const generateDynamicWeek = (startDate: Date) => {
    // Validate input date
    if (!startDate || isNaN(startDate.getTime())) {
      console.error('Invalid start date:', startDate);
      return generateCurrentWeek();
    }

    const days = [];
    for (let i = 0; i < 7; i++) {
      try {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        // Validate the generated date
        if (isNaN(date.getTime())) {
          console.error('Invalid generated date at index:', i);
          continue;
        }

        const isFuture = date > new Date();
        const isPast = date < new Date();
        
        days.push({
          date: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
          isFuture,
          isPast,
          isToday: date.toDateString() === new Date().toDateString(),
          fullDate: date.toLocaleDateString('en-US', {  day: 'numeric', hour: 'numeric', minute: 'numeric' })
        });
      } catch (error) {
        console.error('Error processing date at index:', i, error);
        // Skip this day if there's an error
        continue;
      }
    }
    
    // If we couldn't generate any valid days, fallback to current week
    if (days.length === 0) {
      return generateCurrentWeek();
    }
    
    return days.map(day => day.dayName);
  };

  const generateCurrentWeek = () => {
    // Fallback to current week starting from Monday
    const today = new Date();
    const monday = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
    monday.setDate(diff);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDays.push(date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase());
    }
    return weekDays;
  };

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
      case 'quit': return <X className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const filteredHabits: Habit[] = selectedTab === 'all' ? habits : habits.filter(habit => habit.type === selectedTab);
  
  // Debug logging
  console.log('All habits:', habits);
  console.log('Selected tab:', selectedTab);
  console.log('Filtered habits:', filteredHabits);

  // Handler functions
  const handleCreateHabit = async (habitData: CreateHabitData) => {
    await createHabit(habitData);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleUpdateHabit = async (habitData: CreateHabitData) => {
    if (editingHabit) {
      await updateHabit(editingHabit.id, habitData);
      setEditingHabit(null);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    await deleteHabit(habitId);
  };

  const handleToggleCompletion = async (habitId: string, completed: boolean) => {
    await toggleHabitCompletion(habitId, completed);
  };

  const openCreateModal = () => {
    setEditingHabit(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const openQuitModal = () => {
    setEditingHabit(null);
    setModalMode('quit');
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
    setError(null);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="text-white mb-[1.3vh] rounded-lg pt-5">
          <div className="max-w-7xl">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-neutral-400">Loading your habits...</p>
              </div>
            </div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="text-white mb-[1.3vh] rounded-lg pt-5">
        <div className="max-w-7xl ">
          {/* Header Section */}
          <div className="mb-8">
            <span className=" gap-2 flex items-center">
              <h1 className="text-4xl font-bold mb-2">Your Habits</h1> <TargetIcon className='w-6 h-6 text-purple-600' />
            </span>
            <p className="text-neutral-400">Build better habits, one day at a time</p>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-300 hover:text-red-200 text-xs underline mt-1"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 h-auto gap-4 mb-8">
            <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 rounded-2xl p-6 border border-amber-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Flame className="w-6 h-6 text-amber-400" />
                <span className="text-amber-400 font-medium">Active Streaks</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats?.activeStreaks || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-2xl p-6 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6 text-blue-400" />
                <span className="text-blue-400 font-medium">Completed Today</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats?.completedToday || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-2xl p-6 border border-green-500/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <span className="text-green-400 font-medium">Success Rate</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats?.successRate || 0}%</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-purple-400" />
                <span className="text-purple-400 font-medium">Total Time</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats?.totalTimeHours || 0}h</p>
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
                <div className="p-6 h-full">
                  {filteredHabits.length === 0 ? (
                    <div className="text-center py-12 ">
                      <TargetIcon className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-neutral-300 mb-2">
                        {selectedTab === 'quit' ? 'No quit habits yet' : 'No habits yet'}
                      </h3>
                      <p className="text-neutral-500 mb-4">
                        {selectedTab === 'quit' 
                          ? 'Click the "Quit Bad Habit" button to start tracking habits you want to quit'
                          : 'Start building your first habit to see it here'
                        }
                      </p>
                      <button
                        onClick={selectedTab === 'quit' ? openQuitModal : openCreateModal}
                        className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white px-6 py-2 rounded-lg transition-all"
                      >
                        {selectedTab === 'quit' ? 'Quit Bad Habit' : 'Create Your First Habit'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredHabits.map((habit: Habit) => (
                        <div key={habit.id} className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-700 hover:border-neutral-600 transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">

                              {/* Habit Status */}
                              <div className={`p-2 rounded-lg ${habit.type === 'new' ? 'bg-green-500/20' : habit.type === 'quit' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
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
                                    className={`h-2 rounded-full ${habit.type === 'quit' ? 'bg-red-500' : habit.type === 'new' ? 'bg-green-500' : 'bg-blue-500'}`}
                                    style={{ width: `${Math.min((habit.streak / habit.target) * 100, 100)}%` }}
                                  ></div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              {/* Today's Status */}
                              <button
                                onClick={() => handleToggleCompletion(habit.id, !habit.completed)}
                                className={`p-2 rounded-lg transition-all ${habit.completed
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                                  }`}
                              >
                                <Check className="w-5 h-5" />
                              </button>

                              {/* More Options */}
                              <HabitActions
                                habit={habit}
                                onEdit={handleEditHabit}
                                onDelete={handleDeleteHabit}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                  <button
                    onClick={openCreateModal}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl p-4 flex items-center gap-3 transition-all duration-200"
                  >
                    <Target className="w-5 h-5" />
                    <span className="font-medium">Start New Habit</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>

                  <button
                    onClick={openQuitModal}
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl p-4 flex items-center gap-3 transition-all duration-200"
                  >
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
                  {weekDays.map((dayName, index) => {
                    try {
                      // Calculate the actual date for this day
                      const today = new Date();
                      const monday = new Date(today);
                      const dayOfWeek = today.getDay();
                      const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                      monday.setDate(diff);
                      const targetDate = new Date(monday);
                      targetDate.setDate(monday.getDate() + index);
                      
                      // Validate the target date
                      if (isNaN(targetDate.getTime())) {
                        console.error('Invalid target date generated for index:', index);
                        return (
                          <div key={dayName} className="text-center">
                            <div className="text-xs text-neutral-400 mb-1">{dayName}</div>
                            <div className="text-xs text-neutral-500 mb-2">--</div>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium bg-neutral-700 text-neutral-500 border border-neutral-600">
                              ?
                            </div>
                          </div>
                        );
                      }
                      
                      const targetDateString = targetDate.toISOString().split('T')[0];
                      
                      // Check if this is the day when the first habit was created
                      const isHabitCreationDay = (() => {
                        // Find the earliest habit creation date, filtering out invalid ones
                        const validCreationDates: Date[] = [];
                        
                        for (const habit of habits) {
                          if (habit.createdAt) {
                            let date: Date | null = null;
                            
                            try {
                              if (typeof habit.createdAt === 'object' && 'toDate' in habit.createdAt && typeof habit.createdAt.toDate === 'function') {
                                // Firebase Timestamp
                                date = (habit.createdAt as any).toDate();
                              } else if (typeof habit.createdAt === 'string') {
                                // ISO string
                                date = new Date(habit.createdAt);
                              } else if (habit.createdAt instanceof Date) {
                                // Already a Date object
                                date = habit.createdAt;
                              } else {
                                // Try to parse as timestamp
                                date = new Date(habit.createdAt);
                              }
                              
                              // Validate the date
                              if (date && !isNaN(date.getTime())) {
                                validCreationDates.push(date);
                              }
                            } catch (error) {
                              console.error('Error parsing habit creation date:', habit.createdAt, error);
                            }
                          }
                        }
                        
                        if (validCreationDates.length === 0) {
                          console.log('No valid creation dates found after filtering');
                          return false;
                        }
                        
                        try {
                          // Debug: Log the creation dates to see their format
                          console.log('Valid creation dates:', validCreationDates);
                          console.log('First creation date type:', typeof validCreationDates[0]);
                          console.log('First creation date value:', validCreationDates[0]);
                          
                          // Find the earliest date
                          const earliestCreationDate = new Date(Math.min(...validCreationDates.map(d => d.getTime())));
                          
                          if (isNaN(earliestCreationDate.getTime())) {
                            console.error('Invalid earliest creation date after parsing:', earliestCreationDate);
                            return false;
                          }
                          
                          const earliestDateString = earliestCreationDate.toISOString().split('T')[0];
                          return targetDateString === earliestDateString;
                        } catch (error) {
                          console.error('Error processing creation dates:', error);
                          console.error('Valid creation dates array:', validCreationDates);
                          return false;
                        }
                      })();
                      
                      // Get actual completion status for this day
                      const getDayCompletionStatus = () => {
                        if (isHabitCreationDay) return { isCompleted: false, count: 0 };
                        
                        // Count how many habits were completed on this specific date
                        let completedCount = 0;
                        habits.forEach(habit => {
                          if (habit.completedDates && Array.isArray(habit.completedDates)) {
                            if (habit.completedDates.includes(targetDateString)) {
                              completedCount++;
                            }
                          }
                        });
                        
                        return { isCompleted: completedCount > 0, count: completedCount };
                      };
                      
                      const { isCompleted, count } = getDayCompletionStatus();
                      
                      return (
                        <div key={dayName} className="text-center">
                          <div className="text-xs text-neutral-400 mb-1">{dayName}</div>
                          <div className="text-xs text-neutral-500 mb-2">
                            {targetDate.toLocaleDateString('en-US', { day: 'numeric' })}
                          </div>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                            isHabitCreationDay 
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' // Habit creation day
                              : isCompleted 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' // Completed
                                : 'bg-neutral-600 text-neutral-400 border border-neutral-500' // Past but not completed
                          }`}>
                            {isHabitCreationDay ? '!' : isCompleted ? count : '○'}
                          </div>
                        </div>
                      );
                    } catch (error) {
                      console.error('Error rendering day:', dayName, index, error);
                      // Fallback display for error cases
                      return (
                        <div key={dayName} className="text-center">
                          <div className="text-xs text-neutral-400 mb-1">{dayName}</div>
                          <div className="text-xs text-neutral-500 mb-2">--</div>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium bg-neutral-700 text-neutral-500 border border-neutral-600">
                            ?
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>

                <div className="text-sm text-neutral-400">
                  <span className="text-green-400 font-medium">{stats?.thisWeekCompleted || 0} completions</span> this week
                  {stats?.dynamicWeekStart && (
                    <div className="text-xs text-neutral-500 mt-1">
                      Week started: {new Date(stats.dynamicWeekStart).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                {/* Legend */}
                <div className="mt-3 pt-3 border-t border-neutral-700">
                  <div className="flex items-center justify-center gap-4 text-xs text-neutral-400">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500/20 border border-green-500/30 rounded"></div>
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500/20 border border-blue-500/30 rounded"></div>
                      <span>Habit Start</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-neutral-600 border border-neutral-500 rounded"></div>
                      <span>Past</span>
                    </div>
                  </div>
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

      {/* Habit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={modalMode === 'create' ? handleCreateHabit : handleUpdateHabit}
        habit={editingHabit}
        mode={modalMode}
      />
    </ProtectedRoute>
  );
};

export default Habits;
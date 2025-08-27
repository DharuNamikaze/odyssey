import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface Habit {
  id: string;
  name: string;
  type: 'new' | 'quit';
  streak: number;
  target: number;
  completed: boolean;
  category: 'wellness' | 'learning' | 'health' | 'skill' | 'digital';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completedDates: string[];
  weeklyProgress: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

export interface HabitStats {
  totalHabits: number;
  activeStreaks: number;
  completedToday: number;
  successRate: number;
  totalTimeHours: number;
  weeklyProgress: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
  thisWeekCompleted: number;
  totalTarget: number;
  totalStreak: number;
  // New fields for dynamic week tracking
  earliestHabitDate: number | null;
  dynamicWeekStart: string | null;
}

export interface CreateHabitData {
  name: string;
  type: 'new' | 'quit';
  category: 'wellness' | 'learning' | 'health' | 'skill' | 'digital';
  target: number;
}

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all habits
  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/habits');
      setHabits(response.data.habits);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch habit statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('/api/habits/stats');
      setStats(response.data.stats);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  // Create a new habit
  const createHabit = useCallback(async (habitData: CreateHabitData): Promise<Habit | null> => {
    try {
      setError(null);
      const response = await axios.post('/api/habits', habitData);
      const newHabit = response.data;
      setHabits(prev => [newHabit, ...prev]);
      await fetchStats(); // Refresh stats
      return newHabit;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create habit');
      return null;
    }
  }, [fetchStats]);

  // Update habit completion status
  const toggleHabitCompletion = useCallback(async (habitId: string, completed: boolean, date?: string) => {
    try {
      setError(null);
      const response = await axios.patch(`/api/habits/${habitId}`, { completed, date });
      
      setHabits(prev => prev.map(habit => {
        if (habit.id === habitId) {
          return {
            ...habit,
            completed,
            streak: response.data.streak,
            completedDates: response.data.completedDates,
            weeklyProgress: response.data.weeklyProgress
          };
        }
        return habit;
      }));

      await fetchStats(); // Refresh stats
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update habit');
      return null;
    }
  }, [fetchStats]);

  // Update habit details
  const updateHabit = useCallback(async (habitId: string, updateData: Partial<Habit>): Promise<boolean> => {
    try {
      setError(null);
      await axios.put(`/api/habits/${habitId}`, updateData);
      
      setHabits(prev => prev.map(habit => {
        if (habit.id === habitId) {
          return { ...habit, ...updateData };
        }
        return habit;
      }));

      await fetchStats(); // Refresh stats
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update habit');
      return false;
    }
  }, [fetchStats]);

  // Delete a habit
  const deleteHabit = useCallback(async (habitId: string): Promise<boolean> => {
    try {
      setError(null);
      await axios.delete(`/api/habits/${habitId}`);
      
      setHabits(prev => prev.filter(habit => habit.id !== habitId));
      await fetchStats(); // Refresh stats
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete habit');
      return false;
    }
  }, [fetchStats]);

  // Initialize data
  useEffect(() => {
    fetchHabits();
    fetchStats();
  }, [fetchHabits, fetchStats]);

  return {
    habits,
    stats,
    loading,
    error,
    fetchHabits,
    fetchStats,
    createHabit,
    toggleHabitCompletion,
    updateHabit,
    deleteHabit,
    setError
  };
};

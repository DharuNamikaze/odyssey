import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/firebaseAdmin';
import { verifyAuth } from '../../../../../lib/firebaseAdmin';

// Helper function to get week start based on habit creation date
function getWeekStart(createdDate: Date): Date {
  const dayOfWeek = createdDate.getDay();
  const weekStart = new Date(createdDate);
  weekStart.setDate(createdDate.getDate() - dayOfWeek);
  return weekStart;
}

// Helper function to calculate available completions from creation date forward
function calculateAvailableCompletions(habits: any[], weekStart: Date): number {
  const today = new Date();
  let totalCompletions = 0;
  
  habits.forEach(habit => {
    if (habit.createdAt) {
      const createdDate = habit.createdAt.toDate ? habit.createdAt.toDate() : new Date(habit.createdAt);
      
      // Only count completions from creation date forward
      if (createdDate <= today) {
        // Count completions for available days
        const availableDays = Math.ceil((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        totalCompletions += Math.min(availableDays, 7); // Cap at 7 days
      }
    }
  });
  
  return totalCompletions;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await verifyAuth(token);
    const userId = decodedToken.uid;

    const habitsRef = db.collection('habits');
    const querySnapshot = await habitsRef
      .where('userId', '==', userId)
      .get();
    
    const habits = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    })).sort((a: any, b: any) => {
      // Sort by createdAt descending (newest first)
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    // Calculate statistics
    const totalHabits = habits.length;
    const activeStreaks = habits.reduce((sum, habit) => sum + (habit.streak || 0), 0);
    const completedToday = habits.filter(habit => habit.completed).length;
    const totalTarget = habits.reduce((sum, habit) => sum + (habit.target || 0), 0);
    const totalStreak = habits.reduce((sum, habit) => sum + (habit.streak || 0), 0);
    
    // Calculate success rate
    const successRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    
    // Calculate weekly progress based on habit creation dates (FIXED)
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const weeklyProgress: Record<string, number> = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0
    };
    
    // Track week start dates for dynamic week calculation
    const weekStartDates: string[] = [];
    
    habits.forEach((habit: any) => {
      if (habit.createdAt) {
        const createdDate = habit.createdAt.toDate ? habit.createdAt.toDate() : new Date(habit.createdAt);
        const weekStart = getWeekStart(createdDate);
        weekStartDates.push(weekStart.toISOString().split('T')[0]);
        
        // Count actual completions for this week, not just habit existence
        if (habit.completedDates && Array.isArray(habit.completedDates)) {
          habit.completedDates.forEach((completionDate: string) => {
            try {
              const compDate = new Date(completionDate);
              const compDayOfWeek = compDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
              
              // Only count completions from this week
              const weekStart = new Date();
              weekStart.setDate(weekStart.getDate() - weekStart.getDay());
              weekStart.setHours(0, 0, 0, 0);
              
              if (compDate >= weekStart) {
                weeklyProgress[compDayOfWeek]++;
              }
            } catch (error) {
              console.error('Error processing completion date:', completionDate, error);
            }
          });
        }
      }
    });
    
    // Calculate this week's completion based on actual completions (FIXED)
    const thisWeekCompleted = Object.values(weeklyProgress).reduce((sum, count) => sum + count, 0);

    // Calculate total time (estimate based on habit type and streak)
    const totalTimeHours = habits.reduce((sum, habit) => {
      let timePerDay = 0;
      switch (habit.category) {
        case 'wellness': timePerDay = 0.5; break; // 30 minutes
        case 'learning': timePerDay = 1; break;   // 1 hour
        case 'health': timePerDay = 0.75; break;  // 45 minutes
        case 'skill': timePerDay = 1.5; break;    // 1.5 hours
        case 'digital': timePerDay = 0.25; break; // 15 minutes
        default: timePerDay = 0.5;
      }
      return sum + (timePerDay * (habit.streak || 0));
    }, 0);

    const stats = {
      totalHabits,
      activeStreaks,
      completedToday,
      successRate,
      totalTimeHours: Math.round(totalTimeHours),
      weeklyProgress,
      thisWeekCompleted,
      totalTarget,
      totalStreak,
      // Add new fields for dynamic week tracking
      earliestHabitDate: weekStartDates.length > 0 ? Math.min(...weekStartDates.map(d => new Date(d).getTime())) : null,
      dynamicWeekStart: weekStartDates.length > 0 ? getWeekStart(new Date(Math.min(...weekStartDates.map(d => new Date(d).getTime())))).toISOString().split('T')[0] : null
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching habit stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

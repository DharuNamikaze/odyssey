import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/firebaseAdmin';
import { verifyAuth } from '../../../../../lib/firebaseAdmin';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await verifyAuth(token);
    const userId = decodedToken.uid;

    const habitRef = db.collection('habits').doc(id);
    const habitDoc = await habitRef.get();

    if (!habitDoc.exists) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    if (habitDoc.data()?.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const updateData = {
      ...body,
      updatedAt: new Date()
    };

    await habitRef.update(updateData);
    
    return NextResponse.json({ message: 'Habit updated successfully' });
  } catch (error) {
    console.error('Error updating habit:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await verifyAuth(token);
    const userId = decodedToken.uid;

    const habitRef = db.collection('habits').doc(id);
    const habitDoc = await habitRef.get();

    if (!habitDoc.exists) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    if (habitDoc.data()?.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await habitRef.delete();
    
    return NextResponse.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await verifyAuth(token);
    const userId = decodedToken.uid;

    const habitRef = db.collection('habits').doc(id);
    const habitDoc = await habitRef.get();

    if (!habitDoc.exists) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    if (habitDoc.data()?.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { completed, date } = body;

    if (typeof completed !== 'boolean') {
      return NextResponse.json({ error: 'Invalid completed status' }, { status: 400 });
    }

    const habitData = habitDoc.data();
    if (!habitData) {
      return NextResponse.json({ error: 'Habit data not found' }, { status: 404 });
    }
    
    const today = date || new Date().toISOString().split('T')[0];
    
    let completedDates = habitData.completedDates || [];
    let streak = habitData.streak || 0;
    let weeklyProgress = habitData.weeklyProgress || {};

    if (completed) {
      // Add today to completed dates if not already there
      if (!completedDates.includes(today)) {
        completedDates.push(today);
      }
      
      // Update weekly progress
      const dayOfWeek = new Date(today).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      weeklyProgress[dayOfWeek] = true;
      
      // Calculate streak
      const sortedDates = completedDates.sort();
      let currentStreak = 0;
      let lastDate = new Date(today);
      
      for (let i = sortedDates.length - 1; i >= 0; i--) {
        const checkDate = new Date(sortedDates[i]);
        const diffTime = Math.abs(lastDate.getTime() - checkDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 1) {
          currentStreak++;
          lastDate = checkDate;
        } else {
          break;
        }
      }
      
      streak = currentStreak;
    } else {
      // Remove today from completed dates
      completedDates = completedDates.filter((d: string) => d !== today);
      
      // Update weekly progress
      const dayOfWeek = new Date(today).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      weeklyProgress[dayOfWeek] = false;
      
      // Recalculate streak
      const sortedDates = completedDates.sort();
      let currentStreak = 0;
      let lastDate = new Date();
      
      for (let i = sortedDates.length - 1; i >= 0; i--) {
        const checkDate = new Date(sortedDates[i]);
        const diffTime = Math.abs(lastDate.getTime() - checkDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 1) {
          currentStreak++;
          lastDate = checkDate;
        } else {
          break;
        }
      }
      
      streak = currentStreak;
    }

    await habitRef.update({
      completed,
      completedDates,
      streak,
      weeklyProgress,
      updatedAt: new Date()
    });
    
    return NextResponse.json({ 
      message: 'Habit status updated successfully',
      streak,
      completedDates,
      weeklyProgress
    });
  } catch (error) {
    console.error('Error updating habit status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

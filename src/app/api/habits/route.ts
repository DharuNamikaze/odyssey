import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/firebaseAdmin';
import { verifyAuth } from '../../../../lib/firebaseAdmin';
import { createHabitSchema, validateSchema } from '../../../../lib/validation';
import { logCreate } from '../../../../lib/auditLog';

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

    return NextResponse.json({ habits });
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await verifyAuth(token);
    const userId = decodedToken.uid;

    const body = await request.json();
    
    // Validate input with Zod
    const validation = validateSchema(createHabitSchema, body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 });
    }

    const { name, type, category, target } = validation.data!;

    const habitData = {
      userId,
      name,
      type,
      category,
      target,
      streak: 0,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedDates: [],
      weeklyProgress: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      }
    };

    const docRef = await db.collection('habits').add(habitData);
    
    // Audit log
    await logCreate(userId, 'habit', docRef.id, {
      ip: request.ip || request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    });
    
    return NextResponse.json({ 
      id: docRef.id,
      ...habitData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error creating habit:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

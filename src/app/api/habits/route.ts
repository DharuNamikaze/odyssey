import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/firebaseAdmin';
import { verifyAuth } from '../../../../lib/firebaseAdmin';
import { createHabitSchema, validateSchema } from '../../../../lib/validation';
import { logCreate } from '../../../../lib/auditLog';
import { UnauthorizedError, ValidationError, handleApiError } from '../../../../lib/errors';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      throw new UnauthorizedError('No authentication token provided');
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
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.message, details: errorResponse.details },
      { status: errorResponse.statusCode }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      throw new UnauthorizedError('No authentication token provided');
    }

    const decodedToken = await verifyAuth(token);
    const userId = decodedToken.uid;

    const body = await request.json();
    
    // Validate input with Zod
    const validation = validateSchema(createHabitSchema, body);
    if (!validation.success) {
      throw new ValidationError('Invalid habit data', validation.errors);
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
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.message, details: errorResponse.details },
      { status: errorResponse.statusCode }
    );
  }
}

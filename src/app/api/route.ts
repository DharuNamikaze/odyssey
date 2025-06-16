// app/api/user/route.ts (for PATCH request)
import { NextResponse, NextRequest } from 'next/server';
import { verifyFirebaseToken } from '../../../lib/middleware';
import { adminn } from '../../../lib/firebaseAdmin';

// PATCH METHOD !!!!!!!!!!!!!!

// CAN UPDATE VALUES !!!!!!!!

// PURIYUDHAA !!!!!!!!!!

export async function PATCH(req: NextRequest) {
  try {
    const uid = await verifyFirebaseToken(req);
    const body = await req.json();

    const allowedFields = ['Aura', 'Name', 'Level', 'Badges', 'HeatDays', 'RecentLogin'];
    const updateData: Record<string, any> = {};

    for (const key in body) {
      if (allowedFields.includes(key)) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 });
    }

    const userRef = adminn.firestore().collection('users').doc(uid);
    await userRef.update(updateData);

    return NextResponse.json({ message: 'User data updated successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
// app/api/user/route.ts (for GET request)
import { NextResponse } from 'next/server';
import { verifyFirebaseToken } from '../../../lib/middleware';
import { admin } from '../../../lib/firebaseAdmin';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const uid = await verifyFirebaseToken(req);

        const userRef = admin.firestore().collection('users').doc(uid);
        const doc = await userRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user: doc.data() }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}

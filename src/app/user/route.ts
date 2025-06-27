// app/api/user/route.ts (for GET request)
import { NextResponse } from 'next/server';
import { verifyFirebaseToken } from '../../../lib/middleware';
import { adminn } from '../../../lib/firebaseAdmin';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const uid = await verifyFirebaseToken(req);

        const userRef = adminn.firestore().collection('users').doc(uid);
        const doc = await userRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user: doc.data() }, { status: 200 });

    } catch (err: unknown) {
        let message = 'Unknown error';
        if (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string') {
            message = (err as { message: string }).message;
        }
        return NextResponse.json({ error: message }, { status: 401 });
    }
}

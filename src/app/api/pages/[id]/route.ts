import { NextResponse, NextRequest } from 'next/server';
import { verifyFirebaseToken } from '../../../../../lib/middleware';
import { admin } from '../../../../../lib/firebaseAdmin';

// Get a specific page
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const uid = await verifyFirebaseToken(req);
    const pageRef = admin.firestore().collection('pages').doc(params.id);
    const doc = await pageRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const pageData = doc.data();
    if (pageData?.userId !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const page = {
      id: doc.id,
      ...pageData
    };

    return NextResponse.json({ page });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
import { NextResponse, NextRequest } from 'next/server';
import { verifyFirebaseToken } from '../../../../lib/middleware';
import { adminn } from '../../../../lib/firebaseAdmin';
import { Page } from '../../Pages/types';

// GET all pages for a user
export async function GET(req: NextRequest) {
  try {
    const uid = await verifyFirebaseToken(req);
    const pagesRef = adminn.firestore().collection('pages');
    const snapshot = await pagesRef.where('userId', '==', uid).get();

    const pages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ pages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

// Create a new page
export async function POST(req: NextRequest) {
  try {
    const uid = await verifyFirebaseToken(req);
    const body = await req.json();

    // Create a new page object with only defined values
    const newPage: Partial<Omit<Page, 'id'>> = {
      title: body.title || '',
      content: body.content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: uid,
    };

    // Only add optional fields if they are defined
    if (body.parentId) newPage.parentId = body.parentId;
    if (body.icon) newPage.icon = body.icon;
    if (body.coverImage) newPage.coverImage = body.coverImage;

    const docRef = await adminn.firestore().collection('pages').add(newPage);
    const page = { id: docRef.id, ...newPage };

    return NextResponse.json({ page }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

// Update a page
export async function PATCH(req: NextRequest) {
  try {
    const uid = await verifyFirebaseToken(req);
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    const pageRef = adminn.firestore().collection('pages').doc(id);
    const doc = await pageRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    if (doc.data()?.userId !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Only update defined fields
    const cleanedUpdateData: Record<string, any> = {};
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanedUpdateData[key] = value;
      }
    });

    await pageRef.update({
      ...cleanedUpdateData,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ message: 'Page updated successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

// Delete a page
export async function DELETE(req: NextRequest) {
  try {
    const uid = await verifyFirebaseToken(req);
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    const pageRef = adminn.firestore().collection('pages').doc(id);
    const doc = await pageRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    if (doc.data()?.userId !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await pageRef.delete();

    return NextResponse.json({ message: 'Page deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
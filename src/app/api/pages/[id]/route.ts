import { NextResponse, NextRequest } from 'next/server';
import { verifyFirebaseToken } from '../../../../../lib/middleware';
import { adminn } from '../../../../../lib/firebaseAdmin';

// Get a specific page
export async function GET(req: NextRequest, context: any) {
  try {
    const { id } = await context.params;

    // Validate ID parameter
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid page ID' },
        { status: 400 }
      );
    }

    // Verify Firebase token
    let uid: string;
    try {
      uid = await verifyFirebaseToken(req);
    } catch (authError: any) {
      console.error('Authentication error:', authError.message);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    // Get page from Firestore
    const pageRef = adminn.firestore().collection('pages').doc(id);
    const doc = await pageRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    console.log('Document read time:', doc.readTime);

    const pageData = doc.data();

    // Check if pageData exists and has required fields
    if (!pageData) {
      return NextResponse.json(
        { error: 'Page data is corrupted' },
        { status: 500 }
      );
    }

    // Authorization check
    if (pageData.userId !== uid) {
      return NextResponse.json(
        { error: 'Unauthorized access to this page' },
        { status: 403 }
      );
    }
//getting the actual page details and page itself here
    const page = {
      id: doc.id,
      ...pageData
    };

    return NextResponse.json({ page }, { status: 200 });

  } catch (error: any) {
    console.error('API Error:', error);

    // diff types of errors
    if (error.code === 'permission-denied') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    if (error.code === 'not-found') {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Generic server error
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// delett method
export async function DELETE(req: NextRequest, context: any) {
  const { id } = await context.params;

  try {
    //type check first
    if (!id || typeof id !== 'string') return NextResponse.json({ error: "Invalid Page id" }, { status: 400 })

    // verify the token second
    let uid: string;
    try {
      uid = await verifyFirebaseToken(req)
    } catch (authErr: any) {
      console.log(authErr, "Error with req token auth")
      return NextResponse.json({ error: 'Authentication Failed with the Request' }, { status: 401 })
    }
    //and then do the thing

    const pageData = await adminn.firestore().collection('pages').doc(id).get();
    if (!pageData) return NextResponse.json({ error: "Page not found!" }, { status: 404 })

  } catch (error: unknown) {

    //at last case
    // generic error
    return (
      NextResponse.json({
        status: 500
      })
    )
  }

}
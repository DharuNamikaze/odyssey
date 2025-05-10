// lib/authMiddleware.ts
import { admin } from './firebaseAdmin';
import { NextRequest } from 'next/server';

export const verifyFirebaseToken = async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid token');
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    throw new Error('Unauthorized: Invalid token');
  }
};

// /pages/api/user.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebaseAdmin'; // your firebase-admin config file

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const userData = req.body;

      if (!userData.Uid) {
        return res.status(400).json({ error: 'UID missing' });
      }

      const userRef = db.collection('User').doc(userData.Uid);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        // User exists, update only recentLogin
        await userRef.update({
          RecentLogin: new Date().toISOString(),
        });
      } else {
        // New user, create entry
        await userRef.set(userData);
      }

      return res.status(200).json({ message: 'User synced successfully' });
    } catch (error) {
      console.error('[POST /api/user]', error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

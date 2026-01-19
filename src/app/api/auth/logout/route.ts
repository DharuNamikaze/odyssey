import { NextRequest, NextResponse } from 'next/server';
import { blacklistToken } from '../../../../../lib/tokenBlacklist';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    // Blacklist the token if it exists
    if (token) {
      blacklistToken(token, 3600000); // Blacklist for 1 hour (token expiry time)
    }
    
    // Create a response that clears the token cookie
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Clear the token cookie
    response.cookies.set('token', '', {
      path: '/',
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}

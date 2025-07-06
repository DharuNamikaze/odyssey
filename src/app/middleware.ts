import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Protect Dashboard and Pages routes
  if (!token && (request.nextUrl.pathname.startsWith('/Dashboard')
    || request.nextUrl.pathname.startsWith('/Pages')
    || request.nextUrl.pathname.startsWith('/Achievements')
    || request.nextUrl.pathname.startsWith('/Profile')
    || request.nextUrl.pathname.startsWith('/Habits')
    || request.nextUrl.pathname.startsWith('/GritEngine'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure the paths that should be protected by the middleware
export const config = {
  matcher: [
    '/',
    '/Dashboard/:path*',
    '/Pages/:path*'
  ]
};

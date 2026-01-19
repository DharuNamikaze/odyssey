import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Force HTTPS in production
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
      301
    );
  }

  const token = request.cookies.get('token')?.value;

  // If no token, redirect to main page (login)
  if (!token) {
    if (request.nextUrl.pathname.startsWith('/Dashboard') ||
        request.nextUrl.pathname.startsWith('/Pages') ||
        request.nextUrl.pathname.startsWith('/Achievements') ||
        request.nextUrl.pathname.startsWith('/Profile') ||
        request.nextUrl.pathname.startsWith('/Habits') ||
        request.nextUrl.pathname.startsWith('/GritEngine') ||
        request.nextUrl.pathname.startsWith('/Inbox') ||
        request.nextUrl.pathname.startsWith('/user')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // For now, we'll check if the token exists and has a reasonable length
  // Firebase ID tokens are typically very long (1000+ characters)
  if (token.length < 100) {
    // Token seems invalid, redirect to main page (login)
    if (request.nextUrl.pathname.startsWith('/Dashboard') ||
        request.nextUrl.pathname.startsWith('/Pages') ||
        request.nextUrl.pathname.startsWith('/Achievements') ||
        request.nextUrl.pathname.startsWith('/Profile') ||
        request.nextUrl.pathname.startsWith('/Habits') ||
        request.nextUrl.pathname.startsWith('/GritEngine') ||
        request.nextUrl.pathname.startsWith('/Inbox') ||
        request.nextUrl.pathname.startsWith('/user')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If we reach here, the user has a valid-looking token, so allow access to protected routes
  return NextResponse.next();
}

// Configure the paths that should be protected by the middleware
export const config = {
  matcher: [
    '/Dashboard/:path*',
    '/Pages/:path*',
    '/Achievements/:path*',
    '/Profile/:path*',
    '/Habits/:path*',
    '/GritEngine/:path*',
    '/Inbox/:path*',
    '/user/:path*'
  ]
};

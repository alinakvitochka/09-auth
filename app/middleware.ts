import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from './api/api';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

function matchRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  let isAuth = !!accessToken;

  // If no access token but refresh token exists, try to refresh
  if (!isAuth && refreshToken) {
    try {
      const res = await api.get('/auth/session', {
        headers: { Cookie: cookieStore.toString() },
      });
      if (res.status === 200) {
        isAuth = true;
      }
    } catch {
      isAuth = false;
    }
  }

  // If unauthenticated user tries to access private route → redirect to sign-in
  if (!isAuth && matchRoute(pathname, privateRoutes)) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If authenticated user tries to access public auth route → redirect to profile
  if (isAuth && matchRoute(pathname, publicRoutes)) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
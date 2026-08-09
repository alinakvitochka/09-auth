import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../app/api/api';
import { forwardSetCookie } from '../../app/api/_utils/cookies';
import { checkSession } from './serverApi';

export const privateRoutes = ['/profile', '/notes'];
export const publicRoutes = ['/sign-in', '/sign-up'];

function matchRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

export class Proxy {
  constructor(private request: NextRequest) {}

  public async handle(): Promise<NextResponse> {
    const { pathname } = this.request.nextUrl;

    // Skip API routes
    if (pathname.startsWith('/api')) {
      return NextResponse.next();
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    let isAuth = !!accessToken;

    // If no access token but refresh token exists, try to refresh the session
    if (!isAuth && refreshToken) {
      try {
        const result = await checkSession(cookieStore);
        if (result.success) {
          isAuth = true;
          const response = NextResponse.next();
          // Forward new cookies from the session API
          const res = await api.get('/auth/session', {
            headers: { Cookie: cookieStore.toString() },
          });
          forwardSetCookie(res.headers, response);
          return response;
        }
      } catch {
        isAuth = false;
      }
    }

    // If unauthenticated user tries to access private route → redirect to sign-in
    if (!isAuth && matchRoute(pathname, privateRoutes)) {
      return NextResponse.redirect(new URL('/sign-in', this.request.url));
    }

    // If authenticated user tries to access public auth route → redirect to profile
    if (isAuth && matchRoute(pathname, publicRoutes)) {
      return NextResponse.redirect(new URL('/profile', this.request.url));
    }

    return NextResponse.next();
  }
}
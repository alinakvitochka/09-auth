import { NextRequest, NextResponse } from 'next/server';
import { Proxy } from './api/proxy';

export async function middleware(request: NextRequest) {
  const proxy = new Proxy(request);
  return proxy.handle();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
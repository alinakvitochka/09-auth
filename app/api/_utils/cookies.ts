import { parseSetCookie } from 'cookie';
import { NextResponse } from 'next/server';

/**
 * Forward Set-Cookie headers from an external API response to a NextResponse.
 * Strips the Domain attribute so cookies work on localhost.
 */
export function forwardSetCookie(
  axiosHeaders: Record<string, string | string[]>,
  response: NextResponse,
): void {
  const setCookie = axiosHeaders['set-cookie'];
  if (!setCookie) return;

  const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

  for (const cookieStr of cookieArray) {
    const parsed = parseSetCookie(cookieStr);
    if (!parsed.name || !parsed.value) continue;

    // Build Set-Cookie without Domain (so it works on localhost)
    const parts = [`${parsed.name}=${parsed.value}`];
    if (parsed.path) parts.push(`Path=${parsed.path}`);
    if (parsed.maxAge) parts.push(`Max-Age=${parsed.maxAge}`);
    if (parsed.expires) parts.push(`Expires=${parsed.expires.toUTCString()}`);
    if (parsed.httpOnly) parts.push('HttpOnly');
    if (parsed.secure) parts.push('Secure');
    if (parsed.sameSite) parts.push(`SameSite=${parsed.sameSite}`);

    response.headers.append('Set-Cookie', parts.join('; '));
  }
}
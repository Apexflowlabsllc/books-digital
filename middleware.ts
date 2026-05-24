import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { supabaseConfigured } from '@/lib/env';

/* Route gates. Keep these regexes in lockstep with the page tree:
 * - PROTECTED: pages that require a signed-in user
 * - AUTH_ONLY: sign-in/sign-up pages that bounce signed-in users away
 */
const PROTECTED = /^\/account(\/|$)/;
const AUTH_ONLY = /^\/(sign-in|sign-up|forgot-password|reset-password)$/;

export async function middleware(request: NextRequest) {
  // Short-circuit when Supabase env vars are still placeholders — keeps
  // local dev usable before .env.local is wired.
  if (!supabaseConfigured) {
    return NextResponse.next({ request });
  }

  const { response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  if (PROTECTED.test(path) && !user) {
    const redirect = new URL('/sign-in', request.url);
    redirect.searchParams.set('next', path);
    return NextResponse.redirect(redirect);
  }

  if (AUTH_ONLY.test(path) && user) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals + static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)',
  ],
};

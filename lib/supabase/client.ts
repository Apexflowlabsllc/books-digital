'use client';

import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';

/* Browser Supabase client. Cookie domain is scoped to .apexflowlabs.com so
 * the session is shared across every brand subdomain — sign in once on
 * books.apexflowlabs.com, you're authed on apex digital, apparel, the
 * parent site, all of them. Localhost falls through to Supabase defaults.
 */
export function createClient() {
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookieOptions:
      typeof window !== 'undefined' &&
      window.location.hostname.endsWith('apexflowlabs.com')
        ? { domain: '.apexflowlabs.com' }
        : undefined,
  });
}

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/* Server Supabase client for Server Components, Route Handlers, Server
 * Actions. Cookie writes inside Server Components throw — that's fine,
 * middleware.ts handles the session refresh on every request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          /* Server Components can't mutate cookies — middleware handles refresh */
        }
      },
    },
    cookieOptions: env.cookieDomain ? { domain: env.cookieDomain } : undefined,
  });
}

// Centralized env access. Backend URL and site URL fall back to the
// SOP-locked production values when env vars are missing — this keeps dev
// from blowing up on URL parse errors before .env.local is wired up, and
// matches what Vercel will run with anyway.

const DEFAULT_BACKEND_URL = 'https://www.apexflowlabs.com';
const DEFAULT_SITE_URL = 'https://books.apexflowlabs.com';

// Supabase placeholders keep the app booting before .env.local is wired.
// middleware.ts short-circuits when the URL still contains "placeholder".
const PLACEHOLDER_SUPABASE_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_SUPABASE_ANON = 'placeholder-anon-key';

// Cross-subdomain cookie sharing. When the site is served from any
// *.apexflowlabs.com host, scope the auth cookie to the apex domain so a
// single sign-in works across every brand subdomain.
function detectCookieDomain(): string | undefined {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  try {
    const host = new URL(site).hostname;
    if (host.endsWith('apexflowlabs.com')) return '.apexflowlabs.com';
  } catch {
    /* malformed URL — fall through */
  }
  return undefined;
}

export const env = {
  backendUrl: (process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL).replace(/\/$/, ''),
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, ''),
  apiBearer: process.env.APEX_API_BEARER ?? '',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_SUPABASE_ANON,
  cookieDomain: detectCookieDomain(),
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? '',
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL ?? '',
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID ?? '',
};

// True only once real Supabase env vars are populated; used by middleware
// to short-circuit on dev placeholders.
export const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

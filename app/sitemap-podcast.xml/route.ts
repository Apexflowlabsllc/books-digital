import { env } from '@/lib/env';
import { urlsetXml } from '@/lib/xml';

export const revalidate = 3600;

// Until the backend exposes individual episodes via JSON (currently the
// /api/v1/podcast/feed endpoint only returns RSS feed URLs), this sitemap
// just lists the /podcast hub. Per-episode URLs will be added once the
// backend ships them.
export async function GET() {
  const siteUrl = env.siteUrl.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);

  return new Response(
    urlsetXml([
      { loc: `${siteUrl}/podcast`, lastmod: today, changefreq: 'daily', priority: 0.8 },
    ]),
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    },
  );
}

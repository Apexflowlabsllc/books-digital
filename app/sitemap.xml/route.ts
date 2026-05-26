import { env } from '@/lib/env';
import { getCatalog } from '@/lib/api';
import { sitemapIndexXml } from '@/lib/xml';

export const revalidate = 3600;

const BOOKS_PER_PAGE = 200;

// Sitemap index — points at paginated book sitemaps + series + the
// static page sitemap. The podcast surface was retired; podcast
// playback now lives on book detail pages only.
export async function GET() {
  const siteUrl = env.siteUrl.replace(/\/$/, '');

  const catalog = await getCatalog({ limit: 1 });
  const total = catalog?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / BOOKS_PER_PAGE));

  const today = new Date().toISOString().slice(0, 10);

  const entries: Array<{ loc: string; lastmod?: string }> = [
    { loc: `${siteUrl}/sitemap-static.xml`, lastmod: today },
    { loc: `${siteUrl}/sitemap-series.xml`, lastmod: today },
  ];

  for (let i = 1; i <= pages; i++) {
    entries.push({ loc: `${siteUrl}/sitemap-books-${i}.xml`, lastmod: today });
  }

  return new Response(sitemapIndexXml(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

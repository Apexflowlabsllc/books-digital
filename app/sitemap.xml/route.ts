import { env } from '@/lib/env';
import { sitemapIndexXml } from '@/lib/xml';

export const revalidate = 3600;

/**
 * Sitemap index.
 *
 * It used to compute a page count and advertise sitemap-books-1..4.xml. All
 * four returned 404, because the route behind them used a partial dynamic
 * segment (`sitemap-books-[page].xml`) which Next.js never matches — so the
 * whole book catalog was absent from sitemap discovery while the index
 * confidently listed it.
 *
 * One book sitemap now, no arithmetic, and it resolves.
 */
export async function GET() {
  const siteUrl = env.siteUrl.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);

  const entries: Array<{ loc: string; lastmod?: string }> = [
    { loc: `${siteUrl}/sitemap-static.xml`, lastmod: today },
    { loc: `${siteUrl}/sitemap-series.xml`, lastmod: today },
    { loc: `${siteUrl}/sitemap-books.xml`, lastmod: today },
  ];

  return new Response(sitemapIndexXml(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

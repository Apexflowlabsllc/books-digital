import { env } from '@/lib/env';
import { getCatalog } from '@/lib/api';
import { urlsetXml } from '@/lib/xml';

export const revalidate = 3600;

/**
 * EVERY BOOK, IN ONE SITEMAP THAT ACTUALLY RESOLVES.
 *
 * This replaces app/sitemap-books-[page].xml, which returned 404 for every
 * page. Next.js only treats a path segment as dynamic when the WHOLE segment
 * is the parameter — `[page]` — and that route's folder was
 * `sitemap-books-[page].xml`, a partial segment. It registered in the build
 * output, which is what made it look fine, and then matched nothing.
 *
 * The consequence was the entire book catalog being invisible to sitemap
 * discovery: the index advertised sitemap-books-1 through -4, all four 404'd,
 * and the site's only indexable sitemap URLs were 34 static and series pages.
 * Hundreds of book pages, none of them listed.
 *
 * Pagination is gone rather than fixed. It existed to keep each file under the
 * 50,000-URL sitemap limit; the catalog is 636. One file is simpler, has no
 * page arithmetic to get wrong, and stays correct until the library grows by
 * two orders of magnitude.
 */
export async function GET() {
  const siteUrl = env.siteUrl.replace(/\/$/, '');
  const catalog = await getCatalog();
  const books = catalog?.books ?? [];

  const today = new Date().toISOString().slice(0, 10);
  const entries = books.map((b) => ({
    loc: `${siteUrl}/books/${b.slug}`,
    lastmod: today,
    changefreq: 'weekly',
    // A book someone can actually buy is worth more than one still to come.
    priority: (b.formats ?? []).some((f) => f.available) ? 0.8 : 0.5,
  }));

  return new Response(urlsetXml(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

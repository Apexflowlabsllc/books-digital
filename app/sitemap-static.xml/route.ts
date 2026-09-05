import { env } from '@/lib/env';
import { urlsetXml } from '@/lib/xml';
import { CLUSTERS } from '@/lib/clusters';
import { PROBLEM_PAGES } from '@/lib/problems';

export const revalidate = 3600;

const STATIC_PATHS: Array<{ path: string; priority: number; changefreq: string }> = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/books', priority: 0.9, changefreq: 'daily' },
  { path: '/series', priority: 0.9, changefreq: 'weekly' },
  { path: '/about-brian', priority: 0.7, changefreq: 'monthly' },
  { path: '/brian-spiker-real-world-proof', priority: 0.9, changefreq: 'monthly' },
  { path: '/membership', priority: 0.8, changefreq: 'monthly' },
  { path: '/bundles', priority: 0.7, changefreq: 'monthly' },
  { path: '/founder-edition', priority: 0.6, changefreq: 'monthly' },
  { path: '/about', priority: 0.5, changefreq: 'monthly' },
  { path: '/contact', priority: 0.5, changefreq: 'yearly' },
  { path: '/press', priority: 0.5, changefreq: 'monthly' },
  { path: '/pulse', priority: 0.5, changefreq: 'monthly' },
  { path: '/problems', priority: 0.85, changefreq: 'weekly' },
  { path: '/encyclopedia', priority: 0.8, changefreq: 'weekly' },
];

// Topic cluster hubs — high-intent SEO landing pages. Each carries an
// H1-with-keyword + curated book grid + CollectionPage schema. Worth
// indexing aggressively.
const CLUSTER_PATHS = CLUSTERS.map((c) => ({
  path: `/books/${c.slug}`,
  priority: 0.85,
  changefreq: 'weekly',
}));

/* Problem pages. Only terms with a real definition, a real action and six or
 * more recorded phrasings get one, so this is a dozen entries rather than the
 * hundreds a keyword list would have produced. */
const PROBLEM_PATHS = PROBLEM_PAGES.map((p) => ({
  path: `/problems/${p.slug}`,
  priority: 0.8,
  changefreq: 'monthly',
}));

export function GET() {
  const siteUrl = env.siteUrl.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);

  const entries = [...STATIC_PATHS, ...CLUSTER_PATHS, ...PROBLEM_PATHS].map((s) => ({
    loc: `${siteUrl}${s.path}`,
    lastmod: today,
    priority: s.priority,
    changefreq: s.changefreq,
  }));

  return new Response(urlsetXml(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

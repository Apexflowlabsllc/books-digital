import { env } from '@/lib/env';
import { urlsetXml } from '@/lib/xml';
import { CLUSTERS } from '@/lib/clusters';

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
];

// Topic cluster hubs — high-intent SEO landing pages. Each carries an
// H1-with-keyword + curated book grid + CollectionPage schema. Worth
// indexing aggressively.
const CLUSTER_PATHS = CLUSTERS.map((c) => ({
  path: `/books/${c.slug}`,
  priority: 0.85,
  changefreq: 'weekly',
}));

export function GET() {
  const siteUrl = env.siteUrl.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);

  const entries = [...STATIC_PATHS, ...CLUSTER_PATHS].map((s) => ({
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

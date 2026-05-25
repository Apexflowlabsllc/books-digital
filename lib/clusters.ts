// Topic clusters used by the SEO hub pages at /books/<topic>. These
// are a separate dimension from the 12 series — they map readers'
// intent words (the things they actually google) to a curated set of
// books from across the catalog. Backend will expose
// /api/v1/books/clusters/<slug> to source the per-cluster book list.

export interface Cluster {
  slug: string; // URL slug — the thing in /books/<slug>
  name: string; // H1 label
  keyword: string; // SEO target phrase
  description: string; // hero subhead + meta description
  // Fallback series slugs when the backend cluster endpoint isn't yet
  // serving the topic — we filter the catalog by these series so a
  // hub page never renders empty during the rollout window.
  fallbackSeriesSlugs: string[];
}

export const CLUSTERS: Cluster[] = [
  {
    slug: 'discipline',
    name: 'Discipline books',
    keyword: 'discipline',
    description:
      'For the guy who has been "starting Monday" for years. Iron routines, crushing soft habits, standards over goals.',
    fallbackSeriesSlugs: ['discipline-blueprint'],
  },
  {
    slug: 'comeback',
    name: 'Comeback books',
    keyword: 'comeback',
    description:
      'For the guy who got knocked on his ass. Rebuilding identity, comebacks after failure, climbing out.',
    fallbackSeriesSlugs: ['comeback-blueprint'],
  },
  {
    slug: 'mindset',
    name: 'Mindset books',
    keyword: 'mindset',
    description:
      'For the guy whose brain will not shut up at 2 AM. Mental reset, reframing, owning the inner monologue.',
    fallbackSeriesSlugs: ['mind-reset-blueprint'],
  },
  {
    slug: 'parenting',
    name: 'Parenting books for fathers',
    keyword: 'parenting',
    description:
      'For the dad raising boys in a world that wants them soft. Real-world fatherhood, no soft-launch advice.',
    fallbackSeriesSlugs: ['connection-blueprint'],
  },
  {
    slug: 'faith',
    name: 'Faith and self-development',
    keyword: 'faith',
    description:
      'For the man building a life with weight to it. Faith without performance — work, family, principles aligned.',
    fallbackSeriesSlugs: ['purpose-blueprint'],
  },
  {
    slug: 'business',
    name: 'Business books for operators',
    keyword: 'business',
    description:
      'For the guy who reads business books and is broke. Operator economics — not theory, not coaching.',
    fallbackSeriesSlugs: ['success-blueprint'],
  },
  {
    slug: 'relationships',
    name: 'Relationship books for men',
    keyword: 'relationships',
    description:
      'For the guy whose wife says "we need to talk." Friendship, marriage, family — built from real conversation.',
    fallbackSeriesSlugs: ['connection-blueprint'],
  },
  {
    slug: 'money',
    name: 'Money books for the rest of us',
    keyword: 'money',
    description:
      'For the guy who reads finance books and stays broke. Income, leverage, cash flow — the boring kind that works.',
    fallbackSeriesSlugs: ['success-blueprint'],
  },
  {
    slug: 'productivity',
    name: 'Productivity for operators',
    keyword: 'productivity',
    description:
      'For the guy with all the motivation and no progress. Routines, momentum, what to actually do at 6 AM.',
    fallbackSeriesSlugs: ['discipline-blueprint', 'unstoppable-blueprint'],
  },
  {
    slug: 'marriage',
    name: 'Marriage books for men',
    keyword: 'marriage',
    description:
      'For the guy a few years into the long haul. Real marriage — pressure, ritual, repair, staying picked.',
    fallbackSeriesSlugs: ['connection-blueprint'],
  },
];

export const CLUSTER_SLUGS = new Set(CLUSTERS.map((c) => c.slug));

export function getClusterBySlug(slug: string): Cluster | null {
  return CLUSTERS.find((c) => c.slug === slug) ?? null;
}

export function isClusterSlug(slug: string): boolean {
  return CLUSTER_SLUGS.has(slug);
}

// Siblings to cross-link at the bottom of every cluster page.
export function getSiblings(slug: string, count = 4): Cluster[] {
  return CLUSTERS.filter((c) => c.slug !== slug).slice(0, count);
}

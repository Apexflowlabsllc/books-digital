import type { Metadata } from 'next';
import { env } from './env';
import type { BookDetail, Format, SeriesDetail } from './types';
import { imageProxy } from './utils';

const SITE_NAME = 'Apex Flow Publishing House';
const DEFAULT_DESCRIPTION =
  'A 636-title war-manual library across 12 series, releasing book by book. Written by Brian Spiker — founder of Spiker Carpet and Tile Care, operating since 2013 (13 years).';

// Canonical Spiker reference — used in every Person sameAs + isBasedOn pull.
const SPIKER_URL = 'https://spikercarpetandtilecare.com';
const APEX_LABS_URL = 'https://apexflowlabs.com';

export function buildMetadata(input: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  type?: 'website' | 'article' | 'book';
}): Metadata {
  const url = `${env.siteUrl.replace(/\/$/, '')}${input.path}`;
  const description = input.description ?? DEFAULT_DESCRIPTION;
  const image = input.image ?? `${env.siteUrl.replace(/\/$/, '')}/og-default.jpg`;

  return {
    title: input.title,
    description,
    metadataBase: new URL(env.siteUrl || 'https://books.apexflowlabs.com'),
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description,
      url,
      siteName: SITE_NAME,
      type: input.type === 'book' ? 'book' : input.type ?? 'website',
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  };
}

// Fallback JSON-LD generators — used when backend /api/v1/seo/* is unavailable
// so pages still ship structured data per Master §6.4. Backend response, when
// present, replaces these entirely.

// Entity unification: every Person reference points at the same @id, and the
// sameAs array glues Brian-the-author to Brian-the-13-year-business-operator
// across every domain so crawlers + LLMs treat them as one entity.
const BRIAN_PERSON = {
  '@type': 'Person',
  '@id': `${APEX_LABS_URL}/about-brian#person`,
  name: 'Brian Spiker',
  url: `${env.siteUrl}/about-brian`,
  jobTitle: 'Founder & Author',
  description:
    'Founder of Spiker Carpet and Tile Care (operating since 2013, 13 years). Author of Apex Flow Publishing House (a 636-title library across 12 series). Founder of Apex Flow Labs.',
  worksFor: [
    {
      '@type': 'Organization',
      name: 'Spiker Carpet and Tile Care',
      url: SPIKER_URL,
      foundingDate: '2013',
    },
    { '@type': 'Organization', name: 'Apex Flow Labs', url: APEX_LABS_URL },
    { '@type': 'Organization', name: SITE_NAME, url: env.siteUrl },
  ],
  sameAs: [
    SPIKER_URL,
    APEX_LABS_URL,
    env.siteUrl,
    'https://www.google.com/maps/place/Spiker+Carpet+and+Tile+Care',
    'https://www.youtube.com/@apexrawmotivation',
  ],
};

const APEX_ORG = {
  '@type': 'Organization',
  '@id': `${env.siteUrl}#org`,
  name: SITE_NAME,
  url: env.siteUrl,
  logo: `${env.siteUrl}/logo.png`,
  founder: BRIAN_PERSON,
  parentOrganization: {
    '@type': 'Organization',
    name: 'Apex Flow Labs',
    url: APEX_LABS_URL,
  },
};

// LocalBusiness schema for Spiker — services list is the canonical authorized
// set. Never invent services beyond these.
export const SPIKER_BUSINESS = {
  '@type': 'LocalBusiness',
  '@id': `${SPIKER_URL}#business`,
  name: 'Spiker Carpet and Tile Care',
  url: SPIKER_URL,
  foundingDate: '2013',
  description:
    'Carpet cleaning and protection, upholstery cleaning and protection, tile and grout cleaning and sealing, pet odor removal with enzyme treatment for urine and microbiological oil treatment for wet-dog smells.',
  founder: { '@id': `${APEX_LABS_URL}/about-brian#person` },
  serviceType: [
    'Carpet cleaning',
    'Carpet protection',
    'Upholstery cleaning',
    'Upholstery protection',
    'Tile and grout cleaning',
    'Tile and grout sealing',
    'Pet odor removal',
    'Urine enzyme treatment',
    'Microbiological oil treatment',
  ],
};

// isBasedOn provenance — every book/series/article/page derives authority from
// Brian's 13 years of running Spiker Carpet and Tile Care.
const SPIKER_BASED_ON = {
  '@type': 'CreativeWork',
  '@id': `${SPIKER_URL}#operations`,
  name: '13 years running Spiker Carpet and Tile Care',
  url: SPIKER_URL,
};


/**
 * Availability must reflect reality, not optimism.
 *
 * Every Offer emitted here was hardcoded to `InStock`. Audited against the
 * catalog: 252 of the 636 books have no purchasable format at all. Their pages
 * correctly tell a human "Coming soon" — and then told Google, and every
 * answer engine, that three formats were in stock. Declaring unavailable
 * products as InStock is a structured-data violation that carries a manual
 * action, and it makes an AI answer confidently wrong about what can be
 * bought.
 *
 * The `formats` array on BookDetail already carries the truth per format.
 */
function availabilityFor(book: BookDetail, format: Format): string {
  const f = (book.formats ?? []).find((x) => x.format === format);
  return f?.available
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';
}

export function fallbackBookSchema(book: BookDetail): unknown[] {
  const url = `${env.siteUrl}/books/${book.slug}`;
  const image = imageProxy(book.cover_r2_key);
  const reviews = (book.reviews ?? []).slice(0, 3).map((r) => ({
    '@type': 'Review',
    reviewBody: r.body,
    author: { '@type': 'Person', name: r.author },
    ...(r.rating
      ? { reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 } }
      : {}),
  }));

  const audiobookFormat =
    book.audiobook?.full_url || book.audiobook?.sample_url
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'Audiobook',
            name: book.title,
            url,
            duration: book.audiobook.duration_seconds
              ? `PT${Math.round(book.audiobook.duration_seconds / 60)}M`
              : undefined,
            author: BRIAN_PERSON,
          },
        ]
      : [];

  const faq =
    book.faq && book.faq.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: book.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]
      : [];

  // Per-format workExample[] — drives Google Rich Results "where to
  // buy" + "available formats" surfaces. Prices come from the
  // BookDetail (defaulted in adapter when backend hasn't shipped the
  // *DirectPriceUsd fields yet).
  const workExample = [
    book.paperback_isbn
      ? {
          '@type': 'Book',
          bookFormat: 'https://schema.org/Paperback',
          isbn: book.paperback_isbn,
          offers: {
            '@type': 'Offer',
            price: book.paperback_direct_price_usd.toFixed(2),
            priceCurrency: 'USD',
            availability: availabilityFor(book, 'paperback'),
          },
        }
      : null,
    book.hardcover_isbn
      ? {
          '@type': 'Book',
          bookFormat: 'https://schema.org/Hardcover',
          isbn: book.hardcover_isbn,
          offers: {
            '@type': 'Offer',
            price: book.hardcover_direct_price_usd.toFixed(2),
            priceCurrency: 'USD',
            availability: availabilityFor(book, 'hardcover'),
          },
        }
      : null,
    {
      '@type': 'Book',
      bookFormat: 'https://schema.org/EBook',
      offers: {
        '@type': 'Offer',
        price: book.ebook_direct_price_usd.toFixed(2),
        priceCurrency: 'USD',
        availability: availabilityFor(book, 'ebook'),
      },
    },
    {
      '@type': 'Book',
      bookFormat: 'https://schema.org/AudiobookFormat',
      offers: {
        '@type': 'Offer',
        price: book.audiobook_direct_price_usd.toFixed(2),
        priceCurrency: 'USD',
        availability: availabilityFor(book, 'audiobook'),
      },
    },
  ].filter(Boolean);

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      url,
      image,
      author: BRIAN_PERSON,
      publisher: APEX_ORG,
      inLanguage: 'en',
      description: book.description,
      ...(book.paperback_isbn ? { isbn: book.paperback_isbn } : {}),
      bookFormat: 'https://schema.org/EBook',
      isBasedOn: SPIKER_BASED_ON,
      workExample,
      ...(reviews.length ? { review: reviews } : {}),
    },
    { '@context': 'https://schema.org', ...BRIAN_PERSON },
    { '@context': 'https://schema.org', ...APEX_ORG },
    ...audiobookFormat,
    ...faq,
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Books',
          item: `${env.siteUrl}/books`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: book.series_name,
          item: `${env.siteUrl}/series/${book.series_slug}`,
        },
        { '@type': 'ListItem', position: 3, name: book.title, item: url },
      ],
    },
  ];
}

export function fallbackSeriesSchema(series: SeriesDetail): unknown[] {
  const url = `${env.siteUrl}/series/${series.slug}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${series.name} — Apex Flow Publishing House`,
      url,
      isBasedOn: SPIKER_BASED_ON,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: series.books?.length ?? series.book_count,
        itemListElement: (series.books ?? []).slice(0, 25).map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${env.siteUrl}/books/${b.slug}`,
          name: b.title,
        })),
      },
    },
    { '@context': 'https://schema.org', ...BRIAN_PERSON },
    { '@context': 'https://schema.org', ...APEX_ORG },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Series', item: `${env.siteUrl}/series` },
        { '@type': 'ListItem', position: 2, name: series.name, item: url },
      ],
    },
  ];
}

export function fallbackPageSchema(path: string, title: string): unknown[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      url: `${env.siteUrl}${path}`,
      isPartOf: APEX_ORG,
    },
    { '@context': 'https://schema.org', ...BRIAN_PERSON },
    { '@context': 'https://schema.org', ...APEX_ORG },
  ];
}

/* CollectionPage schema for topic cluster hubs (/books/<topic>).
 * mainEntity is the list of Books in this cluster — gives Google a
 * structured "this page is about <topic>, here are the books" signal
 * for the SEO landing surface.
 */
interface ClusterLike {
  slug: string;
  name: string;
  keyword: string;
  description: string;
}
interface ClusterBookLike {
  slug: string;
  title: string;
}
export function fallbackClusterSchema(
  cluster: ClusterLike,
  books: ClusterBookLike[],
): unknown[] {
  const url = `${env.siteUrl}/books/${cluster.slug}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Apex Publishing — ${cluster.name}`,
      url,
      description: cluster.description,
      isPartOf: APEX_ORG,
      mainEntity: books.slice(0, 25).map((b) => ({
        '@type': 'Book',
        name: b.title,
        url: `${env.siteUrl}/books/${b.slug}`,
        author: BRIAN_PERSON,
        publisher: APEX_ORG,
      })),
    },
    { '@context': 'https://schema.org', ...BRIAN_PERSON },
    { '@context': 'https://schema.org', ...APEX_ORG },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Books', item: `${env.siteUrl}/books` },
        { '@type': 'ListItem', position: 2, name: cluster.name, item: url },
      ],
    },
  ];
}

/**
 * COLLECTION PAGES: the biggest structured-data gap on the site.
 *
 * Audited live: /books and /series carried only Organization, Person and
 * WebPage. 636 books listed across twelve series and not one ItemList,
 * CollectionPage or BreadcrumbList between them — so an engine crawling the
 * catalog saw a page of links with no statement of what the list IS, what is
 * in it, or where it sits in the site.
 *
 * Book detail pages were already strong (Book, Offer, BreadcrumbList, FAQPage,
 * Audiobook). This brings the collection pages up to the same standard.
 *
 * Deliberately NOT emitted: AggregateRating and Review. The catalog API
 * returns no rating or review data for any book, and inventing them is both
 * dishonest and a manual-action risk. Those go in the moment real reviews
 * exist.
 */
export function collectionPageSchema(input: {
  path: string;
  name: string;
  description: string;
  /** Items in list order. `url` should be site-relative. */
  items: { url: string; name: string }[];
  /** Optional breadcrumb trail above this page. */
  parent?: { path: string; name: string };
}): unknown[] {
  const site = env.siteUrl;
  const abs = (p: string) => `${site}${p.startsWith('/') ? p : `/${p}`}`;

  const crumbs: { name: string; path: string }[] = [{ name: 'Home', path: '/' }];
  if (input.parent) crumbs.push({ name: input.parent.name, path: input.parent.path });
  crumbs.push({ name: input.name, path: input.path });

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${abs(input.path)}#collection`,
      url: abs(input.path),
      name: input.name,
      description: input.description,
      isPartOf: { '@id': `${site}/#website` },
      about: { '@id': `${site}/#organization` },
      mainEntity: {
        '@type': 'ItemList',
        name: input.name,
        numberOfItems: input.items.length,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement: input.items.map((it, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: abs(it.url),
          name: it.name,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: abs(c.path),
      })),
    },
  ];
}

/**
 * EVERY BOOK IS A 90-DAY COURSE — so say so in a way a machine can read.
 *
 * The store's whole claim is that these are not books with a plan bolted on
 * but sequenced 90-day programmes. Nothing in the markup said that, which
 * meant the catalog could never surface for "90 day discipline course" or
 * "structured programme to stop procrastinating" — queries where the intent
 * matches this product far better than "self help book" does.
 *
 * Course + hasCourseInstance with a real repeatCount and duration states it
 * plainly. Requires no data the catalog does not already have.
 */
export function bookCourseSchema(book: {
  slug: string;
  title: string;
  description?: string;
  series_name?: string;
}): unknown {
  const site = env.siteUrl;
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${site}/books/${book.slug}#course`,
    name: `${book.title} — 90-day programme`,
    description:
      book.description ??
      `A structured 90-day programme. Ninety numbered days, each with one truth, one action and a reflection.`,
    url: `${site}/books/${book.slug}`,
    provider: { '@id': `${site}/#organization` },
    inLanguage: 'en',
    isAccessibleForFree: false,
    educationalLevel: 'Beginner to advanced',
    teaches: book.series_name ?? undefined,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'https://schema.org/SelfPaced',
      courseWorkload: 'PT20M',
      repeatCount: 90,
      repeatFrequency: 'Daily',
    },
  };
}

import { env } from './env';
import type {
  BookDetail,
  BookSummary,
  CatalogResponse,
  FormatPrice,
  JsonLdBundle,
  MembershipAccess,
  PodcastEpisodeDetail,
  PodcastFeedResponse,
  ReviewExcerpt,
  SeriesDetail,
  SeriesSummary,
  Wave,
} from './types';

interface BackendOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
  cookie?: string;
}

// Single backend helper. Default cache: 5 min ISR with backend bearer auth.
// Per Master SOP, no direct DB access from frontend — only /api/v1/*.
export async function backend<T>(path: string, opts: BackendOptions = {}): Promise<T> {
  const { revalidate = 300, tags, cookie, headers, ...rest } = opts;

  const url = `${env.backendUrl}${path}`;

  const composedHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(env.apiBearer ? { Authorization: `Bearer ${env.apiBearer}` } : {}),
    ...(cookie ? { Cookie: cookie } : {}),
    ...((headers as Record<string, string>) ?? {}),
  };

  const next: { revalidate?: number | false; tags?: string[] } = {};
  if (revalidate !== undefined) next.revalidate = revalidate;
  if (tags) next.tags = tags;

  const res = await fetch(url, {
    ...rest,
    headers: composedHeaders,
    next,
  });

  if (!res.ok) {
    throw new BackendError(`backend ${path} ${res.status}`, res.status, path);
  }

  return res.json() as Promise<T>;
}

export class BackendError extends Error {
  constructor(message: string, public status: number, public path: string) {
    super(message);
    this.name = 'BackendError';
  }
}

// Safe variant — never throws, returns null on failure. Use on non-critical
// surfaces (Spiker reviews on book page, etc.) so a backend hiccup doesn't
// 500 the whole page.
export async function backendSafe<T>(path: string, opts: BackendOptions = {}): Promise<T | null> {
  try {
    return await backend<T>(path, opts);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // Compact dev log — most failures here are "backend endpoint not yet
      // built" (per the Phase 1 TODO list in guideline.md), so a one-liner
      // is more useful than a stack trace.
      if (err instanceof BackendError) {
        console.warn(`[backendSafe] ${path} → ${err.status}`);
      } else if (err instanceof Error) {
        console.warn(`[backendSafe] ${path} → ${err.message}`);
      } else {
        console.warn(`[backendSafe] ${path} → unknown error`);
      }
    }
    return null;
  }
}

// ---- Backend adapter ----------------------------------------------------
//
// Live backend response shape (as of 2026-05-24) does not match `lib/types.ts`.
// The adapter below normalises raw responses into the existing types so every
// page/component keeps working untouched.

interface RawBookSummary {
  bookId: string;
  slug: string;
  title: string;
  seriesNumber: number;
  seriesName: string;
  seriesColor: string;
  bookNumber: number;
  wave: Wave;
  backHeadline?: string;
  backSubhead?: string;
  backCallout?: string[];
  nicheTag?: string;
  url?: string;
}

interface RawCatalogResponse {
  count: number;
  books: RawBookSummary[];
  generatedAt?: string;
}

interface RawSeriesSummary {
  number: number;
  name: string;
  fullTitle: string;
  slug: string;
  color: string;
  dark?: string;
  light?: string;
  label?: string;
  wave: Wave;
  promise: string;
  bookCount: number;
  backHeadline?: string;
  backSubhead?: string;
  backCallout?: string[];
}

interface RawBookDetail extends RawBookSummary {
  series: {
    number: number;
    name: string;
    label?: string;
    color: string;
    dark?: string;
    light?: string;
    wave: Wave;
    promise: string;
  };
  backCover: {
    headline: string;
    subhead: string;
    body: string;
    bullets: Array<{ title: string; body: string }>;
    callout: string[];
    nicheTag: string;
    url?: string;
  };
  relatedBooks?: Array<{ id: string; type: string; score: number; rationale: string }>;
  coverImageUrl?: string;
  audiobookCoverUrl?: string;
  audiobook?: { mp3Url?: string; durationSeconds?: number };
  podcast?: { episodeUrl?: string };
  ebook?: { epubUrl?: string };
  paperback?: { isbn?: string; priceUsd?: number };
  hardcover?: { isbn?: string; priceUsd?: number };
  generatedAt?: string;
}

// Standard storefront pricing (Master §1.5). Backend doesn't return per-book
// pricing yet — use the locked defaults until it does.
const DEFAULT_FORMATS: FormatPrice[] = [
  { format: 'ebook', price_cents: 699, available: true },
  { format: 'paperback', price_cents: 1499, available: true },
  { format: 'hardcover', price_cents: 2499, available: true },
  { format: 'audiobook', price_cents: 1995, available: true },
];

// Series-number → anchor slug. Backend currently only exposes the 12 anchor
// books (one per series, slug = the series slug). When the catalog grows to
// include non-anchor books, slugs follow the same pattern published by
// /api/v1/books/catalog and this mapping isn't needed.
const SERIES_SLUG_BY_NUMBER: Record<number, string> = {
  1: 'discipline-blueprint',
  2: 'comeback-blueprint',
  3: 'mind-reset-blueprint',
  4: 'success-blueprint',
  5: 'elite-blueprint',
  6: 'unstoppable-blueprint',
  7: 'nervous-system-blueprint',
  8: 'connection-blueprint',
  9: 'power-blueprint',
  10: 'purpose-blueprint',
  11: 'warrior-blueprint',
  12: 'legend-blueprint',
};

function bookIdToSlug(id: string): string | null {
  // "s01_b01" → series 1 book 1 → "discipline-blueprint" (anchor only for now)
  const m = id.match(/^s(\d+)_b(\d+)$/i);
  if (!m) return null;
  const seriesNum = parseInt(m[1]!, 10);
  const bookNum = parseInt(m[2]!, 10);
  if (bookNum === 1) return SERIES_SLUG_BY_NUMBER[seriesNum] ?? null;
  return null;
}

function adaptBookSummary(raw: RawBookSummary): BookSummary {
  return {
    slug: raw.slug,
    title: raw.title,
    subtitle: raw.backSubhead,
    series_slug: SERIES_SLUG_BY_NUMBER[raw.seriesNumber] ?? '',
    series_name: raw.seriesName,
    series_color: raw.seriesColor,
    wave: raw.wave,
    book_number: raw.bookNumber,
    // Backend's covers live under /api/shop/image/books/<bookId>/cover.jpg
    // (Supabase-backed). imageProxy() prefixes env.backendUrl for relative keys.
    cover_r2_key: `books/${raw.bookId}/cover.jpg`,
    cover_alt: `${raw.title} — book cover`,
    formats: DEFAULT_FORMATS,
    audio_status: 'queued',
    primary_keyword: raw.nicheTag,
  };
}

function adaptSeriesSummary(raw: RawSeriesSummary): SeriesSummary {
  return {
    slug: raw.slug,
    name: raw.name,
    color_hex: raw.color,
    wave: raw.wave,
    book_count: raw.bookCount,
    intensity: 5,
    sample_title: raw.fullTitle,
    short_desc: raw.promise,
  };
}

function adaptBookDetail(raw: RawBookDetail): BookDetail {
  const summary = adaptBookSummary(raw);

  // Build a description from backCover.body (the marketing description) plus
  // the series promise as a lead-in.
  const description = raw.backCover?.body || raw.series?.promise || '';

  // FAQ stand-in: turn the back-cover bullets into "what's inside" pairs.
  const faq = (raw.backCover?.bullets ?? []).map((b) => ({
    q: b.title,
    a: b.body,
  }));

  // Sample chapter: the description body + first bullet as a teaser. Better
  // than nothing while the manuscript pipeline catches up.
  const sampleBody = raw.backCover?.body ?? '';
  const sample_chapter = {
    title: 'Day 1',
    body: sampleBody,
    word_count: sampleBody.split(/\s+/).filter(Boolean).length,
  };

  const audiobook = raw.audiobook?.mp3Url
    ? {
        full_url: raw.audiobook.mp3Url,
        duration_seconds: raw.audiobook.durationSeconds,
      }
    : undefined;

  return {
    ...summary,
    description,
    sample_chapter,
    audiobook,
    reviews: [],
    faq,
  };
}

// ---- Typed endpoint wrappers --------------------------------------------

export interface CatalogQuery {
  series?: string;
  wave?: 1 | 2 | 3 | 4;
  filter?: string;
  limit?: number;
}

export async function getCatalog(q: CatalogQuery = {}): Promise<CatalogResponse | null> {
  const qs = new URLSearchParams();
  if (q.series) qs.set('series', q.series);
  if (q.wave) qs.set('wave', String(q.wave));
  if (q.filter) qs.set('filter', q.filter);
  qs.set('limit', String(q.limit ?? 200));
  const raw = await backendSafe<RawCatalogResponse>(
    `/api/v1/books/catalog?${qs.toString()}`,
    { revalidate: 300, tags: ['catalog'] },
  );
  if (!raw) return null;
  return {
    books: (raw.books ?? []).map(adaptBookSummary),
    total: raw.count ?? raw.books?.length ?? 0,
  };
}

export async function getBook(slug: string): Promise<BookDetail | null> {
  const raw = await backendSafe<RawBookDetail>(`/api/v1/books/${slug}`, {
    revalidate: 3600,
    tags: ['book', `book:${slug}`],
  });
  if (!raw) return null;
  return adaptBookDetail(raw);
}

export async function getSeriesList(): Promise<{ series: SeriesSummary[] } | null> {
  const raw = await backendSafe<{ count: number; series: RawSeriesSummary[] }>(
    `/api/v1/series`,
    { revalidate: 3600, tags: ['series'] },
  );
  if (!raw) return null;
  return { series: (raw.series ?? []).map(adaptSeriesSummary) };
}

export async function getSeries(slug: string): Promise<SeriesDetail | null> {
  const [rawSeries, rawCatalog] = await Promise.all([
    backendSafe<RawSeriesSummary>(`/api/v1/series/${slug}`, {
      revalidate: 3600,
      tags: ['series', `series:${slug}`],
    }),
    // Series detail needs its books — pull via catalog filter so we get the
    // adapted summaries without depending on the series endpoint's shape.
    backendSafe<RawCatalogResponse>(`/api/v1/books/catalog?series=${slug}&limit=200`, {
      revalidate: 300,
    }),
  ]);
  if (!rawSeries) return null;
  return {
    ...adaptSeriesSummary(rawSeries),
    long_desc: rawSeries.promise,
    books: (rawCatalog?.books ?? []).map(adaptBookSummary),
  };
}

// Exported for any consumer that needs to resolve a related-book id → slug.
export { bookIdToSlug };

export function getPodcastFeed(limit = 50) {
  return backendSafe<PodcastFeedResponse>(`/api/v1/podcast/feed?limit=${limit}`, {
    revalidate: 600,
    tags: ['podcast'],
  });
}

export function getPodcastEpisode(slug: string) {
  return backendSafe<PodcastEpisodeDetail>(`/api/v1/podcast/${slug}`, {
    revalidate: 3600,
    tags: ['podcast', `podcast:${slug}`],
  });
}

export function getBookSeo(slug: string) {
  return backendSafe<JsonLdBundle>(`/api/v1/seo/book/${slug}`, { revalidate: 3600 });
}

export function getSeriesSeo(slug: string) {
  return backendSafe<JsonLdBundle>(`/api/v1/seo/series/${slug}`, { revalidate: 3600 });
}

export function getPageSeo(path: string) {
  return backendSafe<JsonLdBundle>(
    `/api/v1/seo/page${path.startsWith('/') ? path : `/${path}`}`,
    { revalidate: 3600 },
  );
}

export function getSpikerReviews(limit = 6) {
  return backendSafe<{ reviews: ReviewExcerpt[] }>(`/api/v1/spiker/reviews?limit=${limit}`, {
    revalidate: 3600,
    tags: ['spiker-reviews'],
  });
}

export function getMembershipAccess(cookie: string | undefined) {
  if (!cookie) return Promise.resolve(null);
  return backendSafe<MembershipAccess>(`/api/v1/membership/access?store=books`, {
    cookie: `apex_session=${cookie}`,
    revalidate: 0,
  });
}

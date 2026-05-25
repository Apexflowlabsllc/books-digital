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
// Catalog endpoint now returns the BookSummary shape natively (snake_case,
// flat). Detail endpoint still uses camelCase + nested objects, so we keep
// an adapter just for that. Series endpoints also still camelCase.

// Catalog passes through as CatalogResponse; backend may use `count` instead
// of `total` so we normalise that one field.
interface RawCatalogResponse {
  count?: number;
  total?: number;
  books: BookSummary[];
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
}

interface RawBookDetail {
  bookId: string;
  slug: string;
  title: string;
  subtitle?: string;
  bookNumber: number;
  description: string;
  // Backend may or may not return these depending on deploy state.
  isAuthentic?: boolean;
  publishedAt?: string | null;
  ebookDirectPriceUsd?: number;
  audiobookDirectPriceUsd?: number;
  bundleDirectPriceUsd?: number;
  paperbackDirectPriceUsd?: number;
  hardcoverDirectPriceUsd?: number;
  // Backend may add these too — boolean flags for true authentic audio
  // and podcast file existence.
  audioAvailable?: boolean;
  podcastAvailable?: boolean;
  series: {
    number: number;
    slug: string;
    name: string;
    label?: string;
    color: string;
    dark?: string;
    light?: string;
    wave: Wave;
    promise: string;
  };
  backCover?: {
    headline: string;
    subhead: string;
    body: string;
    bullets: Array<{ title: string; body: string }>;
    callout: string[];
    nicheTag?: string;
  };
  paperback?: { isbn?: string; priceUsd?: number };
  hardcover?: { isbn?: string; priceUsd?: number };
  ebook?: { priceUsd?: number; epubUrl?: string };
  audiobook?: { mp3Url?: string; durationSeconds?: number };
  podcast?: { episodeUrl?: string };
  coverImageUrl?: string;
  audiobookCoverUrl?: string;
  wrapCoverUrl?: string;
  backCoverUrl?: string;
  hardcoverWrapUrl?: string;
  interiorPdfUrl?: string;
  keywords?: string[];
  categories?: string[];
  relatedBooks?: Array<{ id: string; type: string; score: number; rationale: string }>;
  generatedAt?: string;
}

// Convert dollars (e.g. 6.99) to cents (699). Defaults to Master §1.5 prices
// when a per-format price is missing.
function usdToCents(usd: number | undefined, fallbackCents: number): number {
  if (typeof usd !== 'number' || isNaN(usd)) return fallbackCents;
  return Math.round(usd * 100);
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
  // Audio gating: mp3Url is empty string ('') on every book until R2 migration
  // lands. Treat empty / missing as 'queued' so the empty-state copy fires.
  const hasAudio = !!raw.audiobook?.mp3Url;
  const audio_status: BookSummary['audio_status'] = hasAudio ? 'live' : 'queued';

  // Synthesise the formats[] array from the per-format objects.
  const formats: FormatPrice[] = [
    { format: 'ebook',     price_cents: usdToCents(raw.ebook?.priceUsd, 699),       available: !!raw.ebook?.priceUsd || !!raw.ebook?.epubUrl },
    { format: 'paperback', price_cents: usdToCents(raw.paperback?.priceUsd, 1499),  available: !!raw.paperback?.isbn },
    { format: 'hardcover', price_cents: usdToCents(raw.hardcover?.priceUsd, 2499),  available: !!raw.hardcover?.isbn },
    { format: 'audiobook', price_cents: 1995,                                       available: hasAudio },
  ];

  // FAQ stand-in: lift the back-cover bullets as Q/A pairs.
  const faq = (raw.backCover?.bullets ?? []).map((b) => ({
    q: b.title,
    a: b.body,
  }));

  // Sample chapter: until the manuscript pipeline exposes a real excerpt,
  // surface the description body as the day-one teaser.
  const sampleBody = raw.description || raw.backCover?.body || '';
  const sample_chapter = {
    title: 'Day 1',
    body: sampleBody,
    word_count: sampleBody.split(/\s+/).filter(Boolean).length,
  };

  const audiobook = hasAudio
    ? {
        full_url: raw.audiobook!.mp3Url,
        duration_seconds: raw.audiobook!.durationSeconds,
      }
    : undefined;

  // Cover: backend provides a direct Supabase URL via coverImageUrl. imageProxy
  // passes http(s) URLs through unchanged, so storing the full URL in
  // cover_r2_key is safe.
  const coverUrl = raw.coverImageUrl ?? '';

  return {
    slug: raw.slug,
    title: raw.title,
    subtitle: raw.subtitle ?? raw.backCover?.subhead,
    series_slug: raw.series.slug,
    series_name: raw.series.name,
    series_color: raw.series.color,
    wave: raw.series.wave,
    book_number: raw.bookNumber,
    cover_r2_key: coverUrl,
    cover_alt: `${raw.title} — ${raw.series.name} series book ${raw.bookNumber}`,
    formats,
    audio_status,
    primary_keyword: raw.keywords?.[0],
    description: raw.description || raw.backCover?.body || '',
    book_id: raw.bookId,
    is_authentic: raw.isAuthentic,
    published_at: raw.publishedAt || undefined,
    // Direct-sale prices. Backend hasn't shipped these yet — fall back
    // to the Brian-approved defaults from the 2026-05-25 handoff. Once
    // the backend adds the *DirectPriceUsd fields these flip over
    // automatically. Print prices are all-in (shipping included v1).
    ebook_direct_price_usd: raw.ebookDirectPriceUsd ?? 5.99,
    audiobook_direct_price_usd: raw.audiobookDirectPriceUsd ?? 12.99,
    bundle_direct_price_usd: raw.bundleDirectPriceUsd ?? 16.99,
    paperback_direct_price_usd: raw.paperbackDirectPriceUsd ?? 19.99,
    hardcover_direct_price_usd: raw.hardcoverDirectPriceUsd ?? 34.99,
    sample_chapter,
    audiobook,
    podcast_episode_url: raw.podcast?.episodeUrl || undefined,
    // Video lives at the same path, .mp4 instead of .mp3. The backend
    // hasn't surfaced a dedicated field yet — the URL swap is the
    // pre-agreed pattern. VideoPlayer hides itself when the file 403s.
    podcast_video_url: raw.podcast?.episodeUrl
      ? raw.podcast.episodeUrl.replace(/\.mp3(\?|$)/, '.mp4$1')
      : undefined,
    paperback_isbn: raw.paperback?.isbn,
    hardcover_isbn: raw.hardcover?.isbn,
    back_cover: raw.backCover
      ? {
          headline: raw.backCover.headline,
          subhead: raw.backCover.subhead,
          body: raw.backCover.body,
          bullets: raw.backCover.bullets,
          callout: raw.backCover.callout,
        }
      : undefined,
    keywords: raw.keywords,
    categories: raw.categories,
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
  // Catalog returns BookSummary[] natively — no per-book transform needed.
  // Just normalise count vs total.
  return {
    books: raw.books ?? [],
    total: raw.total ?? raw.count ?? raw.books?.length ?? 0,
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
  // Try the slug as-given. If the backend doesn't know it AND the slug is
  // missing the `-blueprint` suffix, retry with the suffix appended —
  // this rescues stale links like /series/unstoppable that pre-date the
  // canonical /series/unstoppable-blueprint slug schema.
  const candidates = slug.endsWith('-blueprint') ? [slug] : [slug, `${slug}-blueprint`];
  let rawSeries: RawSeriesSummary | null = null;
  let resolvedSlug = slug;
  for (const candidate of candidates) {
    rawSeries = await backendSafe<RawSeriesSummary>(`/api/v1/series/${candidate}`, {
      revalidate: 3600,
      tags: ['series', `series:${candidate}`],
    });
    if (rawSeries) {
      resolvedSlug = candidate;
      break;
    }
  }
  if (!rawSeries) return null;

  const rawCatalog = await backendSafe<RawCatalogResponse>(
    `/api/v1/books/catalog?series=${resolvedSlug}&limit=200`,
    { revalidate: 300 },
  );

  return {
    ...adaptSeriesSummary(rawSeries),
    long_desc: rawSeries.promise,
    books: rawCatalog?.books ?? [],
  };
}

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

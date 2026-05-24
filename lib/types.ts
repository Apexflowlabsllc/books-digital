// Shared types for backend responses. Backend is the source of truth — these
// match the response shapes promised in guideline.md but degrade gracefully
// when a field is missing (treated as undefined and surfaced as "Coming soon"
// per Master SOP §1.5).

export type Wave = 1 | 2 | 3 | 4;

export type Format = 'ebook' | 'paperback' | 'hardcover' | 'audiobook';

export interface FormatPrice {
  format: Format;
  price_cents: number;
  available: boolean;
}

export interface BookSummary {
  slug: string;
  title: string;
  subtitle?: string;
  series_slug: string;
  series_name: string;
  series_color?: string;
  series_glyph?: string;
  wave: Wave;
  book_number: number;
  cover_r2_key: string;
  cover_alt?: string;
  formats: FormatPrice[];
  audio_status: 'live' | 'production' | 'queued';
  primary_keyword?: string;
  voice_intensity?: number; // 1-9 (⚔ rating)
  spiker_case_study_flag?: boolean;
}

export interface ReviewExcerpt {
  id: string;
  body: string;
  author: string;
  source: 'spiker' | 'amazon' | 'goodreads' | 'verified-reader';
  rating?: number;
}

export interface BookDetail extends BookSummary {
  description: string;
  sample_chapter: {
    title: string;
    body: string; // ~400 word excerpt from chapter 1
    word_count: number;
  };
  audiobook?: {
    sample_url?: string; // 30 sec preview via /api/books/stream/<slug>?type=sample
    full_url?: string; // gated audiobook stream
    duration_seconds?: number;
  };
  // Per-book podcast episode (real CDN URL; ~13 unique podcasts cycle across
  // all 636 books while audiobook R2 migration is pending).
  podcast_episode_url?: string;
  // Per-format ISBN — needed for SEO Book schema.
  paperback_isbn?: string;
  hardcover_isbn?: string;
  // Marketing back-cover content from the backend.
  back_cover?: {
    headline: string;
    subhead: string;
    body: string;
    bullets: Array<{ title: string; body: string }>;
    callout: string[];
  };
  keywords?: string[];
  categories?: string[];
  reviews: ReviewExcerpt[];
  review_summary?: { count: number; averageRating: number };
  previous_book_slug?: string;
  next_book_slug?: string;
  faq: Array<{ q: string; a: string }>;
  related_podcast_slug?: string;
}

export interface SeriesSummary {
  slug: string;
  name: string;
  glyph_svg?: string;
  color_hex: string;
  wave: Wave;
  book_count: number;
  intensity: number; // 1-9
  sample_title: string;
  short_desc?: string;
}

export interface SeriesDetail extends SeriesSummary {
  long_desc: string;
  books: BookSummary[];
}

export interface PodcastEpisode {
  slug: string;
  title: string;
  episode_number: number;
  duration_seconds: number;
  published_at: string;
  audio_url: string; // /api/books/stream/<slug>?type=podcast
  transcript_url?: string;
  related_book_slug?: string;
  summary: string;
}

export interface PodcastEpisodeDetail extends PodcastEpisode {
  transcript: string;
  chapters: Array<{ title: string; start_seconds: number }>;
  related_book?: BookSummary;
  subscribe_links: {
    apple?: string;
    spotify?: string;
    amazon?: string;
    youtube_music?: string;
    iheartradio?: string;
    pandora?: string;
    stitcher?: string;
    pocket_casts?: string;
    overcast?: string;
  };
}

export interface MembershipAccess {
  has_access: boolean;
  pass_kind?: 'books' | 'digital' | 'founder';
  expires_at?: string;
  charter_remaining?: number;
}

// Multi-schema JSON-LD bundle — every schema object becomes its own <script>
// tag per Master §6.4.
export type JsonLdObject = Record<string, unknown>;
export type JsonLdBundle = JsonLdObject[];

export interface CatalogResponse {
  books: BookSummary[];
  total: number;
}

// What the backend's /api/v1/podcast/feed currently returns: a list of RSS
// feed URLs (one "master" + one per series). Individual episodes aren't
// exposed via JSON yet; podcast apps consume the RSS feeds directly, and
// per-book audio lives on each BookDetail as podcast_episode_url.
export interface PodcastFeed {
  slug: string;            // "master" | "s01_discipline" | ...
  title: string;           // backend title (may still say "Apex Raw Motivation")
  feedUrl: string;         // RSS XML endpoint
  series?: number;         // 1-12 for per-series feeds; missing on master
}

export interface PodcastFeedResponse {
  count: number;
  feeds: PodcastFeed[];
}

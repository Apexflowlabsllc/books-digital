import Link from 'next/link';
import { Mic, Rss, Film } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { AudioPlayer } from '@/components/AudioPlayer';
import { VideoPlayer } from '@/components/VideoPlayer';
import { getBook, getCatalog, getPageSeo, getPodcastFeed } from '@/lib/api';
import { podcastVideoPreviewUrl } from '@/lib/preview-pool';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';
import { SHOW_PODCAST_VIDEO_ON_PODCAST_PAGE } from '@/lib/flags';
import { imageProxy } from '@/lib/utils';
import { empty } from '@/lib/voice';
import type { BookDetail, BookSummary, PodcastFeed } from '@/lib/types';

// Derive backend bookId (s01_b01 style) from the slug+number pair —
// catalog summary doesn't yet expose bookId, so we synthesize it.
const SERIES_NUM: Record<string, number> = {
  'discipline-blueprint': 1,
  'comeback-blueprint': 2,
  'mind-reset-blueprint': 3,
  'success-blueprint': 4,
  'elite-blueprint': 5,
  'unstoppable-blueprint': 6,
  'nervous-system-blueprint': 7,
  'connection-blueprint': 8,
  'power-blueprint': 9,
  'purpose-blueprint': 10,
  'warrior-blueprint': 11,
  'legend-blueprint': 12,
};
function bookIdFor(b: BookSummary): string | null {
  const s = SERIES_NUM[b.series_slug];
  if (!s) return null;
  return `s${String(s).padStart(2, '0')}_b${String(b.book_number).padStart(2, '0')}`;
}

export const metadata = buildMetadata({
  title: 'Podcast — Apex Publishing House',
  description:
    '14 feeds. One per series, plus master + apex daily. Subscribe in Apple, Spotify, Amazon, YouTube Music, iHeart, Pandora, Stitcher, Pocket Casts, or Overcast.',
  path: '/podcast',
});

export const revalidate = 600;

const DIRECTORIES = [
  'Apple Podcasts',
  'Spotify',
  'Amazon Music',
  'YouTube Music',
  'iHeartRadio',
  'Pandora',
  'Stitcher',
  'Pocket Casts',
  'Overcast',
];

// Series number → the slug of book #1 in that series. Used to pull the
// per-series podcast URL so each feed card is actually playable.
const SERIES_FIRST_BOOK_SLUG: Record<number, string> = {
  1: 'the-discipline-blueprint',
  2: 'the-comeback-blueprint',
  3: 'the-mind-reset-blueprint',
  4: 'the-success-blueprint',
  5: 'the-elite-blueprint',
  6: 'the-unstoppable-blueprint',
  7: 'the-nervous-system-blueprint',
  8: 'the-connection-blueprint',
  9: 'the-power-blueprint',
  10: 'the-purpose-blueprint',
  11: 'the-warrior-blueprint',
  12: 'the-legend-blueprint',
};

// Backend titles still carry the legacy "Apex Raw Motivation —" prefix.
// Strip it so the rendered card label reads cleanly.
function cleanTitle(raw: string): string {
  return raw
    .replace(/^Apex Raw Motivation\s*[—-]\s*/i, '')
    .replace(/^Apex Publishing House\s*[—-]\s*/i, '')
    .trim();
}

function feedKind(feed: PodcastFeed): 'master' | 'series' | 'special' {
  if (feed.slug === 'master') return 'master';
  if (typeof feed.series === 'number') return 'series';
  return 'special';
}

interface FeedCardData {
  feed: PodcastFeed;
  kind: 'master' | 'series' | 'special';
  audioUrl?: string;
  cover?: string;
  bookTitle?: string;
  bookSlug?: string;
}

export default async function PodcastPage() {
  // Pull feeds + per-series first-book detail + the full S1 and S2
  // catalog (those 20 books are the ones with real podcast video per
  // Brian's 2026-05-25 handoff). The S1/S2 lists drive the video
  // grid; the per-series book details drive the audio cards below.
  const seriesNumbers = Object.keys(SERIES_FIRST_BOOK_SLUG).map(Number);

  const [feedRes, seo, s1Catalog, s2Catalog, ...seriesBooks] = await Promise.all([
    getPodcastFeed(50),
    getPageSeo('/podcast'),
    getCatalog({ series: 'discipline-blueprint', limit: 10 }),
    getCatalog({ series: 'comeback-blueprint', limit: 10 }),
    ...seriesNumbers.map((n) => getBook(SERIES_FIRST_BOOK_SLUG[n]!)),
  ]);

  const seriesBookByNumber = new Map<number, BookDetail>();
  seriesNumbers.forEach((n, idx) => {
    const b = seriesBooks[idx];
    if (b) seriesBookByNumber.set(n, b);
  });

  const feeds = feedRes?.feeds ?? [];

  // Build the 20-card video lineup: S1 books 1-10 then S2 books 1-10.
  // Each VideoPlayer self-hides if the backend hasn't uploaded that
  // MP4 — so the visible count auto-matches what's actually live.
  const videoBooks: Array<{ slug: string; title: string; bookId: string; cover: string | null }> = [];
  for (const b of [...(s1Catalog?.books ?? []), ...(s2Catalog?.books ?? [])]) {
    const bookId = bookIdFor(b);
    if (!bookId) continue;
    videoBooks.push({
      slug: b.slug,
      title: b.title,
      bookId,
      cover: imageProxy(b.cover_r2_key) || null,
    });
  }

  // Build the unified card list. Master + apex_daily first, then series
  // ordered S01 → S12.
  const cards: FeedCardData[] = feeds
    .map((feed) => {
      const kind = feedKind(feed);
      if (kind === 'series') {
        const book = seriesBookByNumber.get(feed.series!);
        return {
          feed,
          kind,
          audioUrl: book?.podcast_episode_url,
          cover: book ? imageProxy(book.cover_r2_key) || undefined : undefined,
          bookTitle: book?.title,
          bookSlug: book?.slug,
        };
      }
      return { feed, kind };
    })
    .sort((a, b) => {
      const rank = (k: FeedCardData['kind']) => (k === 'master' ? 0 : k === 'special' ? 1 : 2);
      if (rank(a.kind) !== rank(b.kind)) return rank(a.kind) - rank(b.kind);
      return (a.feed.series ?? 0) - (b.feed.series ?? 0);
    });

  return (
    <PageShell>
      <JsonLdSchema bundle={seo} fallback={fallbackPageSchema('/podcast', 'Apex Publishing House Podcast')} />

      <Hero
        eyebrow="Podcast"
        title={
          <>
            8 to 12 minutes. <span className="metallic-text">One chapter at a time.</span>
          </>
        }
        body="Brian walks through one chapter per episode. No interviews. No sponsors. No filler — eight to twelve tight minutes you can run during a coffee."
      />

      {/* Subscribe rail */}
      <section className="border-y border-line bg-bg-subtle">
        <div className="container-x py-10">
          <p className="eyebrow mb-4">Listen on every directory</p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-9">
            {DIRECTORIES.map((d) => (
              <li
                key={d}
                className="border border-line bg-bg px-3 py-3 text-center text-[11px] uppercase tracking-widest text-ink-dim"
              >
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Video lineup — every book in S1 and S2 (Brian's 2026-05-25
          handoff: 20 books have real podcast video). Each player
          self-hides via onError when the backend hasn't uploaded its
          MP4 yet, so the visible grid auto-matches the live set. */}
      {SHOW_PODCAST_VIDEO_ON_PODCAST_PAGE && videoBooks.length > 0 ? (
        <section className="container-x py-16">
          <div className="mb-8">
            <p className="eyebrow mb-3 text-accent">Watch the podcast</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              Same episode, on video.
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-ink-dim md:text-base">
              Brian and the cohost, recorded. Browse the lineup below or grab a feed
              further down to listen on the go.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {videoBooks.map((b) => (
              <li key={b.bookId} className="space-y-3">
                <VideoPlayer
                  src={podcastVideoPreviewUrl(b.bookId)}
                  poster={b.cover ?? undefined}
                  title={`${b.title} — podcast video`}
                />
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70">
                      <Film className="mr-1 inline h-3 w-3" aria-hidden />
                      {b.bookId.toUpperCase().replace('_', ' · ')}
                    </p>
                    <p className="mt-1 truncate font-display text-base text-ink">
                      {b.title}
                    </p>
                  </div>
                  <Link
                    href={`/books/${b.slug}`}
                    className="shrink-0 text-[11px] uppercase tracking-widest text-accent hover:text-ink"
                  >
                    Open →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* All podcasts — playable + subscribe */}
      {cards.length === 0 ? (
        <section className="container-x py-16">
          <p className="border border-line bg-bg-subtle p-8 text-sm text-ink-dim">
            {empty.podcastNone}
          </p>
        </section>
      ) : (
        <section className="border-t border-line">
          <div className="container-x py-16">
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="font-display text-2xl text-ink md:text-3xl">
                Listen to the podcast
              </h2>
              <span className="eyebrow text-ink-mute">Tap play, or subscribe</span>
            </div>
            <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {cards.map(({ feed, kind, audioUrl, cover, bookTitle, bookSlug }) => (
                <li
                  key={feed.slug}
                  className="border border-line bg-bg-subtle p-5 transition-colors hover:border-accent/60"
                >
                  <div className="flex items-start gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent/80">
                      {kind === 'master'
                        ? 'Master feed · everything'
                        : kind === 'special'
                          ? 'Apex daily'
                          : `S${String(feed.series).padStart(2, '0')}`}
                    </p>
                  </div>
                  <p className="mt-2 font-display text-xl text-ink leading-[1.2]">
                    {cleanTitle(feed.title)}
                  </p>

                  {audioUrl ? (
                    <div className="mt-4">
                      <AudioPlayer
                        src={audioUrl}
                        title={
                          bookTitle ? `${bookTitle} — podcast` : `${cleanTitle(feed.title)} — sample`
                        }
                        variant="full"
                      />
                    </div>
                  ) : kind === 'master' ? (
                    <p className="mt-4 text-sm text-ink-dim">
                      Every chapter, every series, in one feed. Subscribe in a podcast app
                      to get new episodes as Brian drops them — 12 per week.
                    </p>
                  ) : kind === 'special' ? (
                    <p className="mt-4 text-sm text-ink-dim">
                      The daily firehose — one short kick, every day, from across the
                      library. Best consumed in a podcast app.
                    </p>
                  ) : (
                    <p className="mt-4 text-sm text-ink-mute">Episode coming online soon.</p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                    <a
                      href={feed.feedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 uppercase tracking-widest text-accent hover:text-ink"
                    >
                      <Rss className="h-3.5 w-3.5" aria-hidden />
                      <span>Subscribe via RSS</span>
                    </a>
                    {bookSlug ? (
                      <Link
                        href={`/books/${bookSlug}`}
                        className="inline-flex items-center gap-2 uppercase tracking-widest text-ink-dim hover:text-ink"
                      >
                        <Mic className="h-3.5 w-3.5" aria-hidden />
                        <span>Open the book</span>
                      </Link>
                    ) : null}
                  </div>

                  {cover ? (
                    // Decorative thumb — keep it small + bottom-right so the
                    // player stays the focus.
                    <div
                      aria-hidden
                      className="pointer-events-none mt-3 flex justify-end opacity-50"
                    >
                      <span
                        className="block h-10 w-10 bg-cover bg-center"
                        style={{ backgroundImage: `url(${cover})` }}
                      />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Per-book pitch */}
      <section className="container-x py-16">
        <div className="border border-line bg-bg-subtle p-6 md:p-8">
          <div className="flex items-start gap-4">
            <Mic className="mt-1 h-6 w-6 shrink-0 text-accent" aria-hidden />
            <div>
              <p className="eyebrow mb-2">Per-episode playback</p>
              <p className="font-display text-xl text-ink md:text-2xl">
                Want one episode at a time? Open the book.
              </p>
              <p className="mt-3 max-w-2xl text-sm text-ink-dim">
                Every book&rsquo;s detail page has its podcast episode wired inline — no
                subscribe required. Pick a fight, hit play.
              </p>
              <Link href="/books" className="cta-secondary mt-5 inline-flex">
                <span>Browse the catalog</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

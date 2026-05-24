import Link from 'next/link';
import { Mic, Rss } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo, getPodcastFeed } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';
import { empty } from '@/lib/voice';

export const metadata = buildMetadata({
  title: 'Podcast — Apex Book Publishing',
  description:
    '13 feeds. One per series, plus a master that streams everything. Subscribe in Apple, Spotify, Amazon, YouTube Music, iHeart, Pandora, Stitcher, Pocket Casts, or Overcast.',
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

// Backend titles still carry the legacy "Apex Raw Motivation —" prefix.
// Strip it so the rendered card label reads cleanly until the backend
// re-titles them.
function cleanTitle(raw: string): string {
  return raw
    .replace(/^Apex Raw Motivation\s*[—-]\s*/i, '')
    .replace(/^Apex Book Publishing\s*[—-]\s*/i, '')
    .trim();
}

export default async function PodcastPage() {
  const [feedRes, seo] = await Promise.all([getPodcastFeed(50), getPageSeo('/podcast')]);
  const feeds = feedRes?.feeds ?? [];
  const master = feeds.find((f) => f.slug === 'master' || typeof f.series !== 'number');
  const perSeries = feeds.filter((f) => typeof f.series === 'number').sort((a, b) => (a.series ?? 0) - (b.series ?? 0));

  return (
    <PageShell>
      <JsonLdSchema bundle={seo} fallback={fallbackPageSchema('/podcast', 'Apex Book Publishing Podcast')} />

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
          <p className="mt-3 text-[11px] text-ink-mute">
            Paste any feed below into your podcast app of choice — or open a book to play
            that episode inline.
          </p>
        </div>
      </section>

      {feeds.length === 0 ? (
        <section className="container-x py-16">
          <p className="border border-line bg-bg-subtle p-8 text-sm text-ink-dim">
            {empty.podcastNone}
          </p>
        </section>
      ) : (
        <>
          {/* Master feed — the everything-firehose */}
          {master ? (
            <section className="container-x py-16">
              <div className="border border-line bg-bg-subtle p-6 md:p-10">
                <p className="eyebrow mb-3 text-accent">Master feed</p>
                <h2 className="font-display text-3xl text-ink md:text-4xl">
                  {cleanTitle(master.title)}
                </h2>
                <p className="mt-4 max-w-2xl text-ink-dim">
                  Every chapter, every series, in one feed. One subscribe button — Brian
                  drops new episodes 12 a week. Set it and forget it.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={master.feedUrl}
                    className="cta-primary inline-flex"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Rss className="h-4 w-4" aria-hidden />
                    <span>Subscribe to the master feed</span>
                  </a>
                  <Link href="/books" className="cta-secondary inline-flex">
                    <span>Or listen per book</span>
                  </Link>
                </div>
              </div>
            </section>
          ) : null}

          {/* Per-series feeds */}
          {perSeries.length > 0 ? (
            <section className="border-t border-line">
              <div className="container-x py-16">
                <div className="mb-8 flex items-baseline justify-between">
                  <h2 className="font-display text-2xl text-ink md:text-3xl">
                    One feed per series
                  </h2>
                  <span className="eyebrow text-ink-mute">{perSeries.length} feeds</span>
                </div>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {perSeries.map((f) => (
                    <li
                      key={f.slug}
                      className="border border-line bg-bg-subtle p-5 transition-colors hover:border-accent/60"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent/80">
                        S{String(f.series).padStart(2, '0')}
                      </p>
                      <p className="mt-2 font-display text-lg text-ink leading-[1.2]">
                        {cleanTitle(f.title)}
                      </p>
                      <a
                        href={f.feedUrl}
                        className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent hover:text-ink"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Rss className="h-3.5 w-3.5" aria-hidden />
                        <span>Subscribe</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

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
                    Every book&rsquo;s detail page has its podcast episode wired inline —
                    no subscribe required. Pick a fight, hit play.
                  </p>
                  <Link href="/books" className="cta-secondary mt-5 inline-flex">
                    <span>Browse the catalog</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </PageShell>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Mic, Headphones, Film } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { Cover } from '@/components/Cover';
import { PriceSelector } from '@/components/PriceSelector';
import { PreviewAudio } from '@/components/PreviewAudio';
import { PreviewVideo } from '@/components/PreviewVideo';
import { BookReviews } from '@/components/BookReviews';
import { EmailGate } from '@/components/EmailGate';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { ClusterHub } from '@/components/ClusterHub';
import { ComingSoonBook } from '@/components/ComingSoonBook';
import { getBook, getBookSeo, getCluster } from '@/lib/api';
import { getAudioPreviewPool, getPodcastPreviewPool } from '@/lib/preview-pool';
import { buildMetadata, fallbackBookSchema, fallbackClusterSchema } from '@/lib/seo';
import { SHOW_PODCAST_VIDEO_ON_BOOK } from '@/lib/flags';
import { getClusterBySlug, isClusterSlug } from '@/lib/clusters';
import { LAUNCH } from '@/lib/launch';
import { isComingSoonBook } from '@/lib/series-status';
import { imageProxy, intensityGlyphs, waveLabel } from '@/lib/utils';

interface BookRouteProps {
  params: Promise<{ slug: string }>;
}

// First paragraph (split on double-newline). Per Brian's doctrine the
// description must match Amazon/IngramSpark verbatim — but for OG /
// Twitter cards we trim to the lead paragraph + 200 chars.
function shortDescription(full: string): string {
  const lead = full.split(/\n\n+/)[0] ?? full;
  return lead.length > 200 ? `${lead.slice(0, 197)}…` : lead;
}

export async function generateMetadata({ params }: BookRouteProps) {
  const { slug } = await params;
  // Cluster hubs share /books/<slug> with book detail pages; cluster
  // slugs (discipline, comeback, mindset, ...) win first.
  const cluster = getClusterBySlug(slug);
  if (cluster) {
    return buildMetadata({
      title: `${cluster.name} — Apex Publishing House`,
      description: cluster.description,
      path: `/books/${cluster.slug}`,
    });
  }
  const book = await getBook(slug);
  if (!book) {
    return buildMetadata({
      title: 'Book',
      path: `/books/${slug}`,
    });
  }
  return buildMetadata({
    title: `${book.title} — ${book.series_name}`,
    description: shortDescription(book.description),
    path: `/books/${book.slug}`,
    image: imageProxy(book.cover_r2_key) || undefined,
    type: 'book',
  });
}

export const revalidate = 3600;

export default async function BookDetailPage({ params }: BookRouteProps) {
  const { slug } = await params;

  // Cluster hub branch — runs before the book fetch so we don't spend
  // a backend call on URLs that are SEO landing pages, not books.
  if (isClusterSlug(slug)) {
    const cluster = getClusterBySlug(slug)!;
    const { books } = await getCluster(cluster.slug, cluster.fallbackSeriesSlugs);
    return (
      <PageShell>
        <JsonLdSchema bundle={null} fallback={fallbackClusterSchema(cluster, books)} />
        <ClusterHub cluster={cluster} books={books} />
      </PageShell>
    );
  }

  const [book, seo, audioPool, podcastPool] = await Promise.all([
    getBook(slug),
    getBookSeo(slug),
    getAudioPreviewPool(),
    getPodcastPreviewPool(),
  ]);

  if (!book) notFound();

  // Coming-soon branch: S06–S12 don't have written manuscripts yet
  // (per Brian's roadmap). Render the minimal cover + "Coming soon"
  // panel + notify-me capture instead of the full purchase stack.
  if (isComingSoonBook(book)) {
    return (
      <PageShell seriesColor={book.series_color}>
        <JsonLdSchema bundle={seo} fallback={fallbackBookSchema(book)} />
        <ComingSoonBook book={book} />
      </PageShell>
    );
  }

  // Authenticity gates whether the player shows full audio or a 30s
  // preview from a borrowed peer. Per backend handoff: when
  // is_authentic === true, the file is real and lives in R2 for this
  // book; when false, the backend's cycling fallback returns a peer's
  // file — frontend caps that at 30s and prompts purchase.
  const audioAuthentic = book.is_authentic === true;
  const podcastAuthentic = book.is_authentic === true;

  return (
    <PageShell seriesColor={book.series_color}>
      <JsonLdSchema bundle={seo} fallback={fallbackBookSchema(book)} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container-x pt-8">
        <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-ink-mute">
          <li>
            <Link href="/books" className="hover:text-ink">
              Books
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={`/series/${book.series_slug}`} className="hover:text-ink">
              {book.series_name}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink">{book.title}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container-x grid gap-10 py-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:py-16">
        <div className="md:max-w-sm">
          <Cover
            r2Key={book.cover_r2_key}
            alt={book.cover_alt ?? `${book.title} — cover`}
            priority
            className="border border-line"
            sizes="(min-width: 768px) 24rem, 100vw"
          />
        </div>

        <div>
          {LAUNCH.active ? (
            <div className="mb-4 inline-flex items-center gap-2 border border-accent/60 bg-bg-subtle px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              <span>Launch week · {LAUNCH.percent}% off · code {LAUNCH.code}</span>
            </div>
          ) : null}
          <p className="eyebrow mb-4 text-series">
            {book.series_name} · Book {book.book_number} · {waveLabel(book.wave)}
          </p>
          <h1 className="font-display text-4xl leading-[1.05] text-ink md:text-5xl lg:text-6xl">
            {book.title}
          </h1>
          {book.subtitle ? (
            <p className="mt-4 font-display text-xl text-ink-dim md:text-2xl">{book.subtitle}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-dim">
            <span>By Brian Spiker</span>
            <span aria-hidden>·</span>
            <span title="Voice intensity">{intensityGlyphs(book.voice_intensity)}</span>
            <span aria-hidden>·</span>
            <span>{book.sample_chapter?.word_count?.toLocaleString() ?? '~38,000'} words · 90 chapters</span>
          </div>

          <p className="mt-6 max-w-prose text-ink whitespace-pre-line">{book.description}</p>

          <div id="buy" className="mt-8 scroll-mt-24">
            <PriceSelector book={book} />
          </div>

          {/* Spiker case-study flag — Master §9 */}
          {book.spiker_case_study_flag ? (
            <div className="mt-6 border border-accent/40 bg-bg-subtle p-4 text-sm">
              <p className="font-display text-base text-accent">Built from a Spiker case study.</p>
              <p className="mt-1 text-ink-dim">
                This book references real operations from{' '}
                <a
                  href="https://spikercarpetandtilecare.com"
                  className="underline hover:text-ink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Spiker Carpet and Tile Care
                </a>
                . Not a hypothetical.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Audiobook — Polly Neural narration. Authentic books play full
          length; non-authentic borrow a peer's MP3 capped at 30s. */}
      <section className="border-y border-line bg-bg-subtle">
        <div className="container-x grid gap-6 py-10 md:grid-cols-[auto_1fr] md:items-start">
          <div className="flex items-center gap-3 text-series">
            <Headphones className="h-8 w-8" aria-hidden />
            <div>
              <p className="font-display text-2xl text-ink">
                Hear a 30-sec preview
              </p>
              <p className="text-xs text-ink-mute">
                Audiobook · ${book.audiobook_direct_price_usd.toFixed(2)}
              </p>
            </div>
          </div>
          <PreviewAudio
            kind="audiobook"
            ownSlug={book.slug}
            isAuthentic={audioAuthentic}
            ownAudioUrl={book.audiobook?.full_url}
            pool={audioPool}
            alwaysCap
            buyHref="#buy"
            buyLabel={`Buy the audiobook — $${book.audiobook_direct_price_usd.toFixed(2)}`}
            title={`${book.title} — audiobook`}
          />
        </div>
      </section>

      {/* Podcast video — feature-flagged off per Brian's 2026-05-25
          directive (video generation paused). Code stays wired so we can
          flip it back on with one line in lib/flags.ts. */}
      {SHOW_PODCAST_VIDEO_ON_BOOK ? (
        <section className="border-b border-line">
          <div className="container-x grid gap-6 py-10 md:grid-cols-[auto_1fr] md:items-start">
            <div className="flex items-center gap-3 text-accent">
              <Film className="h-8 w-8" aria-hidden />
              <p className="font-display text-2xl text-ink">Watch the podcast</p>
            </div>
            <PreviewVideo
              ownSlug={book.slug}
              isAuthentic={podcastAuthentic}
              ownVideoUrl={book.podcast_video_url}
              pool={podcastPool}
              poster={imageProxy(book.cover_r2_key) || undefined}
              title={`${book.title} — podcast video`}
              buyHref="#buy"
              buyLabel={`Buy the audiobook — $${book.audiobook_direct_price_usd.toFixed(2)}`}
            />
          </div>
        </section>
      ) : null}

      {/* Podcast audio episode. */}
      <section className="border-b border-line">
        <div className="container-x grid gap-6 py-10 md:grid-cols-[auto_1fr] md:items-start">
          <div className="flex items-center gap-3 text-accent">
            <Mic className="h-8 w-8" aria-hidden />
            <p className="font-display text-2xl text-ink">Listen to the podcast</p>
          </div>
          <PreviewAudio
            kind="podcast"
            ownSlug={book.slug}
            isAuthentic={podcastAuthentic}
            ownAudioUrl={book.podcast_episode_url}
            pool={podcastPool}
            buyHref="#buy"
            buyLabel={`Buy the audiobook — $${book.audiobook_direct_price_usd.toFixed(2)}`}
            title={`${book.title} — podcast episode`}
          />
        </div>
      </section>

      {/* Sample chapter excerpt */}
      <section className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-[3fr_2fr] md:gap-16">
          <article>
            <p className="eyebrow mb-3">Sample · {book.sample_chapter?.title ?? 'Chapter 1'}</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              First 400 words. The hook is the whole pitch.
            </h2>
            <div className="prose prose-invert mt-6 max-w-none text-base leading-relaxed text-ink-dim">
              {(book.sample_chapter?.body ?? '').split(/\n\n+/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <Link
              href={`/free-chapter/${book.slug}`}
              className="cta-primary mt-8 inline-flex"
            >
              Send me the full chapter
            </Link>
          </article>

          <aside className="space-y-6">
            <EmailGate
              bookId={book.book_id}
              bookSlug={book.slug}
              bookTitle={book.title}
              utmSource="book-detail-aside"
            />

            <div className="border border-line bg-bg-subtle p-5 text-sm">
              <p className="eyebrow mb-2">FYI</p>
              <ul className="space-y-2 text-ink-dim">
                <li>· 35-40k words. 90 chapters. One per day of the 90-day program.</li>
                <li>· Audiobook narrated via supervised Polly Neural.</li>
                <li>· Bundle = ebook + audiobook, instant download, one click.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Reviews — interactive: review tiles + leave-review form */}
      <BookReviews
        bookSlug={book.slug}
        bookTitle={book.title}
        initial={book.reviews ?? []}
        summary={book.review_summary}
      />

      {/* FAQ */}
      {book.faq && book.faq.length > 0 ? (
        <section className="border-t border-line bg-bg-subtle">
          <div className="container-x py-16">
            <div className="mb-8 max-w-2xl">
              <p className="eyebrow mb-2">FAQ</p>
              <h2 className="font-display text-3xl text-ink md:text-4xl">
                The questions everyone sends in the first 48 hours.
              </h2>
            </div>
            <div className="divide-y divide-line border border-line bg-bg">
              {book.faq.map((f, i) => (
                <details key={i} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-4">
                    <span className="font-display text-lg text-ink">{f.q}</span>
                    <span className="text-accent transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-ink-dim">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Series nav */}
      <section className="container-x py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {book.previous_book_slug ? (
            <Link
              href={`/books/${book.previous_book_slug}`}
              className="flex items-center gap-3 border border-line bg-bg-subtle p-5 hover:border-series transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-ink-mute" aria-hidden />
              <div>
                <p className="eyebrow">Previous in series</p>
                <p className="font-display text-lg text-ink">View book {book.book_number - 1}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {book.next_book_slug ? (
            <Link
              href={`/books/${book.next_book_slug}`}
              className="flex items-center justify-between border border-line bg-bg-subtle p-5 hover:border-series transition-colors md:flex-row-reverse"
            >
              <ArrowRight className="h-5 w-5 text-ink-mute" aria-hidden />
              <div className="md:text-right">
                <p className="eyebrow">Next in series</p>
                <p className="font-display text-lg text-ink">View book {book.book_number + 1}</p>
              </div>
            </Link>
          ) : null}
        </div>

        {/* Related-podcast deep link removed — podcast audio + video
            now play inline on this same page above, so there's nowhere
            for "Listen to the podcast" to go that the user isn't
            already looking at. */}
      </section>
    </PageShell>
  );
}

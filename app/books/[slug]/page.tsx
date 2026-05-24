import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Mic, Headphones } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { Cover } from '@/components/Cover';
import { PriceSelector } from '@/components/PriceSelector';
import { AudioPlayer } from '@/components/AudioPlayer';
import { BookReviews } from '@/components/BookReviews';
import { EmailGate } from '@/components/EmailGate';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getBook, getBookSeo } from '@/lib/api';
import { buildMetadata, fallbackBookSchema } from '@/lib/seo';
import { audioStream, imageProxy, intensityGlyphs, waveLabel } from '@/lib/utils';
import { empty } from '@/lib/voice';

interface BookRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BookRouteProps) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) {
    return buildMetadata({
      title: 'Book',
      path: `/books/${slug}`,
    });
  }
  return buildMetadata({
    title: `${book.title} — ${book.series_name}`,
    description: book.description.slice(0, 180),
    path: `/books/${book.slug}`,
    image: imageProxy(book.cover_r2_key) || undefined,
    type: 'book',
  });
}

export const revalidate = 3600;

export default async function BookDetailPage({ params }: BookRouteProps) {
  const { slug } = await params;
  const [book, seo] = await Promise.all([getBook(slug), getBookSeo(slug)]);

  if (!book) notFound();

  const sampleAudio = book.audiobook?.sample_url || audioStream(book.slug, 'sample');

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

          <p className="mt-6 max-w-prose text-ink">{book.description}</p>

          <div className="mt-8">
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

      {/* Audiobook sample — only renders when the R2 audio is live; until
          then we skip the section entirely (no "coming soon" copy). */}
      {book.audio_status === 'live' && book.audiobook?.full_url ? (
        <section className="border-y border-line bg-bg-subtle">
          <div className="container-x grid gap-6 py-10 md:grid-cols-[auto_1fr] md:items-center">
            <div className="flex items-center gap-3 text-series">
              <Headphones className="h-8 w-8" aria-hidden />
              <p className="font-display text-2xl text-ink">Hear chapter one</p>
            </div>
            <AudioPlayer
              src={sampleAudio}
              title={`${book.title} — chapter 1 (30-sec preview)`}
              description="Polly Neural narration · supervised by Brian"
              variant="full"
            />
          </div>
        </section>
      ) : null}

      {/* Podcast episode — every book ships with a podcast even when the
          full audiobook is still queued. Works as the audio preview while
          the R2 migration finishes. */}
      {book.podcast_episode_url ? (
        <section className="border-b border-line">
          <div className="container-x grid gap-6 py-10 md:grid-cols-[auto_1fr] md:items-center">
            <div className="flex items-center gap-3 text-accent">
              <Mic className="h-8 w-8" aria-hidden />
              <p className="font-display text-2xl text-ink">Listen to the podcast</p>
            </div>
            <AudioPlayer
              src={book.podcast_episode_url}
              title={`${book.title} — podcast episode`}
              description="Apex Raw Motivation · the audio companion"
              variant="full"
            />
          </div>
        </section>
      ) : null}

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
            <EmailGate bookSlug={book.slug} bookTitle={book.title} utmSource="book-detail-aside" />

            <div className="border border-line bg-bg-subtle p-5 text-sm">
              <p className="eyebrow mb-2">FYI</p>
              <ul className="space-y-2 text-ink-dim">
                <li>· 35-40k words. 90 chapters. One per day of the 90-day program.</li>
                <li>· Audiobook narrated via supervised Polly Neural.</li>
                <li>· Hardcover comes with Printful protective wrap.</li>
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

        {book.related_podcast_slug ? (
          <Link
            href={`/podcast/${book.related_podcast_slug}`}
            className="mt-6 flex items-center gap-3 border border-line bg-bg-subtle p-5 hover:border-accent transition-colors"
          >
            <Mic className="h-5 w-5 text-accent" aria-hidden />
            <div>
              <p className="eyebrow">Related episode</p>
              <p className="font-display text-lg text-ink">Brian walks through this book on the podcast →</p>
            </div>
          </Link>
        ) : null}
      </section>
    </PageShell>
  );
}

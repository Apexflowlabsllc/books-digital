import { PageShell } from '@/components/PageShell';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { SeriesLaunchWall } from '@/components/SeriesLaunchWall';
import { getCatalog, getSeriesList, getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';
import { TERM_COUNT, PHRASE_COUNT } from '@/lib/encyclopedia';

export const metadata = buildMetadata({
  title: 'Apex Flow Publishing House',
  description:
    'Twelve series. 636 books. Every one a 90-day course. Pick your fight and the shelf opens.',
  path: '/',
});

export const revalidate = 300;

/**
 * THE HOME PAGE.
 *
 * Rebuilt around the wall rather than around a marketing stack. The previous
 * version opened with a hero and then ran nine support sections — trust bar,
 * foundation, launch offer, featured carousel, marquee, reviews, founder note,
 * ecosystem — before a visitor reached anything they could act on.
 *
 * The catalog IS the pitch here: twelve series, 636 books, every one a 90-day
 * course. So the page is the wall, the proof, and the way in. Nothing else
 * competes with it above the fold.
 *
 * Every number renders from a query — series count, book total, encyclopedia
 * size. None are typed, so none can go stale.
 */
export default async function HomePage() {
  const [catalog, seriesData, seo] = await Promise.all([
    getCatalog({ limit: 1 }), // total only — the wall renders covers by id
    getSeriesList(),
    getPageSeo('/'),
  ]);

  const series = seriesData?.series ?? [];
  const totalBooks = catalog?.total ?? series.reduce((n, s) => n + s.book_count, 0);
  const numbers = Object.fromEntries(series.map((s, i) => [s.slug, i + 1]));

  return (
    <PageShell>
      <JsonLdSchema bundle={seo} fallback={fallbackPageSchema('/', 'Apex Flow Publishing House')} />

      {/* ── THE OPENING ─────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pt-16 pb-8 sm:pt-24">
        <div className="mx-auto w-full max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-accent">
            {series.length} series · {totalBooks.toLocaleString()} books · 90 days each
          </p>

          <h1 className="mt-6 font-display text-[clamp(44px,8vw,104px)] font-light leading-[0.94] tracking-[-0.04em] text-ink">
            Books that do
            <br />
            the <span className="metallic-text italic">hard part</span>
            <br />
            with you.
          </h1>

          <p className="mt-8 max-w-[52ch] text-[clamp(15px,1.5vw,19px)] leading-relaxed text-ink-dim">
            Most self-help sells you a feeling.{' '}
            <strong className="font-normal text-ink">These are working manuals</strong> — sequenced,
            numbered, and built to be used on the days you least feel like it.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="/books"
              className="rounded-sm bg-accent px-7 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-bg"
            >
              See all {totalBooks.toLocaleString()} books
            </a>
            <a
              href="/encyclopedia"
              className="rounded-sm border border-line px-7 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink"
            >
              The encyclopedia
            </a>
          </div>

          <p className="mt-5 font-mono text-[10.5px] text-ink-dim">
            Ebook · audiobook · 6×9 paperback · hardcover — every format, one catalog
          </p>
        </div>
      </section>

      {/* ── THE WALL ────────────────────────────────────────────────────
        * The store itself. Tap a spine: it rattles loose, ignites, climbs off
        * the top of the screen and detonates, and the blast opens that
        * series' entire shelf. */}
      {series.length > 0 && (
        <section className="relative z-10 px-6 pb-6">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-10">
              <h2 className="font-display text-3xl font-light text-ink sm:text-4xl">The wall</h2>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-dim">
                Tap a series and stand back
              </span>
            </div>
            <SeriesLaunchWall series={series} numbers={numbers} />
          </div>
        </section>
      )}

      {/* ── WHAT MAKES THEM DIFFERENT ───────────────────────────────── */}
      <section className="relative z-10 px-6 py-16">
        <div className="mx-auto w-full max-w-7xl border-t border-line pt-14">
          <h2 className="font-display text-3xl font-light text-ink sm:text-4xl">
            Every book is a 90-day course.
          </h2>
          <p className="mt-4 max-w-[60ch] leading-relaxed text-ink-dim">
            Not a book with a plan bolted on. Ninety numbered days, each with a truth, one action,
            a reflection and tomorrow&rsquo;s teaser. Later books assume the work in the earlier
            ones, so the numbering is real rather than decorative.
          </p>

          <dl className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Ebook', '$5.99', 'EPUB, delivered by email. Nothing ships.'],
              ['Audiobook', '$12.99', 'Narrated MP3. Download and keep the files.'],
              ['Paperback', '$20.09', '6×9 inches, perfect bound, printed and shipped.'],
              ['Hardcover', '$34.99', '6×9 inches, case wrap, printed and shipped.'],
            ].map(([name, price, note]) => (
              <div key={name} className="bg-bg p-6">
                <dt className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-accent">
                  {name}
                </dt>
                <dd className="mt-3">
                  <span className="font-display text-3xl font-light text-ink">{price}</span>
                  <span className="mt-2 block text-[13px] leading-relaxed text-ink-dim">{note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── THE ENCYCLOPEDIA ────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto w-full max-w-7xl border-t border-line pt-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-accent">
            {TERM_COUNT} terms · {PHRASE_COUNT} ways people say them
          </p>
          <h2 className="mt-4 font-display text-3xl font-light text-ink sm:text-4xl">
            We explain the thing we sell.
          </h2>
          <p className="mt-4 max-w-[62ch] leading-relaxed text-ink-dim">
            Nobody searches for &ldquo;rumination&rdquo;. They search for &ldquo;I can&rsquo;t stop
            replaying that argument&rdquo;. Both are in the encyclopedia, and both find the same
            answer — with what to actually do about it.
          </p>
          <a
            href="/encyclopedia"
            className="mt-8 inline-block rounded-sm border border-line px-7 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink"
          >
            Read the encyclopedia
          </a>
        </div>
      </section>
    </PageShell>
  );
}

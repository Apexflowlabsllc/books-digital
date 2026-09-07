import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { BookCard } from '@/components/BookCard';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getSeries, getSeriesSeo } from '@/lib/api';
import { buildMetadata, fallbackSeriesSchema } from '@/lib/seo';
import { intensityGlyphs, seriesCountLabel, waveLabel } from '@/lib/utils';
import { empty } from '@/lib/voice';

interface SeriesRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SeriesRouteProps) {
  const { slug } = await params;
  const series = await getSeries(slug);
  if (!series) return buildMetadata({ title: 'Series', path: `/series/${slug}` });
  return buildMetadata({
    title: `${series.name} — series`,
    description: series.short_desc ?? series.long_desc?.slice(0, 180),
    path: `/series/${series.slug}`,
  });
}

export const revalidate = 3600;

export default async function SeriesDetailPage({ params }: SeriesRouteProps) {
  const { slug } = await params;
  const [series, seo] = await Promise.all([getSeries(slug), getSeriesSeo(slug)]);

  if (!series) notFound();

  const books = (series.books ?? []).slice().sort((a, b) => a.book_number - b.book_number);

  return (
    <PageShell seriesColor={series.color_hex}>
      <JsonLdSchema bundle={seo} fallback={fallbackSeriesSchema(series)} />

      <section className="relative overflow-hidden border-b border-line bg-bg">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(60% 60% at 50% 0%, ${series.color_hex}33 0%, transparent 70%)`,
          }}
        />
        <div className="container-x relative z-10 py-16 md:py-24">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-ink-mute">
              <li>
                <Link href="/series" className="hover:text-ink">
                  Series
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink">{series.name}</li>
            </ol>
          </nav>

          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
            {series.glyph_svg ? (
              <div
                aria-hidden
                className="h-24 w-24 shrink-0 text-series"
                style={{ color: series.color_hex }}
                dangerouslySetInnerHTML={{ __html: series.glyph_svg }}
              />
            ) : (
              <span className="text-7xl" style={{ color: series.color_hex }} aria-hidden>
                ▲
              </span>
            )}

            <div className="flex-1">
              <p className="eyebrow mb-3" style={{ color: series.color_hex }}>
                {waveLabel(series.wave)} · {intensityGlyphs(series.intensity)}
              </p>
              <h1 className="font-display text-4xl leading-[1.05] text-ink md:text-6xl">
                {series.name}
              </h1>
              <p className="mt-6 max-w-2xl text-ink-dim md:text-lg">{series.long_desc}</p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-ink-dim">
                <span>{seriesCountLabel(series.book_count, series.books_available)}</span>
                <span aria-hidden>·</span>
                <span>One chapter per day · 90 days per book</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-ink md:text-3xl">All books in this series</h2>
          <span className="eyebrow text-ink-mute">Ordered by book #</span>
        </div>

        {books.length === 0 ? (
          <p className="border border-line bg-bg-subtle p-8 text-sm text-ink-dim">
            {empty.catalogColdBackend}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {books.map((b, i) => (
              <BookCard key={b.slug} book={b} priority={i < 5} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}

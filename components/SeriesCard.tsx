import Link from 'next/link';
import type { SeriesSummary } from '@/lib/types';
import { intensityGlyphs, seriesCountLabel, waveLabel } from '@/lib/utils';

interface SeriesCardProps {
  series: SeriesSummary;
}

export function SeriesCard({ series }: SeriesCardProps) {
  const colorVar = { '--series-color': series.color_hex } as React.CSSProperties;
  return (
    <Link
      href={`/series/${series.slug}`}
      className="group relative block overflow-hidden border border-line bg-bg p-7 transition-all duration-500 hover:-translate-y-1 hover:border-series"
      style={colorVar}
      data-cursor-label="Enter"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-0 opacity-20 transition-opacity duration-700 group-hover:opacity-50"
        style={{
          background: `radial-gradient(circle at 30% 0%, ${series.color_hex} 0%, transparent 60%)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-px left-0 right-0 h-px scale-x-0 origin-left bg-series transition-transform duration-700 group-hover:scale-x-100"
      />

      <div className="relative z-10 flex h-full flex-col gap-7">
        <div className="flex items-start justify-between">
          {series.glyph_svg ? (
            <div
              aria-hidden
              className="h-14 w-14 text-series transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110"
              dangerouslySetInnerHTML={{ __html: series.glyph_svg }}
            />
          ) : (
            <span
              className="text-4xl text-series transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110"
              aria-hidden
            >
              ▲
            </span>
          )}
          <span className="eyebrow text-series">{waveLabel(series.wave)}</span>
        </div>

        <div>
          <h3 className="font-display text-2xl leading-tight text-ink md:text-3xl">
            {series.name}
          </h3>
          <p className="mt-2 text-sm text-ink-dim">
            {seriesCountLabel(series.book_count, series.books_available)} · {intensityGlyphs(series.intensity)}
          </p>
        </div>

        <p className="text-sm text-ink-dim">
          <span className="text-ink-mute">e.g.</span> {series.sample_title}
        </p>

        <span className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink-dim transition-colors duration-300 group-hover:text-series">
          Enter series
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

import Link from 'next/link';
import type { BookSummary } from '@/lib/types';
import { Cover } from './Cover';
import { intensityGlyphs, priceDisplay, sortFormats, waveLabel } from '@/lib/utils';
import { LAUNCH } from '@/lib/launch';

interface BookCardProps {
  book: BookSummary;
  priority?: boolean;
}

export function BookCard({ book, priority }: BookCardProps) {
  const formats = sortFormats(book.formats);
  const ebook = formats.find((f) => f.format === 'ebook');

  return (
    <Link
      href={`/books/${book.slug}`}
      className="group block"
      data-cursor-label="Open"
      style={
        book.series_color
          ? ({ '--series-color': book.series_color } as React.CSSProperties)
          : undefined
      }
    >
      <div className="relative">
        <Cover
          r2Key={book.cover_r2_key}
          alt={book.cover_alt ?? `${book.title} — book cover`}
          priority={priority}
          tilt
          className="transition-all duration-500 group-hover:shadow-[0_30px_60px_-20px_rgba(217,204,140,0.45)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-4 -z-10 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(50% 60% at 50% 50%, ${
              book.series_color ?? '#D9CC8C'
            }44 0%, transparent 70%)`,
          }}
        />
        {LAUNCH.active ? (
          <span
            aria-label={`${LAUNCH.percent}% off with code ${LAUNCH.code}`}
            className="pointer-events-none absolute right-2 top-2 z-10 rotate-3 border border-accent bg-bg/90 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent backdrop-blur-sm"
            style={{
              boxShadow: '0 6px 18px -6px rgba(217,204,140,0.55)',
            }}
          >
            {LAUNCH.badgeLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-px w-6 bg-series/50" />
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent/70">
            {book.series_name} · {waveLabel(book.wave)}
          </p>
        </div>
        <h3 className="font-display text-[1.25rem] leading-[1.15] text-ink transition-colors duration-300 group-hover:text-series">
          {book.title}
        </h3>
        <div className="flex items-center justify-between pt-2 text-xs">
          <span aria-label="Voice intensity" title="Voice intensity" className="text-accent/70 tracking-widest">
            {intensityGlyphs(book.voice_intensity)}
          </span>
          <span className="font-mono text-cream font-medium">{priceDisplay(ebook)}</span>
        </div>
      </div>
    </Link>
  );
}

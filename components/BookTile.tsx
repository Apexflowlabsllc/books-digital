import Link from 'next/link';
import Image from 'next/image';
import type { BookSummary } from '@/lib/types';
import { imageProxy, priceDisplay, sortFormats } from '@/lib/utils';

/**
 * ONE BOOK, SMALL.
 *
 * The catalog card used to be the same object as the featured card: a large
 * 2:3 cover, a tilt, a hover bloom, a rotated gold sale badge and three lines
 * of gold type. One of those is a nice card. Six hundred and thirty-six of
 * them is a wall.
 *
 * So this is the shelf version. The cover carries the identity — Brian's
 * artwork is the only thing that needs to be loud — and everything else drops
 * to a title and a price. No badge, no glow, no gold label. The sale is
 * announced once in the banner rather than 636 times in the grid.
 *
 * Hover is a two-pixel rule in the SERIES colour, not a bloom, which is what
 * keeps twelve series legible as twelve different things.
 */
export function BookTile({ book }: { book: BookSummary }) {
  const src = imageProxy(book.cover_r2_key);
  const ebook = sortFormats(book.formats).find((f) => f.format === 'ebook');

  return (
    <Link
      href={`/books/${book.slug}`}
      className="tile"
      data-cursor-label="Open"
      style={{ ['--series' as string]: book.series_color ?? '#C98B3E' }}
    >
      <span className="tile-art">
        {src ? (
          <Image
            src={src}
            alt={book.cover_alt ?? `${book.title} — book cover`}
            fill
            sizes="(min-width:1280px) 132px, (min-width:640px) 18vw, 40vw"
            className="object-cover"
          />
        ) : (
          <span className="tile-pending" aria-hidden>
            ▲
          </span>
        )}
      </span>
      <span className="tile-title">{book.title}</span>
      <span className="tile-price">{priceDisplay(ebook)}</span>
    </Link>
  );
}

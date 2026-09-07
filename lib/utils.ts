import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { env } from './env';
import type { Format, FormatPrice, Wave } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function imageProxy(r2Key: string | undefined): string {
  if (!r2Key) return '';
  if (r2Key.startsWith('http')) return r2Key;
  const trimmed = r2Key.replace(/^\/+/, '');
  return `${env.backendUrl}/api/shop/image/${trimmed}`;
}

export function audioStream(slug: string, type: 'sample' | 'audiobook' | 'podcast'): string {
  return `${env.backendUrl}/api/books/stream/${slug}?type=${type}`;
}

export function audioDownload(slug: string): string {
  return `${env.backendUrl}/api/books/download/${slug}`;
}

const FORMAT_ORDER: Format[] = ['ebook', 'paperback', 'hardcover', 'audiobook'];

export function formatLabel(format: Format): string {
  switch (format) {
    case 'ebook':
      return 'eBook';
    case 'paperback':
      return 'Paperback';
    case 'hardcover':
      return 'Hardcover';
    case 'audiobook':
      return 'Audiobook';
  }
}

// Locked Master §1.5 prices — used only as fallback display copy. NEVER use
// for actual price math; the buy button always pulls from the backend price.
export const MASTER_PRICING: Record<Format, number> = {
  ebook: 699,
  paperback: 1499,
  hardcover: 2499,
  audiobook: 1995,
};

export function sortFormats(formats: FormatPrice[] = []): FormatPrice[] {
  return [...formats].sort(
    (a, b) => FORMAT_ORDER.indexOf(a.format) - FORMAT_ORDER.indexOf(b.format),
  );
}

export function priceDisplay(p: FormatPrice | undefined): string {
  if (!p || !p.available || typeof p.price_cents !== 'number') return 'Coming soon';
  return `$${(p.price_cents / 100).toFixed(2)}`;
}

/** "53 books" once a series is fully real; "36 of 53 books" while it's still
 *  filling in. Never just the planned total on its own once it stops being true. */
export function seriesCountLabel(planned: number, available: number): string {
  if (available >= planned) return `${planned} books`;
  return `${available} of ${planned} books`;
}

const WAVE_LABEL: Record<Wave, string> = {
  1: 'Wave I — Foundation',
  2: 'Wave II — Pressure',
  3: 'Wave III — Edge',
  4: 'Wave IV — Apex',
};

export function waveLabel(w: Wave | undefined): string {
  return (w && WAVE_LABEL[w]) || '';
}

export function intensityGlyphs(n: number | undefined, max = 9): string {
  if (!n || n < 1) return '';
  const filled = Math.min(Math.max(Math.round(n), 1), max);
  return '⚔'.repeat(filled);
}

export function formatDurationFromSeconds(s: number | undefined): string {
  if (!s || s <= 0) return '';
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}

export function absoluteUrl(path: string): string {
  const base = env.siteUrl.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

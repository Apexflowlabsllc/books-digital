import Link from 'next/link';
import { ArrowUpRight, Sparkles, Tag, Clock } from 'lucide-react';
import { LAUNCH, launchPrice, launchCountdownLabel } from '@/lib/launch';

interface LaunchOfferProps {
  totalBooks?: number;
}

interface FormatRow {
  label: string;
  helper: string;
  price: number;
  highlight?: boolean;
}

const FORMATS: FormatRow[] = [
  { label: 'Ebook', helper: 'ePub + PDF, instant', price: 5.99 },
  { label: 'Audiobook', helper: 'MP3, instant', price: 12.99 },
  { label: 'Bundle — ebook + audiobook', helper: 'Best deal', price: 16.99, highlight: true },
  { label: 'Paperback (signed)', helper: 'Ships in 5-7 days', price: 19.99 },
  { label: 'Hardcover (signed)', helper: 'Ships in 5-7 days', price: 34.99 },
];

function formatPrice(usd: number): string {
  return usd % 1 === 0 ? `$${usd.toFixed(0)}` : `$${usd.toFixed(2)}`;
}

/* Big mid-page launch-offer section. Replaces the "Fresh from the
 * warehouse" Featured carousel during the launch window. Self-hides
 * when LAUNCH.active is false (commit to lib/launch.ts and the section
 * disappears in one commit). No client state — server-rendered, fully
 * static.
 */
export function LaunchOffer({ totalBooks }: LaunchOfferProps) {
  if (!LAUNCH.active) return null;

  const booksLabel = totalBooks && totalBooks > 0 ? totalBooks.toLocaleString() : '636';
  const countdown = launchCountdownLabel();

  return (
    <section
      id="launch-offer"
      className="relative z-10 overflow-hidden py-12 sm:py-24 lg:py-32"
    >
      {/* Decorative radial accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #D9CC8C 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, #4A5C44 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-6 lg:px-10">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow-rail mx-auto justify-center">
            <Sparkles className="h-3 w-3" aria-hidden />
            <span>§03 · Launch Week · {LAUNCH.percent}% off</span>
          </p>
          {countdown ? (
            <p className="mt-4 inline-flex items-center gap-2 border border-accent/30 bg-bg-subtle/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
              <Clock className="h-3 w-3" aria-hidden />
              <span>{countdown}</span>
            </p>
          ) : null}
          <h2
            className="mt-7 font-display font-light leading-[0.95] tracking-[-0.04em] text-cream"
            style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
          >
            Open the library.
            <br />
            <span className="metallic-text italic font-extralight">Save {LAUNCH.percent}%.</span>
          </h2>
          <p className="mt-8 mx-auto max-w-2xl text-base leading-[1.7] text-ink-dim md:text-lg">
            One code. Every book. Every format. The launch promo runs for the first week — when
            it&rsquo;s gone, prices return to full retail. No "limited time" theater.
          </p>
        </div>

        {/* Code reveal — big and unmissable */}
        <div className="mx-auto mt-10 flex max-w-2xl flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div
            className="relative flex flex-1 items-center justify-between gap-4 border border-accent/60 bg-bg-subtle/80 px-6 py-5"
            style={{
              boxShadow: '0 0 36px -8px rgba(217,204,140,0.35)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-accent" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-mute">
                Use code
              </span>
            </div>
            <span className="font-mono text-3xl font-bold tracking-[0.2em] text-accent sm:text-4xl">
              {LAUNCH.code}
            </span>
          </div>
          <Link
            href="/books"
            className="cta-primary justify-center"
            data-cursor-label="Browse"
          >
            <span>Browse the {booksLabel}</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden strokeWidth={2.5} />
          </Link>
        </div>

        {/* Price grid — every format with strikethrough */}
        <div className="mt-14">
          <p className="eyebrow mb-4 text-center text-ink-dim">All 5 formats — every book</p>
          <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FORMATS.map((f) => {
              const discounted = launchPrice(f.price);
              return (
                <li
                  key={f.label}
                  className={
                    'border p-4 transition-colors ' +
                    (f.highlight
                      ? 'border-accent bg-bg-raised'
                      : 'border-line bg-bg-subtle')
                  }
                >
                  <p
                    className={
                      'font-display text-base ' + (f.highlight ? 'text-accent' : 'text-ink')
                    }
                  >
                    {f.label}
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink-mute">{f.helper}</p>
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="font-mono text-[13px] text-ink-mute line-through">
                      {formatPrice(f.price)}
                    </span>
                    <span
                      className={
                        'font-display text-2xl ' + (f.highlight ? 'text-accent' : 'text-ink')
                      }
                    >
                      {formatPrice(discounted)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Secondary CTAs */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/books/discipline"
            className="cta-secondary"
            data-cursor-label="Start"
          >
            <span>Start with Discipline →</span>
          </Link>
          <Link
            href="/free-chapter/the-discipline-blueprint"
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-dim transition-colors hover:text-accent"
          >
            or grab chapter one free
          </Link>
        </div>

        <p className="mt-10 text-center text-[11px] text-ink-mute">
          Code auto-applies at Stripe Checkout. Works on every book, every format — including
          signed paperback + hardcover.
        </p>
      </div>
    </section>
  );
}

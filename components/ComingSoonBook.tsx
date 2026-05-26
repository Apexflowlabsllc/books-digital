import Link from 'next/link';
import { ArrowLeft, ArrowRight, Mail, Sparkles } from 'lucide-react';
import { Cover } from './Cover';
import { EmailGate } from './EmailGate';
import { plannedDropLabel } from '@/lib/series-status';
import { waveLabel } from '@/lib/utils';
import type { BookDetail } from '@/lib/types';

interface ComingSoonBookProps {
  book: BookDetail;
}

/* Coming-soon variant of /books/<slug>. Used for any book in a series
 * Brian hasn't finished writing yet (S06–S12 at time of launch). The
 * normal purchase stack + audio + sample/reviews/FAQ all get hidden
 * since there's no real content to ship — replaced with a Coming Soon
 * panel + notify-me capture so the listing still pays its SEO rent
 * and any inbound traffic gets converted to a lead.
 */
export function ComingSoonBook({ book }: ComingSoonBookProps) {
  const dropLabel = plannedDropLabel(book.wave);

  return (
    <>
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

      {/* Hero — cover + minimal text + Coming Soon panel */}
      <section className="container-x grid gap-10 py-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:py-16">
        <div className="md:max-w-sm">
          <Cover
            r2Key={book.cover_r2_key}
            alt={book.cover_alt ?? `${book.title} — cover`}
            priority
            className="border border-line opacity-90"
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

          {/* Coming Soon panel — replaces the purchase stack */}
          <div
            className="mt-8 border border-accent/50 bg-bg-subtle p-6"
            style={{ boxShadow: '0 0 24px -8px rgba(217,204,140,0.35)' }}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-accent" aria-hidden />
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
                {dropLabel}
              </p>
            </div>
            <h2 className="mt-3 font-display text-2xl text-ink md:text-3xl">
              <span className="metallic-text">Coming soon.</span>
            </h2>
            <p className="mt-3 text-sm leading-[1.6] text-ink-dim md:text-base">
              {book.series_name} is on Brian&rsquo;s desk now. No early access, no preorder
              gimmick — when it ships, you&rsquo;ll get a note. That&rsquo;s it.
            </p>

            <ul className="mt-5 space-y-1.5 text-[12px] text-ink-mute">
              <li>· Ebook · audiobook · bundle · signed paperback · signed hardcover</li>
              <li>· Same launch-week discount window when it drops</li>
              <li>· No spam between now and ship day</li>
            </ul>
          </div>

          {/* Notify-me capture */}
          <div className="mt-6 flex items-center gap-3 text-ink-dim">
            <Mail className="h-4 w-4 text-accent" aria-hidden />
            <p className="text-sm">Drop your email — we&rsquo;ll send a note the day it ships.</p>
          </div>
          <div className="mt-3">
            <EmailGate
              bookId={book.book_id}
              bookSlug={book.slug}
              bookTitle={book.title}
              utmSource="coming-soon"
            />
          </div>

          <p className="mt-6 text-sm text-ink-dim">
            Want something to read now?{' '}
            <Link href="/books" className="text-accent underline-offset-4 hover:underline">
              The 5 live series are here →
            </Link>
          </p>
        </div>
      </section>

      {/* Series nav — keep so readers can move sideways */}
      <section className="container-x py-12">
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
      </section>
    </>
  );
}

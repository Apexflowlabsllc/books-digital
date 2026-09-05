import Link from 'next/link';
import type { BookDetail } from '@/lib/types';

/**
 * THE FOUR QUESTIONS, ANSWERED BEFORE THE SCROLL.
 *
 * A visitor landing on a book page had to infer what the book was for from a
 * long description. This answers, in one screen, the questions the SOP names:
 * what is it, what problem does it solve, how long does it take, who wrote it.
 *
 * EVERY ANSWER IS DERIVED FROM REAL DATA. Nothing here is written per book by
 * hand and nothing is invented:
 *
 *   what      title + subtitle + series, all from the catalog
 *   problem   the leaf of the book's own BISAC category
 *             ("Self-Help > Personal Transformation > Self-Discipline")
 *   long      the 90-day structure, which is the product's actual design
 *   author    Brian, linked to the proof page rather than asserted
 *
 * "Who is it for?" is deliberately ABSENT. The catalog has no audience field.
 * The keyword list hints at one — "discipline book for tired dads
 * entrepreneurs" — but parsing marketing keywords into a claim about who
 * should buy a book is inventing an answer and dressing it as data. It goes in
 * when the catalog carries it.
 *
 * The same four answers are emitted as FAQPage entries by the page, so an
 * answer engine lifting one gets the same sentence a reader sees. Never a
 * separate machine-only version.
 */

/** The most specific real category the book carries, e.g. "Self-Discipline". */
export function problemFor(book: BookDetail): string | null {
  const first = (book.categories ?? []).find((c) => typeof c === 'string' && c.trim());
  if (!first) return null;
  const leaf = first.split('>').pop()?.trim();
  return leaf && leaf.length > 1 ? leaf : null;
}

export function bookAnswers(book: BookDetail): { q: string; a: string }[] {
  const problem = problemFor(book);
  const out: { q: string; a: string }[] = [];

  out.push({
    q: `What is ${book.title}?`,
    a: `${book.title} is a 90-day programme from the ${book.series_name} series by Brian Spiker${
      book.subtitle ? ` — ${book.subtitle}` : ''
    }. Ninety numbered chapters, one a day, each with a truth, one action and a reflection.`,
  });

  if (problem) {
    out.push({
      q: `What problem does ${book.title} solve?`,
      a: `${problem}. It sits in the ${book.series_name} series, which is the ${book.series_name.toLowerCase()} front of the Apex Flow library.`,
    });
  }

  out.push({
    q: `How long does ${book.title} take?`,
    a: '90 days. One chapter a day, in order — the numbering is the programme, not decoration. Later books assume the work done in earlier ones.',
  });

  out.push({
    q: `Who wrote ${book.title}?`,
    a: 'Brian Spiker, who has run Spiker Carpet and Tile Care since 2013. He writes from operating a real service business, not from a podcast booth.',
  });

  return out;
}

export function BookAnswers({ book }: { book: BookDetail }) {
  const answers = bookAnswers(book);
  const problem = problemFor(book);

  return (
    <section className="container-x py-12" aria-labelledby="book-answers">
      <div className="border-t border-line pt-10">
        <h2 id="book-answers" className="eyebrow mb-6">
          Straight answers
        </h2>

        {problem && (
          <p className="mb-8 max-w-[62ch] text-[15px] leading-relaxed text-ink-dim">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              Solves
            </span>
            <br />
            <span className="font-display text-2xl font-light text-ink">{problem}</span>
          </p>
        )}

        <dl className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
          {answers.map(({ q, a }) => (
            <div key={q} className="bg-bg p-6">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">{q}</dt>
              <dd className="mt-3 text-[14px] leading-relaxed text-ink-dim">{a}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-[13px] text-ink-dim">
          More on the author:{' '}
          <Link href="/about-brian" className="text-accent underline">
            About Brian
          </Link>{' '}
          ·{' '}
          <Link href="/brian-spiker-real-world-proof" className="text-accent underline">
            the receipts
          </Link>{' '}
          ·{' '}
          <Link href={`/series/${book.series_slug}`} className="text-accent underline">
            the {book.series_name} series
          </Link>
        </p>
      </div>
    </section>
  );
}

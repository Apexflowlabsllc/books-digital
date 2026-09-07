'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { BookSummary } from '@/lib/types';
import { matchProblem } from '@/lib/problemMatch';
import { findProblem, problemSlug } from '@/lib/problems';
import { findPostByTerm } from '@/lib/blog';
import { BookTile } from './BookTile';

/**
 * SAY WHAT'S GOING ON. GET A REAL ANSWER.
 *
 * A free-text box, not a keyword filter. Someone types the actual sentence —
 * "I feel so trauma bonded, I don't know how to escape" — and gets back the
 * real explanation (from the encyclopedia, the same source that powers every
 * problem page) plus the books that work on it. No signup, no gate.
 *
 * Runs entirely on data already on the page (encyclopedia + catalog), so the
 * answer appears as fast as they finish typing. Nothing here is invented per
 * query — it is the same matcher, the same definitions, the same books used
 * everywhere else on the site.
 */
export function GuideSearch({ books }: { books: BookSummary[] }) {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');

  const match = useMemo(() => (submitted ? matchProblem(submitted, books) : null), [submitted, books]);

  const problemPage = match?.concept ? findProblem(problemSlug(match.concept.term)) : undefined;
  const post = match?.concept ? findPostByTerm(match.concept.term) : undefined;

  return (
    <div className="rounded-sm border border-line bg-bg-subtle p-6 sm:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
        Tell us what&apos;s going on
      </p>
      <h2 className="mt-3 max-w-[40ch] font-display text-[24px] font-light leading-snug text-ink sm:text-[28px]">
        Free. No signup. Just say it the way you&apos;d say it out loud.
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(query);
        }}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. I feel so trauma bonded, I don't know how to escape"
          className="flex-1 rounded-sm border border-line bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="whitespace-nowrap rounded-sm bg-accent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-bg transition-opacity hover:opacity-90"
        >
          Get the answer
        </button>
      </form>

      <p className="mt-3 text-[12px] text-ink-mute">
        This isn&apos;t medical or legal advice — it&apos;s the same real guidance behind every book here.
      </p>

      {match && (
        <div className="mt-8 border-t border-line pt-8">
          {match.concept ? (
            <>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                {match.concept.term}
              </p>
              <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink">
                {match.concept.definition}
              </p>
              {match.concept.hook && (
                <p className="mt-4 max-w-[58ch] font-display text-[18px] font-light leading-snug text-accent">
                  {match.concept.hook}
                </p>
              )}
              <div className="mt-5 max-w-[62ch] border-l-2 border-accent/60 pl-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  What to do about it
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">{match.concept.action}</p>
              </div>
              {(post || problemPage) && (
                <p className="mt-5 text-[13px]">
                  <Link
                    href={post ? `/blog/${post.slug}` : `/problems/${problemPage!.slug}`}
                    className="text-accent underline"
                  >
                    Read the full breakdown →
                  </Link>
                </p>
              )}
            </>
          ) : (
            <p className="text-[14px] text-ink-dim">
              Didn&apos;t find an exact match for that one yet — here&apos;s the closest ground we cover.
            </p>
          )}

          {match.books.length > 0 && (
            <div className="mt-8">
              <p className="text-[13px] text-ink-dim">
                We have a 90-day course that works directly on this:
              </p>
              <div className="shelf-grid mt-4">
                {match.books.slice(0, 4).map((b) => (
                  <BookTile key={b.slug} book={b} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

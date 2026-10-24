'use client';

import { useState } from 'react';
import { Loader2, Star } from 'lucide-react';
import type { ReviewExcerpt } from '@/lib/types';
import { cn } from '@/lib/utils';
import { env } from '@/lib/env';

type Review = ReviewExcerpt;

interface BookReviewsProps {
  bookSlug: string;
  bookTitle: string;
  initial: Review[];
  summary?: { count: number; averageRating: number };
}

const SOURCE_LABEL: Record<Review['source'], string> = {
  spiker: 'Customer of Brian’s cleaning business (not a review of this book)',
  amazon: 'Amazon verified',
  goodreads: 'Goodreads',
  'verified-reader': 'Verified reader',
  reader: 'Reader review (purchase not verified)',
};

// Reviews block — patterned after components/apex/Reviews.tsx in
// apex-flow-labs. Posts new reviews to /api/v1/books/<slug>/reviews on the
// backend, which handles moderation + a thank-you code on first review.
export function BookReviews({ bookSlug, bookTitle, initial, summary }: BookReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // Ratings are about THIS book only: customer quotes about Brian's cleaning
  // business ('spiker') are shown, labelled, but never counted in the rating.
  // The backend summary is not used, because it cannot be checked here.
  const rated = reviews.filter((r) => r.source !== 'spiker' && typeof r.rating === 'number');
  void summary;
  const avg = rated.length ? rated.reduce((s, r) => s + (r.rating ?? 0), 0) / rated.length : 0;
  const count = rated.length;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${env.backendUrl}/api/v1/books/${bookSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, rating, title, body }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        id?: string;
        status?: 'approved' | 'pending';
        verified_purchase?: boolean;
        thankYouCode?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      if (data.thankYouCode) {
        setSuccess(
          `Filed. Thank-you code for 20% off your next order: ${data.thankYouCode} (given for submitting a review, whatever your rating).`,
        );
      } else {
        setSuccess('Filed. Reads after moderation — usually within 48 hours.');
      }

      if (data.status === 'approved' && data.id) {
        setReviews([
          {
            id: data.id,
            rating,
            body,
            author: email.replace(/^(.).+@(.+)$/, '$1***@$2'),
            // Only claim "verified" when the order system says so.
            source: data.verified_purchase ? 'verified-reader' : 'reader',
          },
          ...reviews,
        ]);
      }
      setShowForm(false);
      setEmail('');
      setTitle('');
      setBody('');
      setRating(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="border-t border-line bg-bg-subtle/40">
      <div className="container-x py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.36em] text-accent">Reader file</p>
            <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
              Reviews for{' '}
              <span className="metallic-text">{bookTitle}</span>
            </h2>
            {count > 0 ? (
              <p className="mt-3 flex items-center gap-3 text-sm text-ink-dim">
                <span className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i < Math.round(avg) ? 'fill-accent text-accent' : 'text-line',
                      )}
                    />
                  ))}
                </span>
                <span>
                  <span className="font-semibold text-accent">{avg.toFixed(1)}</span> ·{' '}
                  {count} review{count === 1 ? '' : 's'}
                </span>
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="cta-primary rounded-full px-5 py-2.5 tracking-[0.24em]"
          >
            <span>{showForm ? 'Cancel' : 'Leave a review'}</span>
          </button>
        </div>

        {showForm ? (
          <form
            onSubmit={submit}
            className="mb-10 rounded-[1.5rem] border border-accent/30 bg-bg/60 p-6 backdrop-blur-md md:p-8"
          >
            <div className="grid gap-5 md:grid-cols-[200px_1fr]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-ink-mute">Rating</p>
                <div className="mt-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRating(r)}
                      onMouseEnter={() => setHoverRating(r)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${r} star${r === 1 ? '' : 's'}`}
                    >
                      <Star
                        className={cn(
                          'h-7 w-7 transition-colors',
                          r <= (hoverRating || rating)
                            ? 'fill-accent text-accent'
                            : 'text-line',
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  aria-label="Your email (not shown in full)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[0.75rem] border border-line bg-bg px-4 py-2.5 text-sm text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none"
                />
                <input
                  aria-label="Review headline (optional)"
                  placeholder="Headline (optional) — e.g. 'Read this if you ship'"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-[0.75rem] border border-line bg-bg px-4 py-2.5 text-sm text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none"
                />
                <textarea
                  aria-label="Your review"
                  placeholder="Tell future readers what hit and what didn't. R-rated welcome."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  required
                  className="w-full rounded-[0.75rem] border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="cta-primary"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : null}
                <span>{submitting ? 'Submitting' : 'Submit review'}</span>
              </button>
              <p className="basis-full text-xs text-ink-dim">
                Reviewers get a 20% discount code for submitting a review, whether it is positive or negative. Your email is used to send the
                code and is not shown in full. Reviews are moderated, and approved text is published. See the{' '}
                <a href="/editorial-policy" className="underline underline-offset-2">Editorial policy</a> and{' '}
                <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>.
              </p>
              {error ? <p className="text-xs text-accent-hot">{error}</p> : null}
              {success ? <p className="text-xs text-accent">{success}</p> : null}
            </div>
          </form>
        ) : null}

        {reviews.length === 0 ? (
          <p className="rounded-[1.5rem] border border-line bg-bg/50 p-8 text-sm text-ink-dim">
            No reviews yet. Be the first. Reviewers get a 20% code for submitting a review, positive or negative.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <article
                key={r.id}
                className="flex h-full flex-col rounded-[1.25rem] border border-line bg-bg/60 p-6 backdrop-blur-md transition-colors hover:border-accent/60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-3.5 w-3.5',
                          i < (r.rating ?? 5) ? 'fill-accent text-accent' : 'text-line',
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-ink-mute">
                    {SOURCE_LABEL[r.source]}
                  </span>
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink">
                  {r.body}
                </blockquote>
                <p className="mt-4 text-[11px] text-ink-mute">— {r.author}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

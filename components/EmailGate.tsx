'use client';

import { useState, useTransition } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { tone } from '@/lib/voice';
import { sendFreeChapter } from '@/lib/free-chapter';

interface EmailGateProps {
  // Backend keys on bookId (s01_b01). When unavailable, the route falls
  // back to a random peer book's chapter (and labels it as such in the
  // email body) so a missing manuscript never blocks the capture.
  bookId?: string;
  bookSlug: string;
  bookTitle: string;
  utmSource?: string;
}

/* POSTs to /api/v1/books/free-chapter. Backend renders chapter 1 as
 * styled HTML and sends via Resend. We only paint "Sent." after the
 * response confirms both ok=true AND a Resend message_id — that's the
 * proof the email actually queued. Previous endpoint returned 200 even
 * when delivery failed; a customer complained, so the new contract is:
 * no message_id = no success state.
 */
export function EmailGate({ bookId, bookSlug, bookTitle, utmSource }: EmailGateProps) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Real email or nothing.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await sendFreeChapter({ bookId, bookSlug, email, utmSource });
      if (result.ok) {
        setDone(true);
      } else {
        setError('Email service is briefly down. Try again in 60 seconds.');
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[EmailGate] sendFreeChapter failed:', result.error);
        }
      }
    });
  }

  if (done) {
    return (
      <div className="border border-accent bg-bg-subtle p-6 text-sm">
        <p className="font-display text-2xl text-accent">Sent.</p>
        <p className="mt-2 text-ink-dim">
          Check inbox + promo tab in the next 60 seconds. Chapter one of{' '}
          <span className="text-ink">{bookTitle}</span> is on its way. If you don&rsquo;t
          see it, hit reply on any of our emails — Brian reads them.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-line bg-bg-subtle p-6">
      <p className="eyebrow mb-3">Free chapter — {bookTitle}</p>
      <label htmlFor="email" className="sr-only">
        Email
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute"
            aria-hidden
          />
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourdomain.com"
            className="w-full border border-line bg-bg px-9 py-3 text-sm text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none"
          />
        </div>
        <button type="submit" disabled={isPending} className="cta-primary">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          {isPending ? 'Sending' : 'Send chapter one'}
        </button>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-xs text-accent-hot">
          {error}
        </p>
      ) : (
        <p className="mt-3 text-xs text-ink-mute">{tone.freeChapterHelper}</p>
      )}
    </form>
  );
}

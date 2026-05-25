'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { env } from '@/lib/env';

interface LeadCaptureProps {
  sourcePage?: string;
  optInAsset?: string;
  bookSlug?: string;
  heading?: string;
  subheading?: string;
  cta?: string;
}

// Standalone email-capture block — mirrors the LeadCaptureForm pattern from
// the digital-art landing in apex-flow-labs. POSTs to the backend
// /api/v1/lead-magnets/free-chapter (the same endpoint as the per-book
// gate), but accepts a generic source / optInAsset so the same component
// can drop into homepage banners, pricing pages, etc.
export function LeadCapture({
  sourcePage = '/',
  optInAsset = 'general',
  bookSlug = 'the-discipline-blueprint',
  heading = 'Free chapter + 15% off',
  subheading = 'Drop your email — we send chapter one and a one-time 15% discount code for your first order. No drip, no upsell.',
  cta = 'Send it',
}: LeadCaptureProps) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Real email or nothing.');
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        // Default to s01_b01 — this capture isn't tied to a specific
        // book detail page so we use the canonical first book; the
        // backend's peer fallback covers missing manuscripts.
        const res = await fetch(
          `${env.backendUrl}/api/v1/books/free-chapter`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookId: 's01_b01',
              email,
              bookSlug,
              utmSource: sourcePage,
              optInAsset,
            }),
          },
        );
        if (!res.ok) throw new Error(`free-chapter ${res.status}`);
        const data = (await res.json()) as { ok?: boolean; message_id?: string };
        if (!data.ok || !data.message_id) {
          throw new Error('Email queued without a delivery id.');
        }
        setDone(true);
      } catch (err) {
        setError('Email service is briefly down. Try again in 60 seconds.');
        console.error(err);
      }
    });
  }

  if (done) {
    return (
      <div className="rounded-[2rem] border border-accent/40 bg-gradient-to-br from-accent/15 to-accent/5 p-10 backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-[0.36em] text-accent">Sent</p>
        <h3 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Chapter one is on its way.</h3>
        <p className="mt-4 text-sm text-ink-dim">
          Check inbox + promo tab. The 15% code is in the same email. We will not spam — we
          send when we have something to say.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-accent/30 bg-gradient-to-br from-accent/15 to-transparent p-10 backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-[0.36em] text-accent">Free preview</p>
      <h3 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{heading}</h3>
      <p className="mt-4 text-sm text-ink-dim">{subheading}</p>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yourdomain.com"
          className="flex-1 rounded-full border border-line bg-bg/80 px-5 py-3.5 text-sm text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="cta-primary rounded-full px-8 py-3.5 tracking-[0.28em] disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="inline h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <span>{cta}</span>
          )}
        </button>
      </form>
      {error ? (
        <p role="alert" className="mt-3 text-xs text-accent-hot">
          {error}
        </p>
      ) : null}
    </div>
  );
}

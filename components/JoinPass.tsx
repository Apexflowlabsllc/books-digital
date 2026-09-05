'use client';

import { useState } from 'react';
import { env } from '@/lib/env';

/**
 * THE $99 PASS CHECKOUT, WHICH DID NOT WORK.
 *
 * The membership page shipped a plain HTML form:
 *
 *   <form action=".../api/v1/checkout/start" method="post">
 *     <input type="hidden" name="product" value="books-insider-pass" />
 *
 * That was wrong three separate ways against the real contract:
 *
 *   1. It posted application/x-www-form-urlencoded. The endpoint parses JSON
 *      and answers "Invalid JSON body".
 *   2. The field is `product_slug`, not `product`, and `product_type` and
 *      `brand` are both required.
 *   3. The slug is `apex-insider-pass`. `books-insider-pass` is rejected with
 *      "Unknown membership slug".
 *
 * Verified against production: that exact payload returns 400. And because a
 * plain form POST navigates the browser, a buyer clicking "Get the Pass" did
 * not see an error message — they landed on a raw JSON error page and the sale
 * was gone. The Pass has never been purchasable from this site.
 *
 * This posts the real contract, follows `checkout_url` to Stripe, and — the
 * part the form could never do — keeps the buyer on the page and tells them
 * what happened if anything fails.
 */

const CHECKOUT = `${env.backendUrl}/api/v1/checkout/start`;

export function JoinPass({ label = 'Get the Pass — $99/yr' }: { label?: string }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const res = await fetch(CHECKOUT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: 'apex-digital',
          product_type: 'membership',
          product_slug: 'apex-insider-pass',
          ...(email.trim() ? { email: email.trim() } : {}),
          success_url: `${env.siteUrl}/thanks`,
          cancel_url: `${env.siteUrl}/membership`,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { checkout_url?: string; error?: { message?: string } }
        | null;

      if (res.ok && data?.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }

      /* Never a dead end. If checkout cannot start, say so and leave the
       * buyer somewhere they can still act. */
      setError(
        data?.error?.message ||
          'Checkout could not start just now. Try again, or email brian@apexflowlabs.com and we will set it up by hand.',
      );
    } catch {
      setError(
        'Could not reach checkout — that is usually a connection blip. Try again in a moment.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={go} className="mx-auto mt-8 flex w-full max-w-md flex-col items-center gap-3">
      <label htmlFor="pass-email" className="sr-only">
        Email address
      </label>
      <input
        id="pass-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@yourdomain.com"
        autoComplete="email"
        className="w-full border border-line bg-bg px-4 py-3 text-center text-sm text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none"
      />
      <button type="submit" disabled={busy} className="cta-primary w-full px-10 py-4 text-base">
        {busy ? 'Starting checkout…' : label}
      </button>

      {error ? (
        <p role="alert" className="mt-1 max-w-sm text-center text-[13px] leading-relaxed text-accent">
          {error}
        </p>
      ) : (
        <p className="text-xs text-ink-mute">Or buy one at a time. Up to you.</p>
      )}
    </form>
  );
}

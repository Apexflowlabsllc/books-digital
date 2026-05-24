'use client';

import { useState, useTransition } from 'react';
import { Loader2, Download, Headphones, Layers } from 'lucide-react';
import type { BookDetail } from '@/lib/types';
import { env } from '@/lib/env';

type DirectFormat = 'ebook' | 'audiobook' | 'bundle';

interface PriceSelectorProps {
  book: BookDetail;
}

interface BuyButtonProps {
  format: DirectFormat;
  label: string;
  helper: string;
  priceUsd: number;
  icon: React.ReactNode;
  highlight?: boolean;
  onBuy: (format: DirectFormat) => void;
  busy: boolean;
}

function formatPrice(usd: number): string {
  // Strip trailing .00 — $5 reads cleaner than $5.00.
  return usd % 1 === 0 ? `$${usd.toFixed(0)}` : `$${usd.toFixed(2)}`;
}

function BuyButton({ format, label, helper, priceUsd, icon, highlight, onBuy, busy }: BuyButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onBuy(format)}
      disabled={busy}
      className={
        'group flex w-full items-center justify-between gap-4 border p-4 text-left transition-all ' +
        (highlight
          ? 'border-accent bg-bg-raised hover:bg-bg'
          : 'border-line bg-bg-subtle hover:border-accent/60') +
        ' disabled:cursor-progress disabled:opacity-60'
      }
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={highlight ? 'text-accent' : 'text-ink-dim'} aria-hidden>
          {icon}
        </span>
        <div className="min-w-0">
          <p className="font-display text-base text-ink leading-tight">{label}</p>
          <p className="mt-0.5 text-[12px] text-ink-mute">{helper}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className={'font-display text-xl ' + (highlight ? 'text-accent' : 'text-ink')}>
          {formatPrice(priceUsd)}
        </span>
        {busy ? <Loader2 className="h-4 w-4 animate-spin text-ink-mute" aria-hidden /> : null}
      </div>
    </button>
  );
}

/* Three-button direct-sale stack: ebook / audiobook / bundle. POSTs to
 * /api/v1/books/checkout — backend creates a Stripe session and
 * returns { url } that we redirect to. The route 404s until backend
 * lands the Stripe Products; this component degrades to a soft error
 * toast in that window.
 */
export function PriceSelector({ book }: PriceSelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [pendingFormat, setPendingFormat] = useState<DirectFormat | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleBuy(format: DirectFormat) {
    setError(null);
    setPendingFormat(format);
    startTransition(async () => {
      try {
        // Backend keys on bookId (e.g. s01_b01). Fall back to slug if
        // the backend hasn't surfaced the bookId in this response.
        const bookIdentity = book.book_id ?? book.slug;
        const res = await fetch(`${env.backendUrl}/api/v1/books/checkout`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookId: bookIdentity, format }),
        });
        if (res.status === 404) {
          throw new Error('Checkout route not deployed yet — backend will signal when live.');
        }
        if (!res.ok) throw new Error(`checkout ${res.status}`);
        const data = (await res.json()) as { url?: string };
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No checkout URL returned');
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Checkout is briefly offline. Try again in a moment.',
        );
        setPendingFormat(null);
      }
    });
  }

  return (
    <div className="space-y-3">
      <BuyButton
        format="ebook"
        label="Buy ebook"
        helper="Instant download · ePub + PDF"
        priceUsd={book.ebook_direct_price_usd}
        icon={<Download className="h-5 w-5" />}
        onBuy={handleBuy}
        busy={isPending && pendingFormat === 'ebook'}
      />
      <BuyButton
        format="audiobook"
        label="Buy audiobook"
        helper="Instant download · MP3"
        priceUsd={book.audiobook_direct_price_usd}
        icon={<Headphones className="h-5 w-5" />}
        onBuy={handleBuy}
        busy={isPending && pendingFormat === 'audiobook'}
      />
      <BuyButton
        format="bundle"
        label="Bundle — ebook + audiobook"
        helper="Best deal · both formats, one click"
        priceUsd={book.bundle_direct_price_usd}
        icon={<Layers className="h-5 w-5" />}
        highlight
        onBuy={handleBuy}
        busy={isPending && pendingFormat === 'bundle'}
      />

      {error ? (
        <p role="alert" className="text-xs text-accent">
          {error}
        </p>
      ) : null}

      <p className="pt-3 text-[12px] text-ink-mute">
        Print editions available on Amazon, Barnes &amp; Noble, and your local indie
        bookstore — search &ldquo;Apex Raw Motivation.&rdquo;
      </p>
    </div>
  );
}

'use client';

import { useState, useTransition } from 'react';
import { Loader2, Download, Headphones, Layers, BookOpen, BookMarked, Sparkles } from 'lucide-react';
import type { BookDetail } from '@/lib/types';
import { env } from '@/lib/env';
import { LAUNCH, launchPrice } from '@/lib/launch';

type DirectFormat = 'ebook' | 'audiobook' | 'bundle' | 'paperback' | 'hardcover';

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
  const discounted = LAUNCH.active ? launchPrice(priceUsd) : null;
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
        {discounted !== null ? (
          <>
            <span className="font-mono text-[12px] text-ink-mute line-through">
              {formatPrice(priceUsd)}
            </span>
            <span className={'font-display text-xl ' + (highlight ? 'text-accent' : 'text-ink')}>
              {formatPrice(discounted)}
            </span>
          </>
        ) : (
          <span className={'font-display text-xl ' + (highlight ? 'text-accent' : 'text-ink')}>
            {formatPrice(priceUsd)}
          </span>
        )}
        {busy ? <Loader2 className="h-4 w-4 animate-spin text-ink-mute" aria-hidden /> : null}
      </div>
    </button>
  );
}

/* Five-button direct-sale stack: ebook / audiobook / bundle, separator,
 * paperback / hardcover. POSTs to /api/v1/books/checkout with
 * { bookId, format } — backend returns { checkout_url } and we redirect.
 * Physical formats trigger Stripe's address collection automatically;
 * backend reads the address, posts a Lulu print job, and emails tracking.
 *
 * Returns 404/405 produce a soft toast — UI doesn't crash if the route
 * isn't deployed yet on a given environment.
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
        if (res.status === 404 || res.status === 405) {
          throw new Error('Checkout route not deployed yet — backend will signal when live.');
        }
        if (!res.ok) throw new Error(`checkout ${res.status}`);
        const data = (await res.json()) as { checkout_url?: string; url?: string };
        // Backend returns checkout_url; accept legacy `url` too.
        const target = data.checkout_url ?? data.url;
        if (target) {
          window.location.href = target;
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
      {LAUNCH.active ? (
        <div
          className="flex items-center justify-between gap-3 border border-accent/50 bg-bg-raised px-4 py-3"
          style={{
            boxShadow: '0 0 24px -8px rgba(217,204,140,0.35)',
          }}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                Launch week · {LAUNCH.percent}% off
              </p>
              <p className="text-[12px] text-ink-dim">
                Use code{' '}
                <span className="font-mono font-bold text-accent">{LAUNCH.code}</span> at
                checkout. All 5 formats.
              </p>
            </div>
          </div>
        </div>
      ) : null}

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

      {/* Digital / physical divider */}
      <div className="flex items-center gap-3 pt-2">
        <span aria-hidden className="h-px flex-1 bg-line" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-mute">
          Or hold it in your hands
        </span>
        <span aria-hidden className="h-px flex-1 bg-line" />
      </div>

      <BuyButton
        format="paperback"
        label="Buy paperback"
        helper="Signed by Brian · shipping included · 5-7 days"
        priceUsd={book.paperback_direct_price_usd}
        icon={<BookOpen className="h-5 w-5" />}
        onBuy={handleBuy}
        busy={isPending && pendingFormat === 'paperback'}
      />
      <BuyButton
        format="hardcover"
        label="Buy hardcover"
        helper="Signed by Brian · shipping included · 5-7 days"
        priceUsd={book.hardcover_direct_price_usd}
        icon={<BookMarked className="h-5 w-5" />}
        onBuy={handleBuy}
        busy={isPending && pendingFormat === 'hardcover'}
      />

      {error ? (
        <p role="alert" className="text-xs text-accent">
          {error}
        </p>
      ) : null}

      {/* Informational only — no link out. Brian's "no Amazon button"
          doctrine: print exists on retailers, we tell people where to
          look, but we never click them off our store. */}
      <p className="pt-3 text-[12px] text-ink-mute">
        Print editions also available on Amazon, Barnes &amp; Noble, and your local
        indie bookstore — search &ldquo;Apex Publishing House&rdquo; anywhere.
      </p>
    </div>
  );
}

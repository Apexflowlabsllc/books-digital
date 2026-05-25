'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'apex-launch-banner-dismissed';

/* Site-wide thin announcement bar — launch-week 30% off APEX30 promo.
 * Sticks to the top of every page above Nav. Dismissable via the X
 * (state persists to localStorage; visit /<anything>?reset_banner to
 * undo via dev console: localStorage.removeItem('apex-launch-banner-dismissed')).
 *
 * Pure announcement — not clickable, no scroll-trap.
 */
export function LaunchBanner() {
  // Hidden by default until we read localStorage on mount — avoids the
  // "show then hide" flicker for users who already dismissed it.
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY) === '1';
      if (!dismissed) setHidden(false);
    } catch {
      // Private mode / cookies blocked — still show the banner once.
      setHidden(false);
    }
  }, []);

  if (hidden) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* swallow */
    }
    setHidden(true);
  };

  return (
    <div
      role="region"
      aria-label="Launch week promotion"
      className="relative z-50 w-full bg-black text-white"
    >
      <div className="container-x flex items-center justify-between gap-3 py-2.5">
        <p className="flex-1 text-center text-[12px] sm:text-[13px] leading-tight tracking-wide">
          {/* Desktop copy */}
          <span className="hidden sm:inline">
            <span className="font-mono font-semibold uppercase tracking-[0.2em] text-accent">
              Launch week
            </span>
            <span className="mx-3 text-white/40" aria-hidden>
              ·
            </span>
            30% off every direct purchase. Use code{' '}
            <span className="font-mono font-bold text-accent">APEX30</span> at checkout.
          </span>
          {/* Mobile compressed copy */}
          <span className="sm:hidden">
            <span className="font-mono font-bold text-accent">30% OFF</span>
            <span className="mx-2 text-white/40">·</span>
            code{' '}
            <span className="font-mono font-bold text-accent">APEX30</span>
          </span>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss launch promo"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

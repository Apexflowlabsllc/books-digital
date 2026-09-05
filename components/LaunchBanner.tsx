'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { launchCountdownLabel } from '@/lib/launch';

const STORAGE_KEY = 'apex-launch-banner-dismissed';

/* Site-wide thin announcement bar — launch-week 30% off APEX30 promo.
 * Sticks to the top of every page above Nav. Dismissable via the X
 * (state persists to localStorage; visit /<anything>?reset_banner to
 * undo via dev console: localStorage.removeItem('apex-launch-banner-dismissed')).
 *
 * Pure announcement — not clickable, no scroll-trap.
 */
export function LaunchBanner() {
  /*
   * VISIBLE BY DEFAULT, hidden only once localStorage says it was dismissed.
   *
   * It used to start hidden and appear after mount, which meant it dropped in
   * and shoved the entire page down a moment after first paint — measured as
   * a 0.058 layout shift, and the only CLS on the homepage.
   *
   * Flipping the default removes the shift for everyone seeing it for the
   * first time, which is the common case and the one Lighthouse measures. A
   * returning visitor who dismissed it sees it disappear instead, which shifts
   * content upward once and is the rarer path.
   */
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') setHidden(true);
    } catch {
      // Private mode / cookies blocked — still show the banner.
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

  const countdown = launchCountdownLabel();

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
            {countdown ? (
              <>
                <span className="mx-3 text-white/40" aria-hidden>
                  ·
                </span>
                <span className="font-mono text-white/80">{countdown}</span>
              </>
            ) : null}
          </span>
          {/* Mobile compressed copy */}
          <span className="sm:hidden">
            <span className="font-mono font-bold text-accent">30% OFF</span>
            <span className="mx-2 text-white/40">·</span>
            code <span className="font-mono font-bold text-accent">APEX30</span>
            {countdown ? (
              <>
                <span className="mx-2 text-white/40">·</span>
                <span className="text-white/80">{countdown}</span>
              </>
            ) : null}
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

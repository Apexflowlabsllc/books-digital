'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { LAUNCH, launchCountdownLabel } from '@/lib/launch';

const OPEN_MODAL_EVENT = 'apex:open-launch-modal';

/* Persistent floating sale pill — fixed bottom-left so it doesn't
 * collide with the chat concierge in bottom-right. Click → dispatches
 * a window CustomEvent that the LaunchModal listens for, so any
 * dismiss is reversible at any moment.
 * Auto-hides when LAUNCH.active is false (in lib/launch.ts) or the
 * promo end date has passed. Re-renders every minute so the countdown
 * stays current without a full page refresh.
 */
export function LaunchPill() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (!LAUNCH.active) return;
    // Refresh the countdown every minute. Sub-minute precision isn't
    // worth a re-render storm.
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (!LAUNCH.active) return null;
  const countdown = launchCountdownLabel(now);
  if (!countdown) return null; // Promo end date passed.

  function openModal() {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(OPEN_MODAL_EVENT));
  }

  return (
    <button
      type="button"
      onClick={openModal}
      aria-label={`Open launch promo — ${LAUNCH.percent}% off, code ${LAUNCH.code}`}
      className="group fixed bottom-6 left-6 z-[7000] flex items-center gap-2.5 border border-accent bg-bg-raised pl-3 pr-4 py-2.5 transition-all hover:bg-bg md:bottom-8 md:left-8"
      style={{
        boxShadow: '0 18px 40px -10px rgba(217,204,140,0.55), 0 0 24px rgba(217,204,140,0.2)',
      }}
    >
      <Sparkles className="h-4 w-4 text-accent" aria-hidden />
      <div className="flex flex-col items-start text-left leading-tight">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
          {LAUNCH.percent}% OFF · {LAUNCH.code}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-mute">
          {countdown}
        </span>
      </div>
    </button>
  );
}

export { OPEN_MODAL_EVENT };

import { Sparkles, Clock } from 'lucide-react';
import { LAUNCH, launchCountdownLabel } from '@/lib/launch';

interface SaleCalloutProps {
  className?: string;
  // 'wide' renders a full-width strip; 'compact' is a smaller inline
  // block that fits inside a column.
  variant?: 'wide' | 'compact';
}

/* Small launch-promo callout block, dropped between page sections to
 * keep the sale visible without nagging the user. Self-hides when
 * LAUNCH.active is false. Server-rendered, no client state — the
 * countdown ticks via the LaunchPill's 1-minute refresh, this only
 * needs to be roughly current.
 */
export function SaleCallout({ className = '', variant = 'wide' }: SaleCalloutProps) {
  if (!LAUNCH.active) return null;
  const countdown = launchCountdownLabel();

  return (
    <div
      role="region"
      aria-label="Launch week promotion"
      className={
        'border border-accent/40 bg-bg-subtle px-5 py-4 ' +
        (variant === 'compact' ? 'flex flex-col gap-2 sm:flex-row sm:items-center ' : 'flex flex-wrap items-center justify-between gap-4 ') +
        className
      }
      style={{ boxShadow: '0 0 24px -10px rgba(217,204,140,0.35)' }}
    >
      <div className="flex items-center gap-3">
        <Sparkles className="h-4 w-4 shrink-0 text-accent" aria-hidden />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            Launch week · {LAUNCH.percent}% off
          </p>
          <p className="mt-0.5 text-[12px] text-ink-dim">
            Use code{' '}
            <span className="font-mono font-bold text-accent">{LAUNCH.code}</span> at
            checkout — applies to every book, every format.
          </p>
        </div>
      </div>
      {countdown ? (
        <div className="inline-flex items-center gap-1.5 border border-accent/40 bg-bg px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
          <Clock className="h-3 w-3" aria-hidden />
          <span>{countdown}</span>
        </div>
      ) : null}
    </div>
  );
}

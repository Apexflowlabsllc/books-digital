'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CONSENT_KEY, OPEN_CONSENT_EVENT } from '@/lib/legal';

type Choice = 'accepted' | 'declined' | null;

function readChoice(): Choice {
  try {
    const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
    if (gpc) return 'declined';
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'accepted' || v === 'declined' ? v : null;
  } catch {
    return null;
  }
}

/** Footer link that reopens the choice box. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>
      Cookie settings
    </button>
  );
}

/**
 * Optional third-party scripts (today: the Apex Flow Arcade play button from
 * www.apexflowlabs.com) load ONLY after an explicit "Accept optional".
 * Decline, no choice yet, and the Global Privacy Control signal all keep them
 * off. Essential storage (sign-in session) is not affected.
 *
 * Any analytics or advertising pixel added later (the env vars for GA4, Meta
 * pixel and Clarity exist in lib/env.ts) MUST be rendered inside the
 * `choice === 'accepted'` branch below and listed in /cookies and /privacy.
 */
export function ConsentBanner({
  arcadeSrc,
  arcadeSide,
  arcadeBottom,
}: {
  arcadeSrc: string;
  arcadeSide: string;
  arcadeBottom: string;
}) {
  const [choice, setChoice] = useState<Choice>(null);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [gpc, setGpc] = useState(false);

  useEffect(() => {
    const c = readChoice();
    const g = !!(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
    setGpc(g);
    setChoice(c);
    setOpen(c === null);
    setReady(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  function decide(next: 'accepted' | 'declined') {
    try {
      localStorage.setItem(CONSENT_KEY, next);
    } catch {
      /* the choice just will not persist */
    }
    const was = choice;
    setChoice(next);
    setOpen(false);
    if (next === 'declined' && was === 'accepted') location.reload(); // unload anything already running
  }

  if (!ready) return null;
  return (
    <>
      {choice === 'accepted' && !gpc ? (
        <Script src={arcadeSrc} data-side={arcadeSide} data-bottom={arcadeBottom} strategy="lazyOnload" />
      ) : null}
      {open ? (
        <div
          role="dialog"
          aria-label="Cookie and optional script choices"
          aria-modal="false"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
          }}
          className="fixed inset-x-3 bottom-3 z-[10050] mx-auto max-w-[660px] rounded-xl border-2 border-ink bg-[#0a0a0a] p-4 text-sm text-ink shadow-2xl"
        >
          <p className="leading-relaxed">
            We use essential storage to keep you signed in and to remember small choices (like a dismissed banner). We set no advertising or
            tracking cookies and run no analytics. With your OK we also load one optional script from another Apex Flow Labs address: the
            Arcade play button.
            {gpc ? ' Your browser is sending Global Privacy Control, so it stays off.' : ''}{' '}
            <a href="/cookies" className="underline underline-offset-4">
              Cookie Policy
            </a>
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => decide('declined')}
              className="min-h-[44px] flex-1 rounded-full border-2 border-ink px-5 py-2.5 font-semibold hover:bg-ink hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Decline optional
            </button>
            <button
              type="button"
              onClick={() => decide('accepted')}
              className="min-h-[44px] flex-1 rounded-full border-2 border-ink px-5 py-2.5 font-semibold hover:bg-ink hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Accept optional
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

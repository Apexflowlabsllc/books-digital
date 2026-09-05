'use client';

import { useEffect, useState } from 'react';

/**
 * MOUNT AFTER THE PAGE IS USABLE, NOT BEFORE.
 *
 * The layout mounts a chat widget, a promo modal, an exit-intent modal, a
 * floating pill, a custom cursor and a smooth-scroll engine (Lenis + GSAP).
 * None of them are needed to read the first screen, and together they put over
 * 200kB of JavaScript that Lighthouse measured as entirely unused at load onto
 * the critical path — which is what its simulated LCP was pricing in.
 *
 * Everything wrapped here waits for the browser to go idle, or for the first
 * real intent signal (a pointer, a key, a scroll), whichever comes first. So a
 * visitor who starts interacting immediately still gets the full experience,
 * and one who is still reading the headline is not paying for it yet.
 *
 * `requestIdleCallback` is not in Safari, hence the timeout fallback.
 */
export function DeferUntilIdle({
  children,
  timeout = 2500,
}: {
  children: React.ReactNode;
  timeout?: number;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setReady(true);
    };

    const events: (keyof WindowEventMap)[] = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'];
    for (const e of events) window.addEventListener(e, go, { once: true, passive: true });

    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    const idleId = ric ? ric(go, { timeout }) : undefined;
    const timerId = window.setTimeout(go, timeout);

    return () => {
      for (const e of events) window.removeEventListener(e, go);
      window.clearTimeout(timerId);
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (idleId !== undefined && cic) cic(idleId);
    };
  }, [timeout]);

  return ready ? <>{children}</> : null;
}

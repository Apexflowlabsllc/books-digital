'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
}

/*
 * Live counter.
 *
 * It used to initialise to `from` (0) and only reach `to` once the element
 * entered the viewport and the tween ran. Anything that stopped that — the
 * element never scrolled into view, JS throttled, animation frames paused —
 * left a permanent "0" on screen. On /about-brian that rendered
 * "Years cleaning carpets 0 · Books shipped 0 · Books planned 0" directly above
 * a paragraph saying 636 titles are planned, which reads as a broken database.
 *
 * It now renders the REAL number in the server HTML and on first paint, and
 * only rewinds to `from` once it is certain it can animate. Worst case is no
 * animation; worst case is never a wrong number.
 */
export function CountUp({
  to,
  from = 0,
  duration = 1.6,
  className,
  format,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  /* Start at the true value — never at zero. */
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    if (!inView) return;
    // Rewind and play only at the moment we know the tween will run.
    setValue(from);
    const start = performance.now();
    let raf = 0;
    const eased = (t: number) => 1 - Math.pow(1 - t, 3); // ease-out cubic

    function tick(now: number) {
      const elapsed = (now - start) / 1000;
      const t = Math.min(1, elapsed / duration);
      const n = Math.round(from + (to - from) * eased(t));
      setValue(n);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, from, to, duration]);

  return (
    <span ref={ref} className={className} aria-label={String(to)}>
      {format ? format(value) : value.toLocaleString()}
    </span>
  );
}

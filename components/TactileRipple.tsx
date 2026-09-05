'use client';

/**
 * Every card answers a finger.
 *
 * A ripple born at the exact contact point, sized to reach the furthest corner
 * of whatever it was born in — so a small chip flashes and a wide card washes.
 * Delegated from the document rather than bound per element, which means it
 * also works on anything rendered later (search results, the series shelf that
 * opens after a launch) without re-binding.
 *
 * Mounted once in the layout. Costs nothing until something is pressed.
 */

import { useEffect } from 'react';

const SELECTOR =
  '.series-spine, .shelf-item, .book3d, .fmt-tile, .enc-entry, .say-chip, [data-ripple]';

export function TactileRipple() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const box = target?.closest<HTMLElement>(SELECTOR);
      if (!box) return;

      const r = box.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const far = Math.max(
        Math.hypot(x, y),
        Math.hypot(r.width - x, y),
        Math.hypot(x, r.height - y),
        Math.hypot(r.width - x, r.height - y),
      );

      const d = document.createElement('span');
      d.className = 'tap-ripple';
      d.style.left = `${x}px`;
      d.style.top = `${y}px`;
      d.style.width = d.style.height = `${far * 2}px`;

      const prevPosition = getComputedStyle(box).position;
      if (prevPosition === 'static') box.style.position = 'relative';
      box.appendChild(d);
      window.setTimeout(() => d.remove(), 640);
    };

    document.addEventListener('pointerdown', onDown, { passive: true });
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);

  return null;
}

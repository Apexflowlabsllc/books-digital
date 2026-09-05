'use client';

/**
 * Foil that catches the light.
 *
 * Moves the gradient position on `.foil-text` as the pointer crosses the
 * screen, so gold type behaves like real foil stamping under a moving lamp
 * rather than a static gradient. One passive listener, one CSS custom
 * property, no re-renders.
 */

import { useEffect } from 'react';

export function FoilTracker() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e: PointerEvent) => {
      const pos = 10 + (e.clientX / window.innerWidth) * 70;
      document.documentElement.style.setProperty('--foilpos', `${pos.toFixed(1)}%`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return null;
}

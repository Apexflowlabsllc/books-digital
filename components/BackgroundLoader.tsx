'use client';

import dynamic from 'next/dynamic';

/**
 * The site ground.
 *
 * Swapped from the previous deep-forest Three.js shader to LiquidMetal — a raw
 * WebGL fullscreen triangle that renders domain-warped molten metal and
 * ripples wherever the page is touched. Same mount point, same reduced-motion
 * behaviour, no Three.js dependency on this path.
 *
 * Client-only: the shader needs a WebGL context, so SSR is off and a CSS
 * fallback paints during load and for anyone on reduced motion. The page never
 * depends on the canvas rendering.
 */
const LiquidMetal = dynamic(
  () => import('./LiquidMetal').then((m) => m.LiquidMetal),
  {
    ssr: false,
    loading: () => <CssFallback />,
  },
);

export function BackgroundLoader() {
  if (typeof window !== 'undefined') {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return <CssFallback />;
  }
  return <LiquidMetal />;
}

/**
 * CSS-only stand-in for reduced motion and first paint. Matches the shader's
 * palette — near-black ground with a bronze pool — so the swap to the canvas
 * is not a visible jump.
 */
function CssFallback() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -10,
        pointerEvents: 'none',
        backgroundColor: '#050506',
        background:
          'radial-gradient(70% 60% at 28% 12%, rgba(201,139,62,0.16) 0%, transparent 70%), radial-gradient(55% 50% at 78% 32%, rgba(110,74,35,0.20) 0%, transparent 72%), linear-gradient(180deg,#0B0A0B,#050506 62%)',
      }}
    />
  );
}

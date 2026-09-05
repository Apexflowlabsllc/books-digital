'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

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

/**
 * WHO GETS THE SHADER.
 *
 * Lighthouse measured 17,136ms of main-thread "Other" work on a mobile
 * profile, with 120ms tasks still firing thirty seconds into the page — a
 * domain-warped five-octave fbm running every frame on an emulated mid-range
 * phone. It put mobile performance at 50.
 *
 * So phones and low-powered machines get the CSS ground instead. It is the
 * same palette, costs nothing, and is what a visitor on a bus actually needs.
 * Real desktops still get the metal.
 */
function wantsShader(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  // A phone-sized viewport, or a coarse pointer with no hover, is a phone.
  if (window.matchMedia('(max-width: 900px)').matches) return false;
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return false;
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === 'number' && cores > 0 && cores <= 4) return false;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof mem === 'number' && mem > 0 && mem <= 4) return false;
  return true;
}

export function BackgroundLoader() {
  const [on, setOn] = useState(false);

  // Decided after mount so the server and first client render agree, and so
  // the shader never blocks first paint.
  useEffect(() => {
    setOn(wantsShader());
  }, []);

  return on ? <LiquidMetal /> : <CssFallback />;
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

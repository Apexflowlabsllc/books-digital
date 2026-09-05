import type { Metadata, Viewport } from 'next';
import { Geist, Fraunces, JetBrains_Mono } from 'next/font/google';
import { env } from '@/lib/env';
import dynamic from 'next/dynamic';
import { DeferUntilIdle } from '@/components/DeferUntilIdle';

/* Split out of the first-load bundle. None of these paint anything a visitor
 * needs in order to read the page, and together they were the bulk of the
 * 205kB Lighthouse measured as unused JavaScript at load. */
const SmoothScroll = dynamic(() => import('@/components/SmoothScroll').then((m) => m.SmoothScroll));
const Cursor = dynamic(() => import('@/components/Cursor').then((m) => m.Cursor));
import { BackgroundLoader } from '@/components/BackgroundLoader';
import { TactileRipple } from '@/components/TactileRipple';
import { FoilTracker } from '@/components/FoilTracker';
import { LaunchBanner } from '@/components/LaunchBanner';

const BooksConcierge = dynamic(() => import('@/components/BooksConcierge').then((m) => m.BooksConcierge));
const ExitIntentModalTrigger = dynamic(() =>
  import('@/components/EmailCaptureModal').then((m) => m.ExitIntentModalTrigger),
);
const LaunchModal = dynamic(() => import('@/components/LaunchModal').then((m) => m.LaunchModal));
const LaunchPill = dynamic(() => import('@/components/LaunchPill').then((m) => m.LaunchPill));
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

/*
 * Only the optical-size axis. Every variable axis ships inside the woff2
 * whether it is used or not, and dropping SOFT cut this file materially.
 * `swap` is kept: switching to `optional` was measured and changed LCP by
 * nothing, so there is no reason to risk the fallback face showing.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['opsz'],
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl || 'https://books.apexflowlabs.com'),
  title: {
    default: 'Apex Flow Publishing House — 636 books. 12 series. One war manual library.',
    template: '%s | Apex Flow Publishing House',
  },
  description:
    '636 books. 12 series. One war-manual library. Built on 13 years of operations at Spiker Carpet and Tile Care. Not therapist-speak — operator-grade self-help.',
  applicationName: 'Apex Flow Publishing House',
  authors: [{ name: 'Brian Spiker', url: `${env.siteUrl}/about-brian` }],
  creator: 'Brian Spiker',
  publisher: 'Apex Flow Publishing House',
  keywords: [
    'r-rated self-help',
    'war manual',
    'discipline books',
    'operator books',
    'Brian Spiker',
    'Apex Flow Publishing House',
  ],
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: '#060606',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      {/* suppressHydrationWarning on <body> swallows the mismatch from
          browser extensions (ColorZilla `cz-shortcut-listen`, Grammarly
          `data-gr-*`, Honey, etc.) that inject attributes before React
          hydrates. Scoped to this element only — the rest of the tree
          still gets full hydration checking. */}
      <body suppressHydrationWarning>
        <BackgroundLoader />
        <DeferUntilIdle>
          <TactileRipple />
          <FoilTracker />
        </DeferUntilIdle>
        {/*
          THE BLUR IS GONE — and that is why you can now see the shader.

          A full-viewport `backdrop-blur-xl` used to sit here at z-index -8,
          directly on top of LiquidMetal at -10. backdrop-blur-xl is a 24px
          blur, and the shader's whole character is fine domain-warped detail:
          24px of blur averaged every fold and highlight into flat grey-black,
          so the canvas was rendering perfectly and arriving invisible.

          Text legibility was the reason it was added, but the shader already
          solves that itself — it is a dark ground with a heavy vignette, and
          the sections that need more contrast carry their own backgrounds.
          Blurring the entire site to protect type that was never at risk cost
          us the one effect the store is built around.
        */}
        <DeferUntilIdle>
          <SmoothScroll />
          <Cursor />
        </DeferUntilIdle>
        {/* Launch-week promo bar — sits above everything else; dismiss
            persists per browser via localStorage. */}
        <LaunchBanner />
        {children}
        <DeferUntilIdle>
          <BooksConcierge />
          <ExitIntentModalTrigger />
        </DeferUntilIdle>
        {/* Launch-week promo modal — auto-opens once per browser ~3.5s
            after the user lands. Dismiss persists via localStorage,
            but the floating LaunchPill re-opens it on demand. */}
        <DeferUntilIdle>
          <LaunchModal />
          {/* Persistent floating pill bottom-left — opens the modal
              anytime, shows live countdown. */}
          <LaunchPill />
        </DeferUntilIdle>
      </body>
    </html>
  );
}

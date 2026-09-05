import type { Metadata, Viewport } from 'next';
import { Geist, Fraunces, JetBrains_Mono } from 'next/font/google';
import { env } from '@/lib/env';
import { SmoothScroll } from '@/components/SmoothScroll';
import { Cursor } from '@/components/Cursor';
import { BackgroundLoader } from '@/components/BackgroundLoader';
import { TactileRipple } from '@/components/TactileRipple';
import { FoilTracker } from '@/components/FoilTracker';
import { BooksConcierge } from '@/components/BooksConcierge';
import { ExitIntentModalTrigger } from '@/components/EmailCaptureModal';
import { LaunchBanner } from '@/components/LaunchBanner';
import { LaunchModal } from '@/components/LaunchModal';
import { LaunchPill } from '@/components/LaunchPill';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['SOFT', 'opsz'],
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
        <TactileRipple />
        <FoilTracker />
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
        <SmoothScroll />
        <Cursor />
        {/* Launch-week promo bar — sits above everything else; dismiss
            persists per browser via localStorage. */}
        <LaunchBanner />
        {children}
        <BooksConcierge />
        <ExitIntentModalTrigger />
        {/* Launch-week promo modal — auto-opens once per browser ~3.5s
            after the user lands. Dismiss persists via localStorage,
            but the floating LaunchPill re-opens it on demand. */}
        <LaunchModal />
        {/* Persistent floating pill bottom-left — opens the modal
            anytime, shows live countdown. */}
        <LaunchPill />
      </body>
    </html>
  );
}

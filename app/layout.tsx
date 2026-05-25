import type { Metadata, Viewport } from 'next';
import { Geist, Fraunces, JetBrains_Mono } from 'next/font/google';
import { env } from '@/lib/env';
import { SmoothScroll } from '@/components/SmoothScroll';
import { Cursor } from '@/components/Cursor';
import { BackgroundLoader } from '@/components/BackgroundLoader';
import { BooksConcierge } from '@/components/BooksConcierge';
import { ExitIntentModalTrigger } from '@/components/EmailCaptureModal';
import { LaunchBanner } from '@/components/LaunchBanner';
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
    default: 'Apex Publishing House — 636 books. 12 series. One war manual library.',
    template: '%s | Apex Publishing House',
  },
  description:
    '636 books. 12 series. One war-manual library. Built on 13 years of operations at Spiker Carpet and Tile Care. Not therapist-speak — operator-grade self-help.',
  applicationName: 'Apex Publishing House',
  authors: [{ name: 'Brian Spiker', url: `${env.siteUrl}/about-brian` }],
  creator: 'Brian Spiker',
  publisher: 'Apex Publishing House',
  keywords: [
    'r-rated self-help',
    'war manual',
    'discipline books',
    'operator books',
    'Brian Spiker',
    'Apex Publishing House',
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
        {/* Site-wide backdrop blur — sits above the shader background
            (z: -10) and below all page content (z: 2). Every route picks
            this up automatically. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 backdrop-blur-xl"
          style={{ zIndex: -8 }}
        />
        <SmoothScroll />
        <Cursor />
        {/* Launch-week promo bar — sits above everything else; dismiss
            persists per browser via localStorage. */}
        <LaunchBanner />
        {children}
        <BooksConcierge />
        <ExitIntentModalTrigger />
      </body>
    </html>
  );
}

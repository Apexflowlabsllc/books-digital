'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Gift, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LAUNCH } from '@/lib/launch';
import { EmailCaptureModal } from './EmailCaptureModal';
import { NavUserMenu } from './auth/NavUserMenu';

interface NavProps {
  userEmail?: string | null;
}

const LINKS = [
  { href: '/books', label: 'Books' },
  /* Problem-first entry point: most visitors know the sentence, not the term. */
  { href: '/problems', label: 'Problems' },
  { href: '/series', label: 'Series' },
  { href: '/about-brian', label: 'Brian' },
  { href: '/brian-spiker-real-world-proof', label: 'Proof' },
  { href: '/membership', label: 'Pass' },
  { href: '/bundles', label: 'Bundles' },
  /* Locked rule: every Apex Flow store carries Pulse. */
  { href: '/pulse', label: 'Pulse' },
];

export function Nav({ userEmail }: NavProps = {}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when the mobile drawer is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b border-[rgba(217,204,140,0.18)] backdrop-blur-xl"
        style={{
          background:
            'linear-gradient(180deg, rgba(0, 20, 40, 0.65) 0%, rgba(8, 6, 4, 0.55) 100%)',
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(217,204,140,0.45) 50%, transparent 100%)',
          }}
        />
        <div className="container-x relative flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <span
              aria-hidden
              className="text-base text-accent transition-transform duration-300 group-hover:rotate-180"
            >
              ▲
            </span>
            <span className="font-display text-[0.95rem] sm:text-[1.05rem] italic font-light text-cream tracking-tight">
              Apex Flow Publishing House
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'group relative inline-flex min-h-[24px] items-center py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim transition-colors hover:text-accent',
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className="absolute -bottom-1.5 left-0 right-0 mx-auto h-px w-0 bg-accent transition-all duration-300 group-hover:w-full"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop-only CTAs */}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="cta-primary hidden md:inline-flex"
              data-cursor-label="Open"
            >
              <Gift className="h-3.5 w-3.5" aria-hidden />
              <span>{LAUNCH.shortLabel}</span>
            </button>

            {userEmail ? (
              <div className="hidden md:block">
                <NavUserMenu email={userEmail} />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/sign-in"
                  className="inline-flex min-h-[24px] items-center py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim transition-colors hover:text-accent"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="cta-secondary inline-flex"
                  data-cursor-label="Open"
                >
                  <span>Sign up</span>
                </Link>
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="md:hidden flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(217,204,140,0.35)] bg-[#001428]/60 backdrop-blur-sm transition-colors hover:border-accent hover:bg-[#4A5C44]/40"
            >
              <Menu className="h-5 w-5 text-accent" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {/* `inert` alongside aria-hidden: opacity-0 still leaves every link in
        * the tab order, so a keyboard user tabbed into a drawer they could not
        * see. Lighthouse flags exactly this as aria-hidden-focus. */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={cn(
          'fixed inset-0 z-50 md:hidden transition-opacity duration-300',
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        {/* Scrim */}
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Drawer panel */}
        <aside
          className={cn(
            'absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col border-l border-[rgba(217,204,140,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            menuOpen ? 'translate-x-0' : 'translate-x-full',
          )}
          style={{
            background:
              'linear-gradient(180deg, rgba(0, 20, 40, 0.95) 0%, rgba(8, 6, 4, 0.96) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '-30px 0 60px -10px rgba(0, 0, 0, 0.7)',
          }}
        >
          <div className="flex items-center justify-between border-b border-[rgba(217,204,140,0.2)] px-6 py-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/80">
              The library · Menu
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(217,204,140,0.35)] bg-[#001428]/40 transition-colors hover:border-accent hover:bg-[#4A5C44]/40"
            >
              <X className="h-5 w-5 text-accent" strokeWidth={2} />
            </button>
          </div>

          <nav aria-label="Primary mobile" className="flex-1 overflow-y-auto px-6 py-8">
            <ul className="flex flex-col gap-1">
              {LINKS.map((link, i) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center justify-between border-b border-[rgba(217,204,140,0.08)] py-4 transition-colors hover:border-accent/40"
                  >
                    <span className="flex items-center gap-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent/60">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-[1.4rem] font-light text-cream transition-colors group-hover:text-accent">
                        {link.label}
                      </span>
                    </span>
                    <span aria-hidden className="text-accent/40 transition-transform group-hover:translate-x-1 group-hover:text-accent">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 border-t border-[rgba(217,204,140,0.2)] px-6 py-6">
            {userEmail ? (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent/70">
                  Signed in · {userEmail}
                </p>
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="cta-primary w-full justify-center"
                >
                  <span>Your account</span>
                </Link>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="cta-secondary w-full justify-center"
                >
                  <span>Sign in</span>
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMenuOpen(false)}
                  className="cta-primary w-full justify-center"
                >
                  <span>Sign up</span>
                </Link>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setModalOpen(true);
              }}
              className="cta-secondary w-full justify-center"
              data-cursor-label="Open"
            >
              <Gift className="h-3.5 w-3.5" aria-hidden />
              <span>{LAUNCH.percent}% off with {LAUNCH.code}</span>
            </button>
          </div>
        </aside>
      </div>

      <EmailCaptureModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source="nav-15off"
      />
    </>
  );
}

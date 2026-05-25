'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { LAUNCH } from '@/lib/launch';

const STORAGE_KEY = 'apex-launch-modal-seen';
// Wait this many ms after mount before showing — keeps it from
// stealing focus on first paint.
const OPEN_DELAY_MS = 3500;

/* Site-wide launch promo modal. Auto-opens once per browser ~3.5s
 * after the user lands, then never again (localStorage dismiss).
 * Big code reveal, one-click copy, two CTAs (browse books / use code).
 * Pure announcement — close X persists state, no scroll-trap.
 */
export function LaunchModal() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || !LAUNCH.active) return;
    fired.current = true;
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return;
    } catch {
      /* private mode — show once and that's fine */
    }
    const t = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Esc to close + body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* swallow */
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(LAUNCH.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — user can still type the code */
    }
  }

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="launch-modal-title"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close launch promo"
            onClick={close}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg overflow-hidden border border-accent/40 p-8 md:p-10"
            style={{
              background:
                'linear-gradient(150deg, rgba(217,204,140,0.10) 0%, rgba(8,6,4,0.95) 60%, rgba(0,20,40,0.95) 100%)',
              boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8), 0 0 60px rgba(217,204,140,0.15)',
            }}
          >
            {/* Close X */}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-line/60 bg-bg-subtle/60 text-ink-dim transition-colors hover:border-accent hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            {/* Decorative sparkle eyebrow */}
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="h-4 w-4" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em]">
                Launch week
              </span>
            </div>

            <h2
              id="launch-modal-title"
              className="mt-4 font-display text-4xl leading-[1] text-cream md:text-5xl"
            >
              <span className="metallic-text">{LAUNCH.percent}% off</span>
              <br />
              every direct purchase.
            </h2>

            <p className="mt-4 text-sm leading-[1.6] text-ink-dim md:text-base">
              {LAUNCH.subhead}
            </p>

            {/* Code reveal */}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <div
                className="flex flex-1 items-center justify-between gap-3 border border-accent/50 bg-bg-subtle/60 px-4 py-3"
                aria-label="Discount code"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-mute">
                  Code
                </span>
                <span className="font-mono text-2xl font-bold tracking-[0.18em] text-accent md:text-3xl">
                  {LAUNCH.code}
                </span>
              </div>
              <button
                type="button"
                onClick={copyCode}
                className="cta-secondary justify-center"
                aria-label={`Copy ${LAUNCH.code} to clipboard`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/books"
                onClick={close}
                className="cta-primary flex-1 justify-center"
              >
                <span>Browse all 636 books</span>
              </Link>
              <Link
                href="/books/discipline"
                onClick={close}
                className="cta-secondary flex-1 justify-center"
              >
                <span>Start with Discipline</span>
              </Link>
            </div>

            <p className="mt-5 text-[11px] text-ink-mute">
              Code auto-applies in Stripe checkout. Works on every format —
              ebook, audiobook, bundle, paperback, hardcover.
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

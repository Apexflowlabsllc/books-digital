'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Mail, Sparkles } from 'lucide-react';
import { createPortal } from 'react-dom';
import { sendFreeChapter } from '@/lib/free-chapter';

interface EmailCaptureModalProps {
  open: boolean;
  onClose: () => void;
  bookSlug?: string;
  source?: string;
  // when true, also triggers automatically on exit-intent (mouse leaves top
  // edge) for first-time visitors. Sets a localStorage flag to avoid re-popping.
  exitIntent?: boolean;
}

const STORAGE_KEY = 'apex-books-modal-seen';

// Discount + free-chapter modal — covers the "email capture with discount"
// pattern from the digital-art landing. Triggers from any nav/CTA or
// auto-fires on exit-intent for first-time visitors (once per browser).
export function EmailCaptureModal({
  open,
  onClose,
  bookSlug = 'the-discipline-blueprint',
  source = 'modal',
  exitIntent = false,
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [code] = useState(() => `APEX${Math.floor(1000 + Math.random() * 9000)}`);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus the input on open + Esc to close
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Real email or nothing.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await sendFreeChapter({
        bookSlug,
        email,
        utmSource: source,
        discount: code,
      });
      if (result.ok) {
        setDone(true);
        try {
          localStorage.setItem(STORAGE_KEY, '1');
        } catch {
          /* swallow — private mode */
        }
      } else {
        setError('Email service is briefly down. Try again in 60 seconds.');
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[EmailCaptureModal] sendFreeChapter failed:', result.error);
        }
      }
    });
  }

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] border border-accent/40 bg-bg-raised p-8 md:p-12"
            style={{
              boxShadow:
                '0 30px 80px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(217,204,140,0.18) inset',
            }}
          >
            {/* Background gradient */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(80% 60% at 50% 0%, rgba(217,204,140,0.22) 0%, transparent 70%), radial-gradient(50% 50% at 100% 100%, rgba(217,204,140,0.08) 0%, transparent 70%)',
              }}
            />

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-bg/60 text-ink-dim transition-colors hover:border-accent hover:text-accent"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10">
              {done ? (
                <>
                  <div className="flex items-center gap-2 text-accent">
                    <Sparkles className="h-5 w-5" aria-hidden />
                    <p className="text-[10px] uppercase tracking-[0.42em]">Filed.</p>
                  </div>
                  <h2
                    id="modal-title"
                    className="mt-4 font-display text-3xl text-ink md:text-4xl"
                  >
                    Chapter one is on its way.
                  </h2>
                  <p className="mt-4 text-sm text-ink-dim">
                    Check inbox + promo tab. Use this code at checkout for{' '}
                    <span className="text-accent">15% off your first order</span> — one-time, no
                    expiry on next visit:
                  </p>
                  <div className="mt-6 rounded-[1rem] border border-accent/40 bg-bg/60 p-5 text-center font-mono text-2xl tracking-[0.4em] text-accent">
                    {code}
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="cta-primary mt-8 w-full rounded-full px-8 py-4 tracking-[0.28em]"
                  >
                    <span>Got it — keep browsing</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-accent">
                    <Sparkles className="h-5 w-5" aria-hidden />
                    <p className="text-[10px] uppercase tracking-[0.42em]">First-visit gift</p>
                  </div>
                  <h2
                    id="modal-title"
                    className="mt-4 font-display text-3xl leading-tight text-ink md:text-4xl"
                  >
                    Free chapter <span className="metallic-text">+ 15% off.</span>
                  </h2>
                  <p className="mt-4 text-sm text-ink-dim md:text-base">
                    Drop your email. We send chapter one of The Discipline Blueprint plus a
                    one-time 15% discount code on your first order. No drip, no daily nag.
                  </p>

                  <form onSubmit={submit} className="mt-6 space-y-3">
                    <div className="relative">
                      <Mail
                        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute"
                        aria-hidden
                      />
                      <input
                        ref={inputRef}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@yourdomain.com"
                        className="w-full rounded-full border border-line bg-bg/80 px-12 py-4 text-sm text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={pending}
                      className="cta-primary w-full rounded-full px-8 py-4 tracking-[0.28em] disabled:opacity-50"
                    >
                      {pending ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          Sending
                        </span>
                      ) : (
                        <span>Send chapter one + my code</span>
                      )}
                    </button>
                  </form>

                  {error ? (
                    <p role="alert" className="mt-3 text-xs text-accent-hot">
                      {error}
                    </p>
                  ) : (
                    <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-ink-mute">
                      One-time only · unsubscribe in one click
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

// Auto-fires the modal on exit-intent for first-time visitors. Use at root.
export function ExitIntentModalTrigger() {
  const [open, setOpen] = useState(false);
  const armed = useRef(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) {
        armed.current = false;
        return;
      }
    } catch {
      /* swallow */
    }

    function onLeave(e: MouseEvent) {
      if (!armed.current) return;
      // exit-intent = pointer goes above the viewport
      if (e.clientY <= 0) {
        armed.current = false;
        setOpen(true);
      }
    }

    // delay 15s so first-time visitors actually see the site first
    const t = setTimeout(() => {
      document.addEventListener('mouseleave', onLeave);
    }, 15000);

    return () => {
      clearTimeout(t);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <EmailCaptureModal open={open} onClose={() => setOpen(false)} source="exit-intent" exitIntent />;
}

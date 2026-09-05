'use client';

import { motion, useReducedMotion } from 'framer-motion';

// Personal note from the founder. The card sits slightly rotated like a
// handwritten letter pinned to a corkboard — gold tape strip at the top,
// handwriting-feel signature at the bottom. Master §5 voice throughout.
export function FounderNote() {
  const reduced = useReducedMotion();

  return (
    <section className="relative z-10 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-xs uppercase tracking-[0.6em] text-accent">
          A note from the founder
        </p>

        <motion.article
          initial={reduced ? { opacity: 1, y: 0, rotate: -1 } : { opacity: 0, y: 30, rotate: -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-10 max-w-3xl rounded-[1.5rem] border border-line bg-bg/80 p-10 backdrop-blur-md md:p-14"
          style={{
            boxShadow:
              '0 30px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Gold tape strip */}
          <span
            aria-hidden
            className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] rounded-sm"
            style={{
              background:
                'linear-gradient(135deg, rgba(217,204,140,0.85) 0%, rgba(255,243,196,0.7) 50%, rgba(217,204,140,0.85) 100%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          />

          {/* Faint paper texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[1.5rem] opacity-30"
            style={{
              background:
                'radial-gradient(60% 80% at 30% 0%, rgba(217,204,140,0.08) 0%, transparent 60%), radial-gradient(70% 60% at 100% 100%, rgba(217,204,140,0.04) 0%, transparent 70%)',
            }}
          />

          <div className="relative space-y-6 font-display text-lg leading-relaxed text-ink md:text-xl">
            <p className="text-ink-dim">Hey —</p>

            <p>
              I wrote the first 53 books because the self-help section at the bookstore made me
              physically angry. Every one of them written by someone who had never run a payroll
              or shipped a customer order. Their idea of "operations" was a coaching frame.
            </p>

            <p>
              Thirteen years at <span className="metallic-text">Spiker Carpet and Tile Care</span> taught me
              that real discipline is not a vibe — it is a Tuesday morning. It is the second
              hour after a sleepless night. It is the email you don't want to send. The books
              are the field notes from those Tuesdays.
            </p>

            <p>
              If the genre got you nowhere, this might. If it didn't, you'll find out fast — every
              book ships with a 400-word sample at the door and a free chapter to your inbox if
              you want it. No drip, no upsell.
            </p>

            <p className="text-ink-dim">Read what hits. Skip what doesn't. You decide.</p>

            <div className="pt-4">
              <p
                className="font-display text-[2.4rem] italic font-light text-accent"
                style={{
                  fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                  transform: 'rotate(-2deg)',
                  display: 'inline-block',
                  letterSpacing: '-0.02em',
                }}
              >
                Brian Spiker
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-ink-mute">
                Founder · Apex Flow Publishing House
                <br />
                Owner-operator · Spiker Carpet and Tile Care
              </p>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

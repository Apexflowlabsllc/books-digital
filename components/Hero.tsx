'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Magnetic } from './Magnetic';

interface HeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}

export function Hero({ eyebrow, title, body, primary, secondary }: HeroProps) {
  const reduced = useReducedMotion();
  const t = (delay: number) =>
    reduced
      ? { duration: 0.001 }
      : { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  // bg-bg/55 rather than bg-bg: an opaque hero panel on every page was the
  // second reason the liquid metal was never visible — the first being the
  // site-wide backdrop blur removed in app/layout.tsx. A 55% scrim keeps the
  // headline readable and lets the shader flow underneath it.
  return (
    <section className="relative overflow-hidden border-b border-line bg-bg/55">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 0%, rgba(217,204,140,0.22) 0%, transparent 70%), radial-gradient(40% 50% at 100% 100%, rgba(217,204,140,0.08) 0%, transparent 70%)',
        }}
      />
      <div className="container-x relative z-10 py-24 md:py-36">
        {eyebrow ? (
          <motion.p
            className="eyebrow mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0)}
          >
            {eyebrow}
          </motion.p>
        ) : null}

        <motion.h1
          className="font-display text-5xl leading-[1.02] text-ink md:text-7xl lg:text-[5.5rem]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.08)}
        >
          {title}
        </motion.h1>

        {body ? (
          <motion.div
            className="mt-8 max-w-2xl text-base text-ink-dim md:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.18)}
          >
            {body}
          </motion.div>
        ) : null}

        {(primary || secondary) && (
          <motion.div
            className="mt-12 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.26)}
          >
            {primary ? (
              <Magnetic>
                <Link href={primary.href} className="cta-primary" data-cursor-label="Go">
                  <span>{primary.label}</span>
                </Link>
              </Magnetic>
            ) : null}
            {secondary ? (
              <Magnetic strength={0.25}>
                <Link href={secondary.href} className="cta-secondary" data-cursor-label="Browse">
                  <span>{secondary.label}</span>
                </Link>
              </Magnetic>
            ) : null}
          </motion.div>
        )}
      </div>
    </section>
  );
}

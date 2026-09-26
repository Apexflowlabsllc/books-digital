'use client';

import BorderGlow from './BorderGlow';

// "Across the ecosystem" — 12 sister brand cards using the digital store's
// BorderGlow treatment (per-brand glow + mesh-gradient fill) so every sub-
// domain's cross-brand carousel looks identical. Subdomain URL pattern:
// {brand}.apexflowlabs.com.
const BRANDS = [
  {
    brand: 'Apex Flow Labs',
    href: 'https://www.apexflowlabs.com',
    blurb:
      'The ultimate ecosystem for human elevation. We architect the tools, systems, and environments required to become the absolute best version of yourself.',
    pitch: 'Meet the labs →',
    accent: '#C9A560',
    glow: '45 100 65',
    colors: ['#C9A560', '#E8DBBF', '#F3E5C8'],
  },
  {
    brand: 'Apex Books',
    href: 'https://books.apexflowlabs.com',
    blurb:
      "The definitive library for the self-evolved. 100% pure self-help tactical guides written by people who've actually done the thing.",
    pitch: 'Read first chapter free →',
    accent: '#A78BFA',
    glow: '214 100 60',
    colors: ['#A78BFA', '#C4B5FD', '#DDD6FE'],
  },
  {
    brand: 'Apex Academy',
    href: 'https://academy.apexflowlabs.com',
    blurb:
      'Most courses are 60 hours of fluff to feel valuable. Ours are 8 hours of what actually works. Pay less, finish more, win sooner.',
    pitch: 'See the cohort →',
    accent: '#22C55E',
    glow: '142 100 75',
    colors: ['#22C55E', '#4ADE80', '#86EFAC'],
  },
  {
    brand: 'Apex Health',
    href: 'https://health.apexflowlabs.com',
    blurb:
      'Most supplements are colored sugar with a marketing budget. Ours have third-party labs and a refund policy. Read the panel. Then decide.',
    pitch: 'Optimize your health →',
    accent: '#EF4444',
    glow: '0 100 65',
    colors: ['#EF4444', '#F87171', '#FCA5A5'],
  },
  {
    brand: 'Apex Beauty',
    href: 'https://beauty.apexflowlabs.com',
    blurb:
      'Skincare without the seventeen-step ritual. Built on actives that have actually been studied. The rest is theater.',
    pitch: 'See the actives →',
    accent: '#F472B6',
    glow: '330 100 75',
    colors: ['#F472B6', '#F9A8D4', '#FBCFE8'],
  },
  {
    brand: 'Apex Pets',
    href: 'https://pets.apexflowlabs.com',
    blurb:
      "Your dog doesn't need a $90 'wellness blend.' He needs the thing that works. We sell that.",
    pitch: 'Shop for them →',
    accent: '#D4A574',
    glow: '30 100 65',
    colors: ['#D4A574', '#E5C4A1', '#F1E2CE'],
  },
  {
    brand: 'Apex Apparel',
    href: 'https://gear.apexflowlabs.com',
    blurb:
      "Hoodies built like armor. T-shirts that don't shrink. Worn by people who do things, not people who post about doing things.",
    pitch: 'Gear up →',
    accent: '#F5F5F5',
    glow: '0 0 98',
    colors: ['#F5F5F5', '#E5E5E5', '#D4D4D4'],
  },
  {
    brand: 'Apex Affiliates',
    href: 'https://partners.apexflowlabs.com',
    blurb:
      'The most high-level affiliate program on the market. Highest paying commissions for those elite enough to promote the best in the world.',
    pitch: 'Join the army →',
    accent: '#F59E0B',
    glow: '45 100 55',
    colors: ['#F59E0B', '#FBBF24', '#FCD34D'],
  },
  {
    brand: 'Apex Companion AI',
    href: 'https://www.apexcompanion.ai/',
    blurb:
      'Your digital best friend to help you get through life. Plans your week, books your dinner, and works out every problem you have.',
    pitch: 'Talk to Companion →',
    accent: '#06B6D4',
    glow: '190 100 60',
    colors: ['#06B6D4', '#22D3EE', '#67E8F9'],
  },
  {
    brand: 'Apex Warfare AI',
    href: 'https://warfare.apexflowlabs.com',
    blurb:
      '100% business accountability and tactical intelligence. Know your numbers, kill your excuses, and level up at all times.',
    pitch: 'Enter the bunker →',
    accent: '#DC2626',
    glow: '0 100 50',
    colors: ['#DC2626', '#B91C1C', '#991B1B'],
  },
  {
    brand: 'Apex Kids',
    href: 'https://kids.apexflowlabs.com',
    blurb:
      'Building the next generation of titans. Logic, systems, and AI literacy for the leaders who will inherit the future.',
    pitch: 'Future-proof them →',
    accent: '#FDE047',
    glow: '55 100 70',
    colors: ['#FDE047', '#FEF08A', '#FEF9C3'],
  },
  {
    brand: 'Spiker',
    href: 'https://spiker.apexflowlabs.com',
    blurb:
      'The Spiker Standard for service businesses — cleaning, contracting, lawn, pool, handyman. Operator-grade SOPs and pricing built for crews that actually run jobs.',
    pitch: 'Build to the standard →',
    accent: '#FF6B35',
    glow: '16 100 60',
    colors: ['#FF6B35', '#FF8C5C', '#FFA882'],
  },
];

export function AcrossEcosystem() {
  return (
    <section className="relative z-10 overflow-hidden px-6 py-20 sm:py-28 lg:py-32">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div
              className="font-mono text-[11px] uppercase inline-flex items-center gap-2 text-accent"
              style={{ letterSpacing: '0.14em' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              Across the ecosystem
            </div>
            <h2
              className="mt-5 text-white font-display"
              style={{
                fontSize: 'clamp(36px, 5.2vw, 80px)',
                lineHeight: 0.95,
                letterSpacing: '-0.035em',
              }}
            >
              Eleven more{' '}
              <span className="italic text-accent">Apex Flow Labs</span> companies — plus Spiker.
            </h2>
          </div>
          <p className="md:col-span-5 max-w-[44ch] text-[17px] leading-[1.55] text-white">
            One customer, twelve doors. Every sister brand is one click away.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {BRANDS.map((b) => (
            <BorderGlow
              key={b.brand}
              glowColor={b.glow}
              colors={b.colors}
              borderRadius={32}
              backgroundColor="#0F0F12"
              fillOpacity={0.4}
              className="group"
            >
              <a
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                data-interactive
                className="relative block p-8 transition-all duration-500 hover:-translate-y-0.5 h-full flex flex-col"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
              >
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top right, ${b.accent}15, transparent 60%)`,
                  }}
                />
                <div
                  className="relative font-mono text-[11px] uppercase mb-3 font-semibold"
                  style={{
                    color: b.accent,
                    letterSpacing: '0.14em',
                  }}
                >
                  {b.brand}
                </div>
                <p className="relative text-[18px] leading-[1.4] text-white flex-grow font-medium">
                  {b.blurb}
                </p>
                <div
                  className="relative mt-8 flex items-center justify-between border-t border-white/10 pt-5 font-mono text-[11px] uppercase"
                  style={{ letterSpacing: '0.12em' }}
                >
                  <span className="text-white">20% off</span>
                  <span
                    className="transition-transform group-hover:translate-x-0.5 font-bold"
                    style={{ color: b.accent }}
                  >
                    {b.pitch}
                  </span>
                </div>
              </a>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}

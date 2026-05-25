'use client';

// Gold-themed aurora background — ported from the Aceternity AuroraBackground
// composition (same gradient layering technique as
// apex-flow-labs/components/apex/GlobalBackground.tsx) but recolored to the
// Apex Publishing House palette: warm-dark base, gold + amber + ember bands
// instead of the original blue/violet. This layer is meant to be visible on
// every section of every page — keep section/card backgrounds translucent
// so it bleeds through.

export function AuroraBackground() {
  // Two layered aurora gradients — primary gold + warm amber wash on top —
  // give the bands more visual variety than a single repeating gradient.
  const auroraGold =
    'repeating-linear-gradient(100deg, #D9CC8C 8%, #FFE1D0 14%, #D9CC8C 20%, #4A5C44 26%, #e94e2b 32%)';
  const auroraAmber =
    'repeating-linear-gradient(115deg, #ffb86b 5%, #D9CC8C 12%, transparent 18%, #4A5C44 24%, transparent 32%)';
  const darkStripe =
    'repeating-linear-gradient(100deg, #0a0805 0%, #0a0805 6%, transparent 9%, transparent 11%, #0a0805 15%)';

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -10,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background:
          'radial-gradient(120% 80% at 50% 0%, #1f1408 0%, #0d0905 60%, #060403 100%)',
      }}
    >
      {/* Primary aurora layer */}
      <div
        style={{
          position: 'absolute',
          inset: '-10px',
          backgroundImage: `${darkStripe}, ${auroraGold}`,
          backgroundSize: '300%, 200%',
          backgroundPosition: '50% 50%, 50% 50%',
          opacity: 0.7,
          filter: 'blur(10px)',
          willChange: 'background-position',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `${darkStripe}, ${auroraGold}`,
            backgroundSize: '200%, 100%',
            backgroundAttachment: 'fixed',
            mixBlendMode: 'difference',
            animation: 'aurora 60s linear infinite',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Secondary amber wash — slower drift, opposite angle, screen blend */}
      <div
        style={{
          position: 'absolute',
          inset: '-20px',
          backgroundImage: auroraAmber,
          backgroundSize: '180%',
          backgroundPosition: '50% 50%',
          opacity: 0.35,
          filter: 'blur(40px)',
          mixBlendMode: 'screen',
          animation: 'aurora 90s linear infinite reverse',
          pointerEvents: 'none',
        }}
      />

      {/* Soft gold center pool — anchors the eye on copy without dimming bg */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(50% 50% at 50% 30%, rgba(217,204,140,0.18) 0%, transparent 65%), radial-gradient(60% 70% at 100% 100%, rgba(233,78,43,0.10) 0%, transparent 70%), radial-gradient(40% 50% at 0% 90%, rgba(255,200,120,0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Hairline gold sheen across the top */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(217,204,140,0.12) 0%, transparent 8%, transparent 92%, rgba(217,204,140,0.08) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

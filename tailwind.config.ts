import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Two-color base: pure black plus subtle frosted layers
        bg: {
          DEFAULT: '#0a0a0a',
          subtle: '#0f0f0f',
          raised: '#161616',
        },
        ink: {
          DEFAULT: '#FFFFFF',
          dim: '#B8B8B8',
          mute: '#8A8A8A', // was #6F6F6F (3.6:1 on #0a0a0a); this is 5.7:1, above the 4.5:1 AA minimum
        },
        line: 'rgba(255, 255, 255, 0.12)',

        // Themed palette — sampled from the user-supplied swatch:
        //   navy (#001428) → forest (#4A5C44) → khaki (#D9CC8C) → cream (#FFE1D0)
        // Accent is the khaki (default warm "gold" tone for CTAs + emphasis).
        accent: {
          DEFAULT: '#D9CC8C',
          hot: '#FFE1D0',
        },
        forest: {
          DEFAULT: '#4A5C44',
          deep: '#2e3a2a',
          line: 'rgba(74, 92, 68, 0.35)',
        },
        navy: {
          DEFAULT: '#001428',
          deep: '#000a18',
        },
        cream: '#FFE1D0',

        series: 'var(--series-color, #D9CC8C)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        wider: '0.05em',
        widest: '0.2em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        shimmer: 'shimmer 8s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;

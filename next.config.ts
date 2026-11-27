import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    /* 2026-05-18 INCIDENT: Next/Image optimization on Vercel double-bills
     * when fetching from remote sources. Set unoptimized=true to bypass
     * the optimization service entirely. Images render as plain <img>
     * equivalents at their source resolution. */
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.apexflowlabs.com',
        pathname: '/api/shop/image/**',
      },
      {
        protocol: 'https',
        hostname: 'apexflowlabs.com',
        pathname: '/api/shop/image/**',
      },
    ],
  },
  // Memberships were withdrawn from every Apex site (2026-09-25). Temporary redirect: a membership may come back in another form.
  async redirects() {
    return [{ source: '/membership', destination: '/', permanent: false }];
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' data: blob: https: wss:; media-src 'self' data: blob: https:; frame-src 'self' https:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self' https:; frame-ancestors 'self' https://www.apexflowlabs.com https://apexflowlabs.com; upgrade-insecure-requests" },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default config;

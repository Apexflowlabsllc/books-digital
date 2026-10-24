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
    return [
      { source: '/membership', destination: '/', permanent: false },
      // Older links pointed at /legal/*; the legal pages live at the top level.
      { source: '/legal/terms', destination: '/terms', permanent: false },
      { source: '/legal/privacy', destination: '/privacy', permanent: false },
      { source: '/legal/refund-policy', destination: '/refunds', permanent: false },
    ];
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default config;

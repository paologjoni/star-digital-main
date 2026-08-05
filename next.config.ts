import type { NextConfig } from 'next';

/* Albanian is served from the bare paths and English from /en, exactly as the
   pre-rebuild site was. Internally every page lives under app/[lang], so the
   four Albanian URLs are rewritten onto the sq branch and the /sq/* twin is
   redirected away to keep a single canonical URL per page.

   Rewrites here run in the `afterFiles` phase — after static files, before
   dynamic routes — so /about resolves to /sq/about rather than matching
   [lang] with lang="about". */

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/', destination: '/sq' },
      { source: '/about', destination: '/sq/about' },
      { source: '/services', destination: '/sq/services' },
      { source: '/contact', destination: '/sq/contact' },
    ];
  },

  async redirects() {
    return [
      { source: '/sq', destination: '/', permanent: true },
      { source: '/sq/:path*', destination: '/:path*', permanent: true },
    ];
  },

  async headers() {
    const immutable = [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ];

    return [
      { source: '/assets/:path*', headers: immutable },
      { source: '/logo.png', headers: immutable },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },

  /* Screenshots and the logo are already sized and compressed; skipping the
     optimizer keeps the build off Vercel's Hobby image-transform quota. */
  images: { unoptimized: true },
};

export default nextConfig;

/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://va.vercel-scripts.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob: https://play.google.com https://*.googleusercontent.com https://*.google-analytics.com https://pagead2.googlesyndication.com https://*.doubleclick.net",
      "font-src 'self' data:",
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://api.web3forms.com https://vitals.vercel-insights.com https://pagead2.googlesyndication.com https://*.doubleclick.net",
      "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.google.com",
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  i18n: {
    locales: ['el', 'en'],
    defaultLocale: 'el',
    localeDetection: false, // Αποτρέπει αυτόματα redirects ώστε τα bots των μηχανών αναζήτησης να σκανάρουν καθαρά και τις δύο γλώσσες
  },
  async headers() {
    return [
      {
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
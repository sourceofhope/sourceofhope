import type { NextConfig } from "next";

// Baseline security headers applied to every response. The CSP below only
// sets directives that can't break third-party embeds (Stripe, PayPal, GTM,
// YouTube, maps); script/connect allow-lists can be layered on later.
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      'camera=(), microphone=(), geolocation=(), payment=(self "https://js.stripe.com" "https://www.paypal.com")',
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Awards now lives under Media.
      { source: "/awards", destination: "/media/awards", permanent: true },
      { source: "/giving", destination: "/planned-giving", permanent: true },
    ];
  },
};

export default nextConfig;

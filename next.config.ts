import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { assertEnv } from "./src/lib/env";

// Fail a deployed build early when configuration is missing (02 §10).
assertEnv();

// Wires src/i18n/request.ts into every server render (ADR-0004).
const withNextIntl = createNextIntlPlugin();

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
    // No includeSubDomains: some older subdomains may still be served over
    // plain HTTP and would become unreachable.
    key: "Strict-Transport-Security",
    value: "max-age=63072000",
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
      {
        // YouTubeEmbed's click-to-load thumbnails.
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
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
      // Serve was renamed to Programs.
      { source: "/serve/:path*", destination: "/programs/:path*", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);

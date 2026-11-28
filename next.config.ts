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
  // Forwarding browser console output into .next/dev/logs makes the dev
  // file watcher rebuild and reload the page on every log line (a reload
  // loop in `next dev`). Errors still appear in the browser console.
  logging: { browserToTerminal: false },
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
    // Spec §8.5: permanent (308); Next keeps the incoming query string, so UTMs survive.
    // Retired giving pages open the matching Give door of the Hub on the homepage.
    const prefixes = ["", "/:prefix(es|pseudo)"];
    const to = (prefix: string, path: string) => (prefix ? `/:prefix${path === "/" ? "" : path}` : path);
    const pairs: [string, string][] = [
      ["/donate", "/?action=give&type=once"],
      ["/members", "/?action=give&type=monthly"],
      ["/sponsor", "/?action=give&type=business"],
      ["/planned-giving", "/?action=give&type=planned"],
      ["/giving", "/?action=give&type=planned"],
      ["/connect", "/contact"],
      ["/media/press", "/media#press"],
      ["/media/podcast", "/media#podcast"],
      ["/awards", "/media/awards"],
    ];
    return [
      ...pairs.flatMap(([source, destination]) =>
        prefixes.map((prefix) => {
          const [path, rest = ""] = destination.split(/(?=[?#])/);
          return { source: `${prefix}${source}`, destination: `${to(prefix, path)}${rest}` || "/", permanent: true };
        }),
      ),
      // Serve was renamed to Programs.
      { source: "/serve/:path*", destination: "/programs/:path*", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);

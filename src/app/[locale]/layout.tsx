import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { ToastRegion } from "@/components/ui/toast";
import { routing } from "@/i18n/routing";
import { fontVariables } from "../fonts";
import "../globals.css";

/*
 * Root layout for every public page. It owns <html>, fonts, translations and
 * analytics, and the one toast region. Page chrome (header, footer) comes from
 * the group layouts: (legacy) for pages not yet rebuilt, (site) for rebuilt ones.
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const GTM_ID = "GTM-P9G4WGS3";

export const metadata: Metadata = {
  metadataBase: new URL("https://thesourceofhope.org"),
  title: "The Source of Hope",
  description:
    "The Source of Hope is a nonprofit empowering communities through food, education, and holistic wellness programs.",
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: "https://thesourceofhope.org",
    title: "The Source of Hope",
    description: "Empowering communities through food, wellness, and education.",
    siteName: "The Source of Hope",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Source of Hope",
    description: "Empowering communities through food, wellness, and education.",
  },
  authors: [{ name: "The Source of Hope" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Source of Hope",
  url: "https://thesourceofhope.org",
  sameAs: [
    "https://www.facebook.com/thesourceofhope",
    "https://www.instagram.com/thesourceofhope",
    "https://www.linkedin.com/company/thesourceofhope",
  ],
};

export default async function LocaleRootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${fontVariables} bg-surface-inverse`}>
      <head>
        <meta name="theme-color" content="#0b1026" />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA).replace(/</g, "\\u003c") }}
        />
        <GoogleTagManager gtmId={GTM_ID} />
        <GoogleAnalytics gaId="AW-10925214570" />
      </head>
      <body className="bg-surface font-sans text-ink antialiased">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            title="Google Tag Manager"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Analytics />
        <SpeedInsights />
        <NextIntlClientProvider>
          {children}
          <ToastRegion />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

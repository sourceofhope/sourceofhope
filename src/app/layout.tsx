import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";
import { HeaderProvider } from "@/context/HeaderContext";
import { StoreCartProvider } from "@/context/StoreCartContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Header from "@/components/legacy/layout/Header";
import Footer from "@/components/legacy/layout/Footer";

// Variable fonts (one file each instead of 27 static weights). The CSS
// variables sit on <html> so the theme tokens in globals.css can read them.
const inter = Inter({ variable: "--nf-inter", subsets: ["latin"], display: "swap" });
const urbanist = Urbanist({ variable: "--nf-urbanist", subsets: ["latin"], display: "swap" });

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
    description:
      "Empowering communities through food, wellness, and education.",
    siteName: "The Source of Hope",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Source of Hope",
    description:
      "Empowering communities through food, wellness, and education.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaData = {
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

  return (
    <html
      lang="en"
      itemType="http://schema.org/WebPage"
      className={`${inter.variable} ${urbanist.variable} bg-surface-inverse`}>
      <head>
        <meta name="theme-color" content="#0b1026" />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData).replace(/</g, "\\u003c"),
          }}
        />
        <GoogleTagManager gtmId="GTM-P9G4WGS3" />
        <GoogleAnalytics gaId="AW-10925214570" />
      </head>
      <body
        className="antialiased bg-surface font-sans text-ink">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P9G4WGS3"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Analytics />
        <SpeedInsights />
        <HeaderProvider>
          <StoreCartProvider>
            <Header />
            <main className="w-full min-h-screen text-sm md:text-md lg:text-lg">
              {children}
            </main>
            <Footer />
          </StoreCartProvider>
        </HeaderProvider>
      </body>
    </html>
  );
}

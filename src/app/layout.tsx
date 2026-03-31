import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HeaderProvider } from "@/context/HeaderContext";
import { StoreCartProvider } from "@/context/StoreCartContext";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" itemType="http://schema.org/WebPage">
      <head>
        {/* Theme Color */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1b2b69" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Font Loading Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.run = window.run || function () {};
            `,
          }}
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "The Source of Hope",
              url: "https://thesourceofhope.org",
              sameAs: [
                "https://www.facebook.com/thesourceofhope",
                "https://www.instagram.com/thesourceofhope",
                "https://www.linkedin.com/company/thesourceofhope",
              ],
            }),
          }}
        />

        {/* Google Tag Manager Script */}
        <GoogleTagManager gtmId="GTM-P9G4WGS3" />
      </head>
      <body
        className={`${urbanist.variable} ${inter.variable} antialiased bg-neutral-50 font-inter text-neutral-900`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P9G4WGS3"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

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

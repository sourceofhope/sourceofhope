import type { Metadata } from "next";
import Script from "next/script";
import { Montserrat, Urbanist } from "next/font/google";
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

const montserrat = Montserrat({
  variable: "--font-montserrat",
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
        <meta name="theme-color" content="#1b2b69" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
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
      </head>
      <body className={`${urbanist.variable} ${montserrat.variable} antialiased bg-neutral-50 font-inter text-neutral-900`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P9G4WGS3"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        
        {/* Google Tag Manager Script */}
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
                var f = d.getElementsByTagName(s)[0],
                  j = d.createElement(s),
                  dl = l != "dataLayer" ? "&l=" + l : "";
                j.async = true;
                j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
                f.parentNode.insertBefore(j, f);
              })(window, document, "script", "dataLayer", "GTM-P9G4WGS3");
            `,
          }}
        />
        
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

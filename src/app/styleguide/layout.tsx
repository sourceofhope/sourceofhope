import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { ToastRegion } from "@/components/ui/toast";
import { fontVariables } from "../fonts";
import "../globals.css";

/*
 * Root layout for /styleguide: outside [locale], with no site chrome, so
 * components are shown on their own. English only (the request config falls
 * back to the default locale here).
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function StyleguideRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={fontVariables}>
      <body className="bg-surface font-sans text-ink antialiased">
        <NextIntlClientProvider>
          {children}
          <ToastRegion />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

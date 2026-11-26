import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { fontVariables } from "../fonts";
import "../globals.css";

/*
 * Root layout for the Staff Portal (/staff): outside [locale], English only
 * (ADR-0004), never indexed. The portal shell arrives in Phase 5.
 */
export const metadata: Metadata = {
  title: { default: "Staff Portal · The Source of Hope", template: "%s · Staff Portal" },
  robots: { index: false, follow: false },
};

export default function StaffRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={fontVariables}>
      <body className="bg-surface font-sans text-ink antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}

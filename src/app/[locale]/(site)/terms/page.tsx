import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { TERMS } from "@/content/legal";
import { LegalPage } from "@/features/legal/legal-page";
import type { AppLocale } from "@/i18n/locales";
import { localeAlternates } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Legal");
  const locale = (await getLocale()) as AppLocale;
  return { title: t("termsTitle"), description: t("termsMeta"), alternates: localeAlternates("/terms", locale) };
}

/* Terms of Use (spec §10.10). */
export default async function TermsPage() {
  const t = await getTranslations("Legal");
  return <LegalPage title={t("termsTitle")} sections={TERMS} />;
}

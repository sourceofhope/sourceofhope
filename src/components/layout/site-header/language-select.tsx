"use client";

import { useLocale, useTranslations } from "next-intl";
import { Select } from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ENABLED_LOCALES, hasLanguageChoice, LOCALE_LABELS, type AppLocale } from "@/i18n/locales";

/**
 * LanguageSelect: "English ▾" in the header, menu sheet and footer (spec
 * §8.6). Renders nothing while only one language is enabled, and appears on
 * its own once a second locale is switched on. Goes to the same page.
 */
export function LanguageSelect() {
  const t = useTranslations("UI");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  if (!hasLanguageChoice()) return null;
  return (
    <Select<AppLocale>
      label={t("language")}
      hideLabel
      options={ENABLED_LOCALES.map((value) => ({ value, label: LOCALE_LABELS[value].label }))}
      value={locale}
      onValueChange={(next) => {
        if (next && next !== locale) router.replace(pathname, { locale: next });
      }}
    />
  );
}

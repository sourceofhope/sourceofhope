import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ListingTemplate } from "@/components/layout/templates";
import { ProgramCard } from "@/features/programs/program-card";
import type { AppLocale } from "@/i18n/locales";
import { localeAlternates } from "@/i18n/metadata";
import { getPrograms } from "@/lib/content/loaders";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Programs");
  const locale = (await getLocale()) as AppLocale;
  return { title: t("indexTitle"), description: t("indexMetaDescription"), alternates: localeAlternates("/programs", locale) };
}

/* Programs index (spec §10.2): a one-paragraph intro, then five program cards. */
export default async function ProgramsPage() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Programs");
  const programs = await getPrograms(locale);
  return (
    <ListingTemplate header={{ title: t("indexTitle"), lead: t("indexLead") }}>
      <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <ProgramCard key={program.key} program={program} level={2} />
        ))}
      </ul>
    </ListingTemplate>
  );
}

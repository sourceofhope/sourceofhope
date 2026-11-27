import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ListingTemplate } from "@/components/layout/templates";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import { TeamCard } from "@/features/team/team-card";
import type { AppLocale } from "@/i18n/locales";
import { localeAlternates } from "@/i18n/metadata";
import { getTeam } from "@/lib/content/loaders";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("About");
  const locale = (await getLocale()) as AppLocale;
  return { title: t("teamTitle"), description: t("teamMeta"), alternates: localeAlternates("/about/team", locale) };
}

/* Team (spec §10.6): Listing grouped by team group, as a card grid (no carousel). */
export default async function TeamPage() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("About");
  const groups = await getTeam(locale);
  return (
    <ListingTemplate header={{ title: t("teamTitle"), lead: t("teamLead") }}>
      {groups.length ? (
        <div className="flex flex-col gap-section-sm">
          {groups.map((group) => (
            <section key={group.slug} aria-labelledby={`group-${group.slug}`} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Heading level={2} size="2xl" id={`group-${group.slug}`}>
                  {group.name}
                </Heading>
                {group.description ? <p className="max-w-prose text-muted">{group.description}</p> : null}
              </div>
              <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-4">
                {group.members.map((member) => (
                  <TeamCard key={member.slug} member={member} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState level={2} title={t("teamEmptyTitle")} />
      )}
    </ListingTemplate>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Prose } from "@/components/layout/prose";
import { DetailTemplate } from "@/components/layout/templates";
import { Image } from "@/components/ui/image";
import { TeamCard } from "@/features/team/team-card";
import type { AppLocale } from "@/i18n/locales";
import { localeAlternates } from "@/i18n/metadata";
import { getTeamMember } from "@/lib/content/loaders";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as AppLocale;
  const found = await getTeamMember(slug, locale);
  // Before streaming starts, so an unknown profile answers with a real 404 status.
  if (!found) notFound();
  return {
    title: found.member.name,
    description: found.member.shortBio ?? found.member.title ?? undefined,
    alternates: localeAlternates(`/about/team/${slug}`, locale),
  };
}

/* A team profile (spec §10.6): Detail template, one h1 (the name). */
export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params;
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("About");
  const found = await getTeamMember(slug, locale);
  if (!found) notFound();
  const { member, groupName, colleagues } = found;
  const bio = member.bio.length ? member.bio : member.shortBio ? [member.shortBio] : [];

  return (
    <DetailTemplate
      back={{ href: "/about/team", label: t("allTeam") }}
      eyebrow={groupName ?? undefined}
      title={member.name}
      meta={member.title ?? undefined}
      media={
        <Image
          src={member.image?.src ?? "/v2/core/Member-Placeholder.webp"}
          alt={member.image?.alt || ""}
          width={member.image?.width ?? 600}
          height={member.image?.height ?? 600}
          radius="lg"
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-4/5 w-full object-cover"
        />
      }
      related={
        colleagues.length && groupName
          ? {
              title: t("moreTeam", { group: groupName }),
              content: (
                <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3">
                  {colleagues.map((c) => (
                    <TeamCard key={c.slug} member={c} />
                  ))}
                </ul>
              ),
            }
          : undefined
      }
    >
      {bio.length ? (
        <Prose>
          {bio.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </Prose>
      ) : null}
    </DetailTemplate>
  );
}

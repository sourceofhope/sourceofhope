import { notFound, permanentRedirect } from "next/navigation";
import { getTeamMember } from "@/lib/content/loaders";

type Props = { params: Promise<{ slug: string }> };

/* Older links put team members at the site root (spec §8.5): send them to their profile. */
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!(await getTeamMember(slug))) notFound();
  return {};
}

export default async function LegacyTeamMemberRedirect({ params }: Props) {
  const { slug } = await params;
  const found = await getTeamMember(slug);
  if (!found) notFound();
  permanentRedirect(`/about/team/${encodeURIComponent(found.member.slug)}`);
}

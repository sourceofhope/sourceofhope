import { notFound, permanentRedirect } from "next/navigation";
import { fetchTeamMemberBySlug } from "@/lib/sanity-content";

// Older links pointed team members at the site root; send them to their profile.
export default async function LegacyTeamMemberRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await fetchTeamMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  permanentRedirect(`/about/team/${encodeURIComponent(member.slug.current)}`);
}

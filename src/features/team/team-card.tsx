import { Card, CardLink } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import type { TeamMember } from "@/lib/content/loaders";

/** TeamCard: photo, name and title, linking to the profile. Replaces the old team carousel. */
export function TeamCard({ member, level = 3 }: { member: TeamMember; level?: 2 | 3 | 4 }) {
  return (
    <Card as="li" interactive>
      {member.image ? (
        <Image src={member.image.src} alt="" width={member.image.width} height={member.image.height} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="aspect-square w-full object-cover" />
      ) : (
        <Image src="/v2/core/Member-Placeholder.webp" alt="" width={600} height={600} className="aspect-square w-full object-cover" />
      )}
      <div className="flex flex-col gap-1 p-4">
        <Heading level={level} size="xl">
          <CardLink href={`/about/team/${member.slug}`}>{member.name}</CardLink>
        </Heading>
        {member.title ? <p className="text-sm text-muted">{member.title}</p> : null}
      </div>
    </Card>
  );
}

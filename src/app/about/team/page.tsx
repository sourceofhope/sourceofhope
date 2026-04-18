import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/ui/PageSection";
import Title from "@/components/ui/Title";
import Carousel from "@/components/ui/Carousel";

import { type SanityDocument } from "next-sanity";
import { CarouselCard } from "./CarouselCard";
import { client } from "@/lib/client";

interface TeamMember extends SanityDocument {
  _id: string;
  name: string;
  slug: { current: string };
  title?: string;
  shortBio?: string;
  image?: {
    sourceUrl?: string;
    altText?: string;
  };
}

interface Team extends SanityDocument {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  members: TeamMember[];
}

const TEAMS_WITH_MEMBERS_QUERY = `
*[_type == "team"] {
  _id,
  name,
  slug,
  description,
  "members": *[_type == "teamMember" && team._ref == ^._id] | order(name asc) {
    _id,
    name,
    slug,
    title,
		shortBio,
    "image": image{
      "sourceUrl": asset->url,
      "altText": alt
    },
    team->{
      _id,
      name,
    }
  }
}
`;

const options = { next: { revalidate: 30 } };

// Define the preferred order of teams
const TEAM_ORDER = [
  "Executive Board",
  "Director Board",
  "EPP Spring 2026",
  "EPP Fall 2025",
  "EPP Summer 2025",
  "Advisory Spring 2025",
  "EPP Spring 2025",
  "EPP Fall 2024",
  "EPP Summer 2024",
  "EPP Spring 2024",
];

export const metadata: Metadata = {
  title: "Team | The Source of Hope",
  description:
    "Meet the team at The Source of Hope dedicated to serving our community.",
};

async function getTeams() {
  try {
    const teams = await client.fetch<Team[]>(
      TEAMS_WITH_MEMBERS_QUERY,
      {},
      options,
    );
    return teams
      .filter((team) => team.members.length > 0)
      .map((team) => ({
        ...team,
        members: sortMembersByImage(team.members),
      }));
  } catch {
    return null;
  }
}

// Helper function to sort teams by preferred order
function sortTeamsByOrder(teams: Team[]): Team[] {
  // Create a map for O(1) lookups instead of O(n) indexOf calls
  const teamIndexMap = new Map<string, number>();
  TEAM_ORDER.forEach((name, index) => {
    teamIndexMap.set(name.toLowerCase().trim(), index);
  });

  return teams.sort((a, b) => {
    const aIndex = teamIndexMap.get(a.name.toLowerCase().trim());
    const bIndex = teamIndexMap.get(b.name.toLowerCase().trim());

    // Both teams are in TEAM_ORDER - sort by their defined order
    if (aIndex !== undefined && bIndex !== undefined) {
      return aIndex - bIndex;
    }

    // Only team A is in TEAM_ORDER - it comes first
    if (aIndex !== undefined) return -1;

    // Only team B is in TEAM_ORDER - it comes first
    if (bIndex !== undefined) return 1;

    // Neither is in TEAM_ORDER - sort alphabetically
    return a.name.localeCompare(b.name);
  });
}

export default async function Team() {
  const teamsWithMembers = await getTeams();

  if (teamsWithMembers === null) {
    return (
      <>
        <PageHeader>
          <h1 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
            TEAM
          </h1>
          <p className="font-semibold text-neutral-200 text-sm">WHO WE ARE</p>
        </PageHeader>
        <section className="w-full md:justify-items-left items-center grid my-5 px-5 lg:px-35 min-h-screen">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-urbanist mb-4">Team</h2>
            <p className="text-neutral-600">
              Unable to load team data. Please try again later.
            </p>
          </div>
        </section>
      </>
    );
  }

  const sortedTeams = sortTeamsByOrder(teamsWithMembers);

  if (sortedTeams.length === 0) {
    return (
      <>
        <PageHeader>
          <h1 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
            TEAM
          </h1>
          <p className="font-semibold text-neutral-200 text-sm">WHO WE ARE</p>
        </PageHeader>
        <section className="w-full md:justify-items-left items-center grid my-5 px-5 lg:px-35 min-h-screen">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-urbanist mb-4">
              Team Members
            </h2>
            <p className="text-neutral-600">
              No team members found. Check back soon!
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader>
        <h1 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          TEAM
        </h1>
        <p className="font-semibold text-neutral-200 text-sm">WHO WE ARE</p>
      </PageHeader>
      <PageSection className="pt-5">
        <div className="grid gap-5">
          {sortedTeams.map((team) => (
            <CarouselLayer
              key={team._id}
              title={team.name}
              members={team.members}
            />
          ))}
        </div>
      </PageSection>
    </>
  );
}

function sortMembersByImage(members: TeamMember[]): TeamMember[] {
  return members.sort((a, b) => {
    const aHasImage = a.image?.sourceUrl ? 1 : 0;
    const bHasImage = b.image?.sourceUrl ? 1 : 0;
    return bHasImage - aHasImage;
  });
}

interface CarouselLayerProps {
  title: string;
  members: TeamMember[];
}

function CarouselLayer({ title, members }: CarouselLayerProps) {
  if (!members || members.length === 0) {
    return (
      <div className="grid gap-5">
        <Title>{title}</Title>
        <div className="min-h-40 flex items-center">
          <p className="w-full text-center text-neutral-500">
            No team members to display
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <Title>{title}</Title>
      <div className="min-h-40 flex items-center opacity-100 transition-opacity duration-750">
        <CarouselContent members={members} />
      </div>
    </div>
  );
}

function CarouselContent({ members }: { members: TeamMember[] }) {
  return (
    <Carousel itemsPerView={{ base: 1, md: 2, lg: 3 }} showProgress>
      {members.map((member) => (
        <CarouselCard key={member._id} member={member} />
      ))}
    </Carousel>
  );
}

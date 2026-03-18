import { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { type SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";

interface Team extends SanityDocument {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
}

interface TeamMember extends SanityDocument {
  _id: string;
  name: string;
  slug: { current: string };
  title?: string;
  bio?: string;
  image?: {
    sourceUrl?: string;
    altText?: string;
  };
  team?: Team;
}

interface TeamWithMembers extends Team {
  members: TeamMember[];
}

const TEAMS_QUERY = `*[_type == "team"] {
  _id,
  name,
  slug,
  description,
}`;

const TEAM_MEMBERS_QUERY = `*[_type == "teamMember" && team._ref == $teamId] | order(name asc) {
  _id,
  name,
  slug,
  title,
  bio,
  image,
  team->{
    _id,
    name,
  }
}`;

// Define the preferred order of teams
const TEAM_ORDER = [
  "Executive Board",
  "Director Board",
  "Interns Spring 2026",
  "Interns Fall 2025",
  "Interns Summer 2025",
  "Advisory Spring 2025",
  "Interns Spring 2025",
  "Interns Fall 2024",
  "Interns Summer 2024",
  "Interns Spring 2024",
];

const options = { next: { revalidate: 30 } };

export const metadata: Metadata = {
  title: "Team | The Source of Hope",
  description:
    "Meet the team at The Source of Hope dedicated to serving our community.",
};

// Helper function to sort teams by preferred order
function sortTeamsByOrder(teams: TeamWithMembers[]): TeamWithMembers[] {
  return teams.sort((a, b) => {
    // Normalize names for comparison (case-insensitive, trimmed)
    const normalizeName = (name: string) => name.toLowerCase().trim();
    const normalizeOrderName = (name: string) => name.toLowerCase().trim();
    
    const normalizedAName = normalizeName(a.name);
    const normalizedBName = normalizeName(b.name);
    
    const normalizedOrder = TEAM_ORDER.map(normalizeOrderName);
    
    const indexA = normalizedOrder.indexOf(normalizedAName);
    const indexB = normalizedOrder.indexOf(normalizedBName);

    // Teams in TEAM_ORDER come first, in specified order
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only one is in TEAM_ORDER, it comes first
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // If neither is in TEAM_ORDER, sort alphabetically
    return a.name.localeCompare(b.name);
  });
}

export default async function Team() {
  // Fetch all teams
  const teams = await client.fetch<Team[]>(TEAMS_QUERY, {}, options);

  if (!teams || teams.length === 0) {
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
              Team Groups
            </h2>
            <p className="text-neutral-600">
              No team groups found. Check back soon!
            </p>
          </div>
        </section>
      </>
    );
  }

  // Fetch members for each team
  const teamsWithMembers: TeamWithMembers[] = await Promise.all(
    teams.map(async (team) => {
      const members = await client.fetch<TeamMember[]>(
        TEAM_MEMBERS_QUERY,
        { teamId: team._id },
        options
      );
      return {
        ...team,
        members: members || [],
      };
    })
  );

  // Filter out teams with no members, then sort by preferred order
  let teamsWithContent = teamsWithMembers.filter(
    (team) => team.members.length > 0
  );
  
  // Sort the final filtered teams by preferred order
  teamsWithContent = sortTeamsByOrder(teamsWithContent);

  if (teamsWithContent.length === 0) {
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
      <section className="w-full grid my-5 px-5 lg:px-35 pb-20">
        <div className="w-full flex flex-col gap-16">
          {teamsWithContent.map((team) => (
            <div key={team._id} className="w-full">
              <h2 className="text-3xl font-bold font-urbanist mb-2 text-neutral-900">
                {team.name}
              </h2>
              {team.description && (
                <p className="text-neutral-600 mb-6">{team.description}</p>
              )}

              {/* Team Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.members.map((member) => (
                  <Link
                    key={member._id}
                    href={`/about/team/${member.slug.current}`}>
                    <article className="group h-full rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white cursor-pointer">
                      {/* Member Image */}
                      {member.image?.sourceUrl ? (
                        <div className="w-full h-64 overflow-hidden bg-neutral-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={member.image.sourceUrl}
                            alt={member.image.altText || member.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                          <span className="text-neutral-400 text-sm">
                            No image
                          </span>
                        </div>
                      )}

                      {/* Member Info */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold font-urbanist text-neutral-900 group-hover:text-primary-600 transition-colors">
                          {member.name}
                        </h3>
                        {member.title && (
                          <p className="text-sm font-medium text-neutral-600 mb-2">
                            {member.title}
                          </p>
                        )}
                        {member.bio && (
                          <p className="text-sm text-neutral-600 line-clamp-2">
                            {member.bio}
                          </p>
                        )}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

interface TeamMember {
  _id: string;
  slug: { current: string };
  name: string;
  title?: string;
  bio?: string;
  image?: {
    sourceUrl?: string;
    altText?: string;
  };
}

interface Team {
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
    bio,
    image,
    team->{
      _id,
      name,
    }
  }
}
`;

// Helper function to sort members within a team (members with images first)
function sortMembersByImage(members: TeamMember[]): TeamMember[] {
  return members.sort((a, b) => {
    const aHasImage = a.image?.sourceUrl ? 1 : 0;
    const bHasImage = b.image?.sourceUrl ? 1 : 0;
    return bHasImage - aHasImage; // Members with images come first
  });
}

// /api/team-member route handler to fetch all teams with their members
export async function GET() {
  try {
    const teams = await client.fetch<Team[]>(TEAMS_WITH_MEMBERS_QUERY);
    
    // Filter out teams with no members and sort members within each team
    const teamsWithMembers = teams
      .filter((team) => team.members.length > 0)
      .map((team) => ({
        ...team,
        members: sortMembersByImage(team.members),
      }));
    
    return NextResponse.json(teamsWithMembers);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch team data', details: message },
      { status: 500 }
    );
  }
}

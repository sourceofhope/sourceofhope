import { NextResponse } from "next/server";
import {
  fetchTeamGroupsWithMembers,
  type SanityTeamMember as TeamMember,
} from "@/lib/sanity-content";

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
    const teams = await fetchTeamGroupsWithMembers();

    // Filter out teams with no members and sort members within each team
    const teamsWithMembers = teams
      .filter((team) => team.members.length > 0)
      .map((team) => ({
        ...team,
        members: sortMembersByImage(team.members),
      }));

    return NextResponse.json(teamsWithMembers);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch team data", details: message },
      { status: 500 },
    );
  }
}

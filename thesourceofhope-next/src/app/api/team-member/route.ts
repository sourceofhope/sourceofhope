import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

const TEAM_QUERY = `
*[_type == "team"] {
  "slug": slug.current,
  "members": *[_type == "teamMember" && team._ref == ^._id] | order(name asc) {
    "id": _id,
    "slug": slug.current,
    "name": name,
    "title": title,
    "bio": bio,
    "image": {
      "source_url": image.sourceUrl,
      "alt_text": image.altText
    }
  }
}
`;

export async function GET() {
  try {
    const teams = await client.fetch(TEAM_QUERY);
    
    // Transform array to object keyed by team slug
    const data = teams.reduce((acc: Record<string, unknown>, team: any) => {
      acc[team.slug] = team.members;
      return acc;
    }, {});
    
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch team data', details: message },
      { status: 500 }
    );
  }
}

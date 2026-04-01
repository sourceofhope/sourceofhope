import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

const BANNER_QUERY = `
*[_type == "bannerConfig"] | order(_createdAt desc) {
  "enabled": enabled,
  "text": text,
  "link": {
    "url": link.url
  },
  "expires": expires
}
`;

export async function GET() {
  try {
    const banners = await client.fetch(BANNER_QUERY);
    
    // Transform to match banner-config.js structure
    const data = banners.map((banner: any) => ({
      acf: banner
    }));
    
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch banner config', details: message },
      { status: 500 }
    );
  }
}

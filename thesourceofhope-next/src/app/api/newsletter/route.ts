import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

const NEWSLETTER_QUERY = `
*[_type == "newsletter"] | order(_createdAt desc) {
  "id": externalId,
  "acf": {
    "title": title,
    "url": url
  },
  "_embedded": {
    "wp:featuredmedia": [
      {
        "alt_text": featuredMedia.altText,
        "source_url": featuredMedia.sourceUrl
      }
    ]
  }
}
`;

// /api/newsletter route handler to fetch newsletters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const perPage = parseInt(searchParams.get('per_page') || '12', 10);
    
    const newsletters = await client.fetch(NEWSLETTER_QUERY);
    const limitedNewsletters = newsletters.slice(0, perPage);
    
    return NextResponse.json(limitedNewsletters);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch newsletters', details: message },
      { status: 500 }
    );
  }
}

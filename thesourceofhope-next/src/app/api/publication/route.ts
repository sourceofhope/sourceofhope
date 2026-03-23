import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

const PUBLICATION_QUERY = `
*[_type == "publication"] | order(date desc) {
  "id": externalId,
  "acf": {
    "title": title,
    "date": date,
    "summary": summary,
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

// /api/publication route handler to fetch publications
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const perPage = parseInt(searchParams.get('per_page') || '12', 10);
    
    const publications = await client.fetch(PUBLICATION_QUERY);
    const limitedPublications = publications.slice(0, perPage);
    
    return NextResponse.json(limitedPublications);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch publications', details: message },
      { status: 500 }
    );
  }
}

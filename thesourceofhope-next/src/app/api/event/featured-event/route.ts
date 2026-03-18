import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

const FEATURED_EVENT_QUERY = `
*[_type == "featuredEvent"] | order(date desc) {
  "id": externalId,
  "acf": {
    "title": title,
    "date": date,
    "location": location,
    "summary": summary,
    "event_page": {
      "url": eventPage.url
    }
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

export async function GET() {
  try {
    const events = await client.fetch(FEATURED_EVENT_QUERY);
    return NextResponse.json(events);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch featured events', details: message },
      { status: 500 }
    );
  }
}

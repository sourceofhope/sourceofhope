import { NextResponse } from "next/server";
import { client } from "../../../../../studio/client";

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

// /api/event/featured-event route handler to fetch featured events
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const perPage = parseInt(searchParams.get("per_page") || "12", 10);

    const events = await client.fetch(FEATURED_EVENT_QUERY);
    const limitedEvents = events.slice(0, perPage);

    return NextResponse.json(limitedEvents);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch featured events", details: message },
      { status: 500 },
    );
  }
}

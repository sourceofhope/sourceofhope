import { NextResponse } from "next/server";
import { client } from "../../../../../studio/client";

const RECURRING_EVENT_QUERY = `
*[_type == "recurringEvent"] | order(date desc) {
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

// /api/event/recurring-event route handler to fetch recurring events
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const perPage = parseInt(searchParams.get("per_page") || "3", 10);

    const events = await client.fetch(RECURRING_EVENT_QUERY);
    const limitedEvents = events.slice(0, perPage);

    return NextResponse.json(limitedEvents);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch recurring events", details: message },
      { status: 500 },
    );
  }
}

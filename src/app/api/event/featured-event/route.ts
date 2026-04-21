import { NextResponse } from "next/server";
import { fetchFeaturedEvents } from "@/lib/sanity-content";

// /api/event/featured-event route handler to fetch featured events
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const perPage = parseInt(searchParams.get("per_page") || "12", 10);

    return NextResponse.json(await fetchFeaturedEvents(perPage));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch featured events", details: message },
      { status: 500 },
    );
  }
}

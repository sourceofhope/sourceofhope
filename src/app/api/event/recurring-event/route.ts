import { NextResponse } from "next/server";
import { fetchRecurringEvents } from "@/lib/sanity-content";

// /api/event/recurring-event route handler to fetch recurring events
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const perPage = parseInt(searchParams.get("per_page") || "3", 10);

    return NextResponse.json(await fetchRecurringEvents(perPage));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch recurring events", details: message },
      { status: 500 },
    );
  }
}

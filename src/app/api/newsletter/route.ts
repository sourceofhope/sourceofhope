import { NextResponse } from "next/server";
import { fetchNewsletters } from "@/lib/sanity-content";

// /api/newsletter route handler to fetch newsletters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const perPage = parseInt(searchParams.get("per_page") || "12", 10);

    return NextResponse.json(await fetchNewsletters(perPage));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch newsletters", details: message },
      { status: 500 },
    );
  }
}

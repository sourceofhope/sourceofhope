import { NextResponse } from "next/server";
import { fetchPublications } from "@/lib/sanity-content";

// /api/publication route handler to fetch publications
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const perPage = parseInt(searchParams.get("per_page") || "12", 10);

    return NextResponse.json(await fetchPublications(perPage));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch publications", details: message },
      { status: 500 },
    );
  }
}

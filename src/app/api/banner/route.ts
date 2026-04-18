import { NextResponse } from "next/server";
import { fetchBannerEvents } from "@/lib/sanity-content";

export async function GET() {
  try {
    return NextResponse.json(await fetchBannerEvents());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch banner config", details: message },
      { status: 500 },
    );
  }
}

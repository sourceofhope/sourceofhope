import { NextResponse } from "next/server";
import { fetchBannerEvents } from "@/lib/sanity-content";

export async function GET() {
  try {
    return NextResponse.json(await fetchBannerEvents());
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch banner events" },
      { status: 500 },
    );
  }
}

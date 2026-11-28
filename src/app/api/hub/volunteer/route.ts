import { NextResponse } from "next/server";
import { getVolunteerEvents } from "@/lib/hub-data";
import { HUB_CACHE, hubLang } from "../lang";

/** GET /api/hub/volunteer — upcoming events that take volunteers, with spots left (spec §9.6). */
export async function GET(request: Request) {
  return NextResponse.json({ events: await getVolunteerEvents(hubLang(request)) }, { headers: HUB_CACHE });
}

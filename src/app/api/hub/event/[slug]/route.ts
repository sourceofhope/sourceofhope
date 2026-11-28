import { NextResponse } from "next/server";
import { getHubEvent } from "@/lib/hub-data";
import { HUB_CACHE, SLUG, hubLang } from "../../lang";

/** GET /api/hub/event/:slug — one published event for the Hub's event details (spec §9.4). */
export async function GET(request: Request, { params }: RouteContext<"/api/hub/event/[slug]">) {
  const { slug } = await params;
  if (!SLUG.test(slug)) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const event = await getHubEvent(slug, hubLang(request));
  if (!event) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ event }, { headers: HUB_CACHE });
}

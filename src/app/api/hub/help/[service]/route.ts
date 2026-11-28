import { NextResponse } from "next/server";
import { getHelpService } from "@/lib/hub-data";
import { HUB_CACHE, SLUG, hubLang } from "../../lang";

/** GET /api/hub/help/:service — one Get Help service (spec §9.5). */
export async function GET(request: Request, { params }: RouteContext<"/api/hub/help/[service]">) {
  const { service: slug } = await params;
  const service = SLUG.test(slug) ? await getHelpService(slug, hubLang(request)) : null;
  if (!service) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ service }, { headers: HUB_CACHE });
}

import { NextResponse } from "next/server";
import { getHelpData } from "@/lib/hub-data";
import { HUB_CACHE, hubLang, hubNeed } from "../lang";

/** GET /api/hub/help?need= — services and guest events for one need (spec §9.5). Collects nothing. */
export async function GET(request: Request) {
  const need = hubNeed(request);
  if (!need) return NextResponse.json({ error: "bad_need" }, { status: 400 });
  return NextResponse.json(await getHelpData(need, hubLang(request)), { headers: HUB_CACHE });
}

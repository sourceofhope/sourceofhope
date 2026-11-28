import { getHubEvent } from "@/lib/hub-data";
import { buildIcs } from "@/lib/ics";
import { SLUG, hubLang } from "../../../lang";

/** GET /api/hub/event/:slug/ics — "Add to calendar" for one published event (spec §9.4). */
export async function GET(request: Request, { params }: RouteContext<"/api/hub/event/[slug]/ics">) {
  const { slug } = await params;
  const event = SLUG.test(slug) ? await getHubEvent(slug, hubLang(request)) : null;
  if (!event) return new Response("Not found", { status: 404 });
  const origin = new URL(request.url).origin;
  const location = [event.venueName, event.address].filter(Boolean).join(", ");
  const body = buildIcs({
    uid: `${event.slug}@thesourceofhope.org`,
    title: event.title,
    description: event.summary,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    location: location || null,
    url: `${origin}/events?event=${event.slug}`,
  });
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
      "Cache-Control": "public, max-age=0, s-maxage=300",
    },
  });
}

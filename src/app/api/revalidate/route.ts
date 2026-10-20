import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { getEnvironment } from "@/lib/environment.server";
import { SANITY_CACHE_TAG } from "@/lib/sanity-content";

/**
 * Sanity webhook target. Publishing a document in the Studio calls this
 * route, which expires cached CMS content so the site updates immediately.
 *
 * Setup: in Sanity (manage.sanity.io → API → Webhooks) add a webhook for the
 * production dataset pointing at https://<site>/api/revalidate, method POST,
 * with the same secret as SANITY_REVALIDATE_SECRET.
 */
export async function POST(request: NextRequest) {
  const { sanityRevalidateSecret } = getEnvironment();

  if (!sanityRevalidateSecret) {
    console.error("SANITY_REVALIDATE_SECRET not configured");
    return NextResponse.json(
      { error: "Revalidation is not configured" },
      { status: 500 },
    );
  }

  try {
    const { isValidSignature } = await parseBody(
      request,
      sanityRevalidateSecret,
      true,
    );

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    revalidateTag(SANITY_CACHE_TAG, { expire: 0 });
    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error("Revalidation failed", error);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}

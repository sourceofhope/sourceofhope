"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { parseHub } from "@/lib/hub-url";

/*
 * Google Tag Manager and the Google Ads tag (spec §16). They stay on the
 * site's pages, but no ad or tracking pixel runs inside the Hub or on Get
 * Help (spec §9.5, §16): the tags load only once the visitor is on a page
 * outside the Hub, and Google's tags are switched off while the Hub is open.
 */

export const GTM_ID = "GTM-P9G4WGS3";
const ADS_ID = "AW-10925214570";
/** Tag IDs gtag.js checks for `ga-disable-<id>`: the Ads tag and the GA4 property in the GTM container. */
const GOOGLE_TAG_IDS = [ADS_ID, "G-Y1243WZ1N8"];

function Tags() {
  const searchParams = useSearchParams();
  const inHub = parseHub(searchParams) !== null;
  // Load once the visitor has been on a page outside the Hub; never unload.
  const [allowed, setAllowed] = useState(!inHub);
  if (!inHub && !allowed) setAllowed(true);

  useEffect(() => {
    const flags = window as unknown as Record<string, boolean>;
    for (const id of GOOGLE_TAG_IDS) flags[`ga-disable-${id}`] = inHub;
  }, [inHub]);

  if (!allowed) return null;
  return (
    <>
      <GoogleTagManager gtmId={GTM_ID} />
      <GoogleAnalytics gaId={ADS_ID} />
    </>
  );
}

export function MarketingTags() {
  return (
    <Suspense fallback={null}>
      <Tags />
    </Suspense>
  );
}

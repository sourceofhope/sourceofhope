/**
 * Built-in site settings until the v2 Sanity `siteSettings` document is
 * filled in. Impact numbers are the ones on today's homepage; their as-of
 * date is a content task (spec §10.1), so none is shown yet.
 */
export type ImpactStat = { value: number; suffix: string; label: string; asOf: string | null };

export const FALLBACK_IMPACT: readonly ImpactStat[] = [
  { value: 353000, suffix: "+", label: "Free meals served", asOf: null },
  { value: 273000, suffix: "+", label: "Volunteer hours", asOf: null },
  { value: 50, suffix: "+", label: "Partner nonprofits", asOf: null },
  { value: 5, suffix: "", label: "Programs", asOf: null },
];

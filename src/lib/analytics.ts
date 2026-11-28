import { track } from "@vercel/analytics";

/*
 * Product analytics events (spec §13). Names and properties describe the
 * journey only: never names, emails, amounts typed by a person, or anything
 * else personal.
 */

export type AnalyticsEvent =
  | { name: "hub_open"; props: { door: string; type?: string; via: "link" | "url" } }
  | { name: "hub_step"; props: { door: string; type?: string; step: string } }
  | { name: "hub_close"; props: { door: string; step?: string } }
  | { name: "hub_complete"; props: { door: string; type?: string } }
  | { name: "newsletter_signup"; props: { placement: string } };

export function trackEvent({ name, props }: AnalyticsEvent) {
  try {
    track(name, Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined)) as Record<string, string>);
  } catch {
    // Analytics never breaks a journey.
  }
}

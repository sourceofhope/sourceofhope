import { z } from "zod";

/*
 * The Action Hub URL contract (02 §3, ADR-0002). The Hub is driven by query
 * parameters on any path; this module is the only code that reads or writes
 * them. Invalid values are dropped so a mangled link still opens the nearest
 * valid state. Never put personal data, tokens or signing URLs here.
 */

export const HUB_ACTIONS = ["help", "volunteer", "give"] as const;
export const GIVE_TYPES = ["once", "monthly", "planned", "business"] as const;
export const HELP_NEEDS = ["food", "health", "education", "outdoors", "other"] as const;
export const EVENT_VIEWS = ["guest", "volunteer"] as const;

export type HubAction = (typeof HUB_ACTIONS)[number];
export type GiveType = (typeof GIVE_TYPES)[number];
export type HelpNeed = (typeof HELP_NEEDS)[number];
export type EventView = (typeof EVENT_VIEWS)[number];

/** Each flow's steps, in order (spec §9.5–9.7). Get Help and event details have none: their params are the state. */
export const VOLUNTEER_STEPS = ["event", "shift", "people", "review", "sign", "done"] as const;
export const GIVE_STEPS = {
  once: ["amount", "details", "payment", "done"],
  monthly: ["amount", "details", "payment", "done"],
  planned: ["learn", "inquiry", "done"],
  business: ["tiers", "details", "payment", "inquiry", "done"],
} as const satisfies Record<GiveType, readonly string[]>;

export type VolunteerStep = (typeof VOLUNTEER_STEPS)[number];
export type GiveStep<T extends GiveType = GiveType> = (typeof GIVE_STEPS)[T][number];

/** Every key the Hub owns. Closing removes exactly these; UTMs and anything else stay. */
export const HUB_KEYS = ["action", "type", "need", "service", "event", "view", "designation", "step", "ref"] as const;
type HubKey = (typeof HUB_KEYS)[number];

export type HubState =
  | { action: "event"; event: string; view?: EventView }
  | { action: "help"; need?: HelpNeed; service?: string; event?: string }
  | { action: "volunteer"; event?: string; step?: VolunteerStep }
  | { action: "give"; type?: GiveType; designation?: string; step?: GiveStep; ref?: string };

const slug = z.string().regex(/^[a-z0-9][a-z0-9-]{0,99}$/);
/** Program keys as Sanity and src/content name them (`servingHope`). */
const programKey = z.string().regex(/^[a-zA-Z][a-zA-Z0-9-]{0,49}$/);
/** Opaque payment reference: random, unguessable, URL-safe (02 §3). */
const paymentRef = z.string().regex(/^[A-Za-z0-9_-]{16,64}$/);

/** Optional and forgiving: a bad value becomes undefined instead of failing the whole parse. */
const loose = <T extends z.ZodType>(schema: T) => schema.optional().catch(undefined);

const rawSchema = z.object({
  action: loose(z.enum(HUB_ACTIONS)),
  type: loose(z.enum(GIVE_TYPES)),
  need: loose(z.enum(HELP_NEEDS)),
  service: loose(slug),
  event: loose(slug),
  view: loose(z.enum(EVENT_VIEWS)),
  designation: loose(programKey),
  step: loose(z.string().regex(/^[a-z]{2,20}$/)),
  ref: loose(paymentRef),
});

type SearchInput = URLSearchParams | string | Record<string, string | string[] | undefined>;

function toParams(input: SearchInput): URLSearchParams {
  if (input instanceof URLSearchParams) return input;
  if (typeof input === "string") return new URLSearchParams(input);
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0] !== undefined) params.set(key, value[0]);
  }
  return params;
}

function isIn<T extends string>(list: readonly T[], value: string | undefined): value is T {
  return value !== undefined && (list as readonly string[]).includes(value);
}

/**
 * Read the Hub state from a query string. Returns null when the Hub is
 * closed. Values that don't belong to the opened flow are dropped.
 */
export function parseHub(input: SearchInput): HubState | null {
  const params = toParams(input);
  const raw = rawSchema.parse(Object.fromEntries(HUB_KEYS.map((key) => [key, params.get(key) ?? undefined])));

  switch (raw.action) {
    case "help":
      return strip({ action: "help", need: raw.need, service: raw.service, event: raw.event });
    case "volunteer":
      return strip({ action: "volunteer", event: raw.event, step: isIn(VOLUNTEER_STEPS, raw.step) ? raw.step : undefined });
    case "give": {
      const step = raw.type && isIn<GiveStep>(GIVE_STEPS[raw.type], raw.step) ? raw.step : undefined;
      return strip({
        action: "give",
        type: raw.type,
        designation: raw.designation,
        step,
        // A payment reference only means something on the thank-you step.
        ref: step === "done" ? raw.ref : undefined,
      });
    }
    default:
      // No action plus an event = event details (02 §3).
      return raw.event ? strip({ action: "event", event: raw.event, view: raw.view }) : null;
  }
}

function strip(state: HubState): HubState {
  return Object.fromEntries(Object.entries(state).filter(([, value]) => value !== undefined)) as HubState;
}

/** The Hub's own query entries for a state, in a stable order (`action` first). */
export function hubEntries(state: HubState): [HubKey, string][] {
  const { action, ...rest } = state as HubState & Record<string, string | undefined>;
  const entries: [HubKey, string][] = action === "event" ? [] : [["action", action]];
  for (const key of HUB_KEYS) {
    if (key === "action") continue;
    const value = (rest as Record<string, string | undefined>)[key];
    if (value) entries.push([key, value]);
  }
  return entries;
}

/**
 * A query string for `state`, keeping every non-Hub parameter of `current`
 * (UTMs, gclid, a page's own filters). Pass null to close the Hub.
 * Returns "" or "?a=b".
 */
export function hubSearch(state: HubState | null, current: SearchInput = ""): string {
  const params = new URLSearchParams();
  if (state) for (const [key, value] of hubEntries(state)) params.set(key, value);
  for (const [key, value] of toParams(current)) {
    if (!(HUB_KEYS as readonly string[]).includes(key)) params.append(key, value);
  }
  const search = params.toString();
  return search ? `?${search}` : "";
}

/** The Hub state as a `{ query }` object for the locale-aware Link (no current params: safe to render on the server). */
export function hubQuery(state: HubState): Record<string, string> {
  return Object.fromEntries(hubEntries(state));
}

/**
 * Deep-link normalization (spec §9.3): a link to a later step without the
 * data it needs opens the first step that isn't complete. `isComplete`
 * says whether a step's data is in hand (from the draft or the URL).
 */
export function firstIncompleteStep<S extends string>(steps: readonly S[], requested: S | undefined, isComplete: (step: S) => boolean): S {
  const target = requested ?? steps[0];
  for (const step of steps) {
    if (step === target) return step;
    if (!isComplete(step)) return step;
  }
  return steps[0];
}

/** Which side event details open on (spec §9.4): `view` wins, then where the person came from, then volunteer. */
export function eventSide(options: { view?: EventView; from?: "help" | "volunteer"; hasGuest: boolean; hasVolunteer: boolean }): EventView {
  const { view, from, hasGuest, hasVolunteer } = options;
  if (!hasGuest) return "volunteer";
  if (!hasVolunteer) return "guest";
  if (view) return view;
  if (from === "help") return "guest";
  return "volunteer";
}

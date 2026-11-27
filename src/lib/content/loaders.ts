import "server-only";
import { FALLBACK_PROGRAMS, PROGRAM_KEYS, type ProgramContent, type ProgramKey } from "@/content/programs";
import { FALLBACK_IMPACT, type ImpactStat } from "@/content/site";
import type { PublicEvent } from "@/lib/db/public-events";
import { IMAGE_PROJECTION, sanityAssetUrl, toContentImage, type ContentImage } from "./image";
import { paragraphs, text } from "./localized";
import { fetchContent, sanityConfig } from "./sanity";

/*
 * Typed content for pages (Phase 3). Each loader reads Sanity in either
 * shape (today's `production` or v2) and falls back to built-in content where
 * a v2 type doesn't exist yet, so pages always render real copy.
 */

type RawProgram = {
  key: ProgramKey;
  name: unknown;
  summary: unknown;
  about: unknown;
  audience: unknown;
  schedule: unknown;
  heroImage: Parameters<typeof toContentImage>[0];
  gallery: Parameters<typeof toContentImage>[0][] | null;
  participantNeed: ProgramContent["participantNeed"];
};

export async function getPrograms(locale = "en"): Promise<ProgramContent[]> {
  const raw = await fetchContent<RawProgram[]>(
    `*[_type == "program" && defined(key)] | order(order asc) { key, name, summary, about, audience, schedule, participantNeed, "heroImage": heroImage ${IMAGE_PROJECTION}, "gallery": gallery[] ${IMAGE_PROJECTION} }`,
  );
  const fromSanity = new Map(
    (raw ?? []).map((p) => {
      const fallback = FALLBACK_PROGRAMS.find((f) => f.key === p.key)!;
      const image = toContentImage(p.heroImage, locale);
      const program: ProgramContent = {
        key: p.key,
        name: text(p.name, locale) ?? fallback.name,
        summary: text(p.summary, locale) ?? fallback.summary,
        about: paragraphs(p.about, locale).length ? paragraphs(p.about, locale) : fallback.about,
        audience: text(p.audience, locale) ?? fallback.audience,
        schedule: text(p.schedule, locale) ?? fallback.schedule,
        image: image ?? fallback.image,
        gallery: (p.gallery ?? []).map((g) => toContentImage(g, locale)).filter((g): g is ContentImage => g !== null),
        participantNeed: p.participantNeed ?? fallback.participantNeed,
      };
      if (program.gallery.length === 0) program.gallery = fallback.gallery;
      return [p.key, program] as const;
    }),
  );
  return PROGRAM_KEYS.map((key) => fromSanity.get(key) ?? FALLBACK_PROGRAMS.find((p) => p.key === key)!);
}

export async function getProgram(key: ProgramKey, locale = "en"): Promise<ProgramContent> {
  return (await getPrograms(locale)).find((p) => p.key === key)!;
}

type RawStat = { value: number; suffix?: string; label: unknown; asOf?: string };

export async function getImpactStats(locale = "en"): Promise<ImpactStat[]> {
  const raw = await fetchContent<{ impactStats?: RawStat[] } | null>(`*[_type == "siteSettings"][0]{ impactStats }`);
  const stats = (raw?.impactStats ?? [])
    .map((s) => ({ value: s.value, suffix: s.suffix ?? "", label: text(s.label, locale) ?? "", asOf: s.asOf ?? null }))
    .filter((s) => s.label);
  return stats.length ? stats : [...FALLBACK_IMPACT];
}

export type Story = { title: string; date: string | null; summary: string | null; url: string; image: ContentImage | null };

type RawStory = { title: unknown; date?: string; summary: unknown; url?: string; image: Parameters<typeof toContentImage>[0] };

/** Stories and updates, newest first. */
export async function getStories(limit = 12, locale = "en"): Promise<Story[]> {
  const raw = await fetchContent<RawStory[]>(
    `*[_type == "publication" && defined(url)] | order(date desc) [0...$limit] { title, date, summary, url, "image": image ${IMAGE_PROJECTION} }`,
    { limit },
  );
  return (raw ?? [])
    .map((s) => ({ title: text(s.title, locale) ?? "", date: s.date ?? null, summary: text(s.summary, locale), url: s.url!, image: toContentImage(s.image, locale) }))
    .filter((s) => s.title && /^https?:\/\//.test(s.url));
}

const DEFAULT_EVENT_IMAGE: ContentImage = { src: "/v2/core/TSOH-Group.webp", alt: "", width: 1200, height: 800 };

/**
 * An event's card and hero image: its Sanity asset when consent is
 * confirmed, else its program's photo, else a general one. Fallback photos
 * are decorative here, since the event title names the card.
 */
export function eventImage(event: PublicEvent): ContentImage {
  const asset = event.image as { asset?: string; alt?: string | null; consentCleared?: boolean } | null;
  const config = sanityConfig();
  if (asset?.asset && asset.consentCleared !== false && config) {
    const built = sanityAssetUrl(asset.asset, config.projectId, config.dataset);
    if (built) return { ...built, alt: asset.alt ?? "" };
  }
  const program = FALLBACK_PROGRAMS.find((p) => p.key === event.programKey);
  return program ? { ...program.image, alt: "" } : DEFAULT_EVENT_IMAGE;
}

export type RecurringProgram = { id: string; title: string; cadence: string | null; location: string | null; summary: string | null; image: ContentImage | null };

type RawRecurring = { _id: string; title: unknown; cadence?: unknown; location?: string; summary: unknown; image: Parameters<typeof toContentImage>[0] };

/**
 * "Every month" on the Events page. v2 `recurringProgram` documents when
 * they exist. Today's `recurringEvent` documents are monthly copies of the
 * same program, so only the newest one stands in until editors create them.
 */
export async function getRecurringPrograms(locale = "en"): Promise<RecurringProgram[]> {
  const projection = `{ _id, title, cadence, location, summary, "image": image ${IMAGE_PROJECTION} }`;
  const v2 = await fetchContent<RawRecurring[]>(`*[_type == "recurringProgram"] | order(coalesce(order, 99) asc, internalName asc) [0...8] ${projection}`);
  const raw = v2?.length ? v2 : await fetchContent<RawRecurring[]>(`*[_type == "recurringEvent"] | order(date desc) [0...1] ${projection}`);
  return (raw ?? [])
    .map((r) => ({ id: r._id, title: text(r.title, locale) ?? "", cadence: text(r.cadence, locale), location: r.location ?? null, summary: text(r.summary, locale), image: toContentImage(r.image, locale) }))
    .filter((r) => r.title);
}

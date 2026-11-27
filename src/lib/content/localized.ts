/**
 * Read Sanity text in either shape: today's plain strings and Portable Text
 * (`production`), or the v2 field-level localized arrays (ADR-0004). Pages
 * never care which dataset they're reading. English is the fallback.
 */

type LocalizedItem = { _key?: string; language?: string; value?: unknown };
type Block = { _type?: string; children?: { text?: string }[] };

const isLocalizedArray = (value: unknown): value is LocalizedItem[] =>
  Array.isArray(value) && value.length > 0 && value.every((v) => v && typeof v === "object" && "value" in v && ("language" in v || "_key" in v));

function pick(value: LocalizedItem[], locale: string): unknown {
  const lang = (item: LocalizedItem) => item.language ?? item._key;
  const short = locale.slice(0, 2);
  return (value.find((v) => lang(v) === short) ?? value.find((v) => lang(v) === "en"))?.value;
}

/** Portable Text → paragraphs of plain text. */
export function blocksToParagraphs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return (value as Block[])
    .filter((b) => b?._type === "block")
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join("").trim())
    .filter(Boolean);
}

/** A single line or field of text, or null. */
export function text(value: unknown, locale = "en"): string | null {
  const raw = isLocalizedArray(value) ? pick(value, locale) : value;
  if (typeof raw === "string") return raw.trim() || null;
  if (Array.isArray(raw)) return blocksToParagraphs(raw).join("\n\n") || null;
  return null;
}

/** Long text as paragraphs, from plain text (blank-line separated) or Portable Text. */
export function paragraphs(value: unknown, locale = "en"): string[] {
  const raw = isLocalizedArray(value) ? pick(value, locale) : value;
  if (typeof raw === "string") return raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return blocksToParagraphs(raw);
}

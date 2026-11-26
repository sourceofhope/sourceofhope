// Pure transforms for the v2 content migration (slice 2.6). No I/O here, so
// every rule is unit-tested (transforms.test.ts) and reruns are deterministic.

/** System fields that differ between datasets and never count as a change. */
const SYSTEM_FIELDS = new Set(["_rev", "_createdAt", "_updatedAt"]);

/** A localized array with only English (ADR-0004). Stable `_key`, so reruns produce identical documents. */
export function localized(value, kind = "String") {
  if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) return undefined;
  return [{ _key: "en", _type: `internationalizedArray${kind}Value`, language: "en", value }];
}

/** Plain text to Portable Text: one block per paragraph (blank-line separated). */
export function toBlocks(text) {
  if (!text || !text.trim()) return undefined;
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((paragraph, i) => ({
      _key: `p${i}`,
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [{ _key: `p${i}s0`, _type: "span", marks: [], text: paragraph.replace(/\s*\n\s*/g, " ") }],
    }));
}

/**
 * A legacy `image { asset, alt }` as a v2 `accessibleImage`. Consent was
 * never recorded, so it starts unconfirmed: editors confirm each photo
 * before publishing (the photo audit).
 */
export function toAccessibleImage(image) {
  if (!image?.asset?._ref) return undefined;
  const out = { _type: "accessibleImage", asset: { _type: "reference", _ref: image.asset._ref }, decorative: false, consentCleared: false };
  if (image.hotspot) out.hotspot = image.hotspot;
  if (image.crop) out.crop = image.crop;
  const alt = localized(image.alt);
  if (alt) out.alt = alt;
  return out;
}

export function slugify(text) {
  return String(text)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

const slug = (current) => (current ? { _type: "slug", current } : undefined);

/** Drop undefined fields so documents compare cleanly. */
function compact(doc) {
  return Object.fromEntries(Object.entries(doc).filter(([, v]) => v !== undefined));
}

/** Legacy document → v2 document, by type. Keeps `_id`, so reruns replace rather than duplicate. */
export const TRANSFORMS = {
  teamGroup: (d) =>
    compact({ _id: d._id, _type: "teamGroup", internalName: d.name, slug: slug(d.slug?.current ?? slugify(d.name)), name: localized(d.name), description: localized(d.description, "Text") }),
  teamMember: (d) =>
    compact({
      _id: d._id,
      _type: "teamMember",
      name: d.name,
      slug: slug(d.slug?.current ?? slugify(d.name)),
      teamGroup: d.teamGroup?._ref ? { _type: "reference", _ref: d.teamGroup._ref } : undefined,
      title: localized(d.title),
      shortBio: localized(d.shortBio, "Text"),
      bio: localized(toBlocks(d.bio), "PortableText"),
      image: toAccessibleImage(d.image),
    }),
  publication: (d) =>
    compact({
      _id: d._id,
      _type: "publication",
      title: localized(d.title),
      date: d.date ? String(d.date).slice(0, 10) : undefined,
      summary: localized(d.summary, "Text"),
      url: d.url,
      image: toAccessibleImage(d.image),
      legacyId: d.externalId,
    }),
  newsletter: (d) =>
    compact({ _id: d._id, _type: "newsletter", title: localized(d.title), date: d.date ? String(d.date).slice(0, 10) : undefined, url: d.url, image: toAccessibleImage(d.image), legacyId: d.externalId }),
  product: (d) =>
    compact({
      _id: d._id,
      _type: "product",
      internalName: d.title,
      slug: slug(d.slug?.current ?? slugify(d.title)),
      title: localized(d.title),
      price: d.price,
      shortDescription: localized(d.shortDescription, "Text"),
      longDescription: localized(toBlocks(d.longDescription), "PortableText"),
      impact: localized(d.impact, "Text"),
      sizes: d.size ? String(d.size).split(/[,/]/).map((s) => s.trim()).filter(Boolean) : undefined,
      images: d.image ? [{ _key: "i0", ...toAccessibleImage(d.image) }].filter((i) => i.asset) : undefined,
      legacyId: d.externalId,
    }),
  recurringEvent: (d) =>
    compact({
      _id: d._id,
      _type: "recurringProgram",
      internalName: d.title,
      title: localized(d.title),
      cadence: undefined, // Legacy data has one date, not a cadence: a content task.
      location: d.location,
      summary: localized(d.summary, "Text"),
      image: toAccessibleImage(d.image),
    }),
  checkoutProvider: (d) =>
    compact({ _id: d._id, _type: "checkoutProvider", providerId: d.providerId, enabled: d.enabled ?? true, name: localized(d.name), description: localized(d.description) }),
};

/** Remove system fields for comparison. */
export function comparable(doc) {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(doc).filter(([k]) => !SYSTEM_FIELDS.has(k)))));
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
  return JSON.stringify(value);
}

/** create | update | unchanged, for the diff report. */
export function diffAction(next, existing) {
  if (!existing) return "create";
  return stableStringify(comparable(next)) === stableStringify(comparable(existing)) ? "unchanged" : "update";
}

/** Fields the Studio requires that the migration can't fill: listed in the report as content tasks. */
export function contentGaps(doc) {
  const gaps = [];
  const walkImage = (img, where) => {
    if (!img?.asset) return;
    if (!img.consentCleared) gaps.push(`${where}: confirm photo consent`);
    if (!img.decorative && !img.alt) gaps.push(`${where}: add alt text`);
  };
  if (doc._type === "recurringProgram" && !doc.cadence) gaps.push("cadence: write when it repeats");
  if (doc._type === "teamMember" && !doc.title) gaps.push("title: add per the glossary");
  if (doc.image) walkImage(doc.image, "image");
  for (const [i, img] of (doc.images ?? []).entries()) walkImage(img, `images[${i}]`);
  if (doc.heroImage) walkImage(doc.heroImage, "heroImage");
  return gaps;
}

/**
 * A legacy Sanity event as a Postgres event (02 §4). Migrated events are
 * drafts: legacy data has no end time, audience or shifts, so staff review
 * each one in the portal before publishing. Returns the row, its English
 * text and what to review.
 */
export function toEventRow(d) {
  const startsAt = new Date(d.date);
  const day = startsAt.toISOString().slice(0, 10);
  const review = ["end time assumed 2 hours", "set guest and volunteer sides, shifts and agreements"];
  const url = d.eventPage?.url ?? d.url ?? null;
  const external = url && !/thesourceofhope\.org/.test(url) ? url : null;
  if (external) review.push(`event page links elsewhere (${new URL(external).hostname}): partner event?`);
  if (!d.image?.asset?._ref) review.push("add a hero image");
  return {
    row: {
      // "Hope Run for Hunger 2027" on 2027-04-03 → hope-run-for-hunger-2027-04-03, not …-2027-2027-04-03.
      slug: `${slugify(d.title).replace(new RegExp(`-${day.slice(0, 4)}$`), "")}-${day}`,
      status: "draft",
      ownership: "tsoh",
      starts_at: startsAt.toISOString(),
      ends_at: new Date(startsAt.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      timezone: "America/Chicago",
      venue_name: d.location ?? null,
      hero_image_asset: d.image?.asset?._ref ? { asset: d.image.asset._ref, alt: d.image.alt ?? null, consentCleared: false } : null,
    },
    text: { locale: "en", title: d.title, summary: d.summary ?? null },
    review,
    sourceId: d._id,
  };
}

/** Singletons and program shells seeded from the glossary (spec §13.3). Editors write the copy. */
export const PROGRAM_SEEDS = [
  { key: "servingHope", name: "Serving and Sharing Hope", order: 1 },
  { key: "educationHope", name: "Education for Hope", order: 2 },
  { key: "wellnessHope", name: "Wellness of Hope", order: 3 },
  { key: "outdoorHope", name: "Hope for the Outdoors", order: 4 },
  { key: "internationalHope", name: "Hope Beyond Borders", order: 5 },
];

export function seedDocuments({ phone, email, address }) {
  const programs = PROGRAM_SEEDS.map((p) => ({ _id: `program-${p.key}`, _type: "program", key: p.key, name: localized(p.name), order: p.order }));
  const glossary = [
    { thing: "Organization", official: "The Source of Hope (TSOH after first use)" },
    ...PROGRAM_SEEDS.map((p) => ({ thing: `Program (${p.key})`, official: p.name })),
    { thing: "Retired program names", official: "(do not use)", avoid: ["International Partner Serving", "Hope For The Great Outdoors"] },
    { thing: "Phone", official: phone },
    { thing: "Hub actions", official: "Get Help · Volunteer · Give" },
    { thing: "Giving products", official: "One-time gift · Monthly giving · Planned giving · Community Sponsors" },
  ].map((t, i) => ({ _key: `g${i}`, _type: "term", ...t }));
  return [
    { _id: "siteSettings", _type: "siteSettings", phone, email, address, glossary },
    ...programs,
  ];
}

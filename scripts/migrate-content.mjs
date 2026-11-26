// Content migration for the relaunch (slice 2.6). Dry-run by default: it
// reads, transforms, compares with the target and writes a diff report.
// Add --write to apply. Every command is idempotent: a second run reports
// everything "unchanged".
//
//   node scripts/migrate-content.mjs sanity [--target staging] [--write]
//       production documents → v2 shape in the target dataset
//   node scripts/migrate-content.mjs seed   [--target staging] [--write]
//       siteSettings and the five program documents (glossary names)
//   node --env-file=.env.development.local scripts/migrate-content.mjs events [--write]
//       upcoming Sanity events → Postgres, as drafts for staff review
//
// Reads from production with the public API (or SANITY_API_READ_TOKEN).
// Writing to Sanity needs SANITY_API_WRITE_TOKEN; writing events needs
// NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. Reports go to
// migration-reports/ (git-ignored).
import { mkdirSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { createClient as createSanity } from "@sanity/client";
import { createClient as createSupabase } from "@supabase/supabase-js";
import { contentGaps, diffAction, seedDocuments, toEventRow, TRANSFORMS } from "./migrate/transforms.mjs";

const PROJECT_ID = "sgzdqn9z";
const API_VERSION = "2026-04-10";
const ALLOWED_TARGETS = ["staging", "production-v2"];

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: { target: { type: "string", default: "staging" }, write: { type: "boolean", default: false } },
});
const command = positionals[0];
if (!["sanity", "seed", "events"].includes(command)) {
  console.error("Usage: node scripts/migrate-content.mjs <sanity|seed|events> [--target staging|production-v2] [--write]");
  process.exit(1);
}
if (command !== "events" && !ALLOWED_TARGETS.includes(values.target)) {
  console.error(`--target must be one of ${ALLOWED_TARGETS.join(", ")} (never production)`);
  process.exit(1);
}

const source = createSanity({ projectId: PROJECT_ID, dataset: "production", apiVersion: API_VERSION, useCdn: false, token: process.env.SANITY_API_READ_TOKEN, perspective: "published" });
const target = () => {
  if (values.write && !process.env.SANITY_API_WRITE_TOKEN) {
    console.error("--write needs SANITY_API_WRITE_TOKEN");
    process.exit(1);
  }
  return createSanity({ projectId: PROJECT_ID, dataset: values.target, apiVersion: API_VERSION, useCdn: false, token: process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_READ_TOKEN, perspective: "raw" });
};

const report = { command, target: command === "events" ? "postgres" : values.target, write: values.write, at: new Date().toISOString(), counts: { create: 0, update: 0, unchanged: 0 }, items: [] };
const record = (item) => {
  report.counts[item.action] += 1;
  report.items.push(item);
};

async function migrateSanity(docs) {
  const dest = target();
  const existing = new Map();
  try {
    for (const doc of await dest.fetch("*[_id in $ids]", { ids: docs.map((d) => d._id) })) existing.set(doc._id, doc);
  } catch (error) {
    if (values.write) throw error;
    report.note = `Target dataset not readable (${error.message.split("\n")[0]}); every document reported as create.`;
  }
  const tx = dest.transaction();
  for (const doc of docs) {
    const action = diffAction(doc, existing.get(doc._id));
    record({ id: doc._id, type: doc._type, action, contentTasks: contentGaps(doc) });
    if (action !== "unchanged") tx.createOrReplace(doc);
  }
  if (values.write && report.counts.create + report.counts.update > 0) await tx.commit({ visibility: "async" });
}

if (command === "sanity") {
  const legacy = await source.fetch(`*[_type in $types && !(_id in path("drafts.**"))]`, { types: Object.keys(TRANSFORMS) });
  await migrateSanity(legacy.map((d) => TRANSFORMS[d._type](d)));
}

if (command === "seed") {
  await migrateSanity(seedDocuments({ phone: "(469) 969-0244", email: "info@thesourceofhope.org", address: "1108 W Parker Rd, Ste 102\nPlano, TX 75075" }));
  report.contentTasks = ["Write each program's summary, What it is, hero image and gallery", "Fill Our Story, Planned giving and Sponsor tiers", "Add impact numbers with as-of dates and the meals-per-dollar ratio"];
}

if (command === "events") {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("events needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const db = createSupabase(url, key, { auth: { persistSession: false } });
  const legacy = await source.fetch(`*[_type in ["featuredEvent", "bannerEvent"] && dateTime(date) >= dateTime(now()) && !(_id in path("drafts.**"))] | order(date asc)`);
  for (const event of legacy.filter((e) => e.title && e.date)) {
    const { row, text, review, sourceId } = toEventRow(event);
    const { data: current } = await db.from("events").select("id, status, starts_at, venue_name, event_texts (locale, title, summary)").eq("slug", row.slug).maybeSingle();
    // Staff own an event once they've touched it: only untouched drafts are ever updated.
    if (current && current.status !== "draft") {
      record({ id: sourceId, slug: row.slug, action: "unchanged", review: ["already reviewed in the portal; left as is"] });
      continue;
    }
    const en = current?.event_texts?.find((t) => t.locale === "en");
    const same = current && new Date(current.starts_at).getTime() === new Date(row.starts_at).getTime() && current.venue_name === row.venue_name && en?.title === text.title && en?.summary === text.summary;
    const action = !current ? "create" : same ? "unchanged" : "update";
    record({ id: sourceId, slug: row.slug, action, review });
    if (!values.write || action === "unchanged") continue;
    const { data: saved, error } = await db.from("events").upsert(row, { onConflict: "slug" }).select("id").single();
    if (error) throw new Error(`event ${row.slug}: ${error.message}`);
    const { error: textError } = await db.from("event_texts").upsert({ event_id: saved.id, ...text }, { onConflict: "event_id,locale" });
    if (textError) throw new Error(`event text ${row.slug}: ${textError.message}`);
  }
}

mkdirSync("migration-reports", { recursive: true });
const file = `migration-reports/${command}-${report.at.replace(/[:.]/g, "-")}.json`;
writeFileSync(file, JSON.stringify(report, null, 2));
console.log(`${values.write ? "Applied" : "Dry run"} (${command} → ${report.target}): ${report.counts.create} create, ${report.counts.update} update, ${report.counts.unchanged} unchanged.`);
if (report.note) console.log(report.note);
console.log(`Report: ${file}`);

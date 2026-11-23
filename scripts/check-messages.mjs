// CI check for message files (ADR-0004):
//  - every committed locale file has exactly the keys of messages/en-US.json
//  - no message is empty
//  - every message parses as ICU, with the same placeholder names as English
// Run: npm run i18n:check
import { readdirSync, readFileSync } from "node:fs";
import { parse, TYPE } from "@formatjs/icu-messageformat-parser";

const GENERATED = new Set(["en-XA.json"]);
const flatten = (tree, prefix = "") =>
  Object.entries(tree).flatMap(([k, v]) =>
    typeof v === "string" ? [[`${prefix}${k}`, v]] : flatten(v, `${prefix}${k}.`),
  );

function argNames(message) {
  const names = new Set();
  const walk = (nodes) => {
    for (const n of nodes) {
      if (n.type !== TYPE.literal && n.type !== TYPE.pound && n.value && typeof n.value === "string") names.add(n.value);
      if (n.options) for (const o of Object.values(n.options)) walk(o.value);
      if (n.children) walk(n.children);
    }
  };
  walk(parse(message));
  return [...names].sort().join(",");
}

const problems = [];
const load = (file) => new Map(flatten(JSON.parse(readFileSync(`messages/${file}`, "utf8"))));
const source = load("en-US.json");

for (const [key, msg] of source) {
  if (!msg.trim()) problems.push(`en-US: "${key}" is empty`);
  try {
    argNames(msg);
  } catch (e) {
    problems.push(`en-US: "${key}" is not valid ICU (${e.message})`);
  }
}

for (const file of readdirSync("messages").filter((f) => f.endsWith(".json") && f !== "en-US.json" && !GENERATED.has(f))) {
  const target = load(file);
  for (const key of source.keys()) if (!target.has(key)) problems.push(`${file}: missing "${key}"`);
  for (const key of target.keys()) if (!source.has(key)) problems.push(`${file}: extra "${key}" (not in en-US)`);
  for (const [key, msg] of target) {
    if (!source.has(key)) continue;
    if (!msg.trim()) problems.push(`${file}: "${key}" is empty`);
    try {
      if (argNames(msg) !== argNames(source.get(key))) problems.push(`${file}: "${key}" placeholders differ from en-US`);
    } catch (e) {
      problems.push(`${file}: "${key}" is not valid ICU (${e.message})`);
    }
  }
}

if (problems.length) {
  console.error(`Message check failed:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`Messages OK (${source.size} keys).`);

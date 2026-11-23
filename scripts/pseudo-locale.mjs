// Generate messages/en-XA.json (pseudo-locale) from messages/en-US.json.
// Literal text is accented, padded about 40% and bracketed, so hard-coded
// strings (unbracketed) and overflow are easy to spot. ICU placeholders,
// plural and select keywords and argument names are never touched: we
// transform the parsed syntax tree, then print it back.
//
// The output is generated (git-ignored). Run: npm run i18n:pseudo
import { readFileSync, writeFileSync } from "node:fs";
import { parse, TYPE } from "@formatjs/icu-messageformat-parser";
import { printAST } from "@formatjs/icu-messageformat-parser/printer.js";

const ACCENTS = { a: "á", e: "é", i: "í", o: "ó", u: "ú", A: "Á", E: "É", I: "Í", O: "Ó", U: "Ú", n: "ñ", c: "ç", y: "ý" };
const accent = (s) => s.replace(/[aeiouAEIOUncy]/g, (ch) => ACCENTS[ch]);
const pad = (s) => s + "·".repeat(Math.ceil(s.trim().length * 0.4));

function walk(nodes) {
  for (const node of nodes) {
    if (node.type === TYPE.literal) node.value = pad(accent(node.value));
    if (node.type === TYPE.plural || node.type === TYPE.select) {
      for (const option of Object.values(node.options)) walk(option.value);
    }
    if (node.type === TYPE.tag) walk(node.children);
  }
  return nodes;
}

const pseudo = (message) => `⟦${printAST(walk(parse(message)))}⟧`;
const mapTree = (tree) =>
  Object.fromEntries(Object.entries(tree).map(([k, v]) => [k, typeof v === "string" ? pseudo(v) : mapTree(v)]));

const source = JSON.parse(readFileSync("messages/en-US.json", "utf8"));
writeFileSync("messages/en-XA.json", JSON.stringify(mapTree(source), null, 2) + "\n");
console.log("Wrote messages/en-XA.json");

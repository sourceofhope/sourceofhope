import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contrast, readColorTokens, REQUIRED_PAIRS } from "./contrast";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
const tokens = readColorTokens(css);

describe("contrast helpers", () => {
  it("matches known WCAG values", () => {
    expect(contrast("#ffffff", "#000000")).toBeCloseTo(21, 5);
    expect(contrast("#ffffff", "#1b75bc")).toBeCloseTo(4.86, 1);
  });

  it("resolves var() references to hex", () => {
    expect(tokens["surface"]).toBe("#ffffff");
    expect(tokens["action"]).toBe("#1b75bc");
  });
});

describe("design token contrast (spec §5.1)", () => {
  for (const pair of REQUIRED_PAIRS) {
    it(`${pair.use}: ${pair.fg} on ${pair.bg} ≥ ${pair.min}:1`, () => {
      const fg = tokens[pair.fg];
      const bg = tokens[pair.bg];
      expect(fg, `token --color-${pair.fg} missing`).toBeDefined();
      expect(bg, `token --color-${pair.bg} missing`).toBeDefined();
      expect(contrast(fg, bg)).toBeGreaterThanOrEqual(pair.min);
    });
  }
});

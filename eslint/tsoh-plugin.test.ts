import { RuleTester } from "eslint";
import { describe, expect, it } from "vitest";
import plugin, { baseClass, checkClass } from "./tsoh-plugin.mjs";

describe("baseClass", () => {
  it("strips variants, importance and negation", () => {
    expect(baseClass("md:hover:bg-surface")).toBe("bg-surface");
    expect(baseClass("data-open:text-ink")).toBe("text-ink");
    expect(baseClass("[&>svg]:size-5")).toBe("size-5");
    expect(baseClass("!mt-4")).toBe("mt-4");
    expect(baseClass("-mt-2")).toBe("mt-2");
  });
});

describe("checkClass", () => {
  it.each([
    "bg-surface", "text-ink", "text-muted", "border-input", "bg-action", "hover:bg-action-hover",
    "rounded-md", "rounded-lg", "rounded-full", "shadow-overlay", "max-w-page", "py-section",
    "focus-visible:ring-focus", "text-5xl", "font-heading", "duration-(--duration-base)", "z-(--z-header)",
    "bg-tone-public", "text-tone-public-ink", "data-selected:bg-action", "motion-reduce:transition-none",
  ])("allows %s", (cls) => {
    expect(checkClass(cls)).toBeNull();
  });

  it.each([
    ["bg-red-500", "default palette"],
    ["text-white", "default palette"],
    ["hover:border-gray-300", "default palette"],
    ["bg-primary-700", "raw scale step"],
    ["text-accent-500/80", "raw scale step"],
    ["rounded-2xl", "not an approved radius"],
    ["rounded-t-xl", "not an approved radius"],
    ["w-[37px]", "arbitrary value"],
    ["text-[#1b75bc]", "arbitrary value"],
    ["text-xlg", "deprecated"],
    ["font-urbanist", "deprecated"],
    ["px-35", "deprecated"],
  ])("rejects %s (%s)", (cls, reason) => {
    expect(checkClass(cls)).toContain(reason);
  });

  it("allows raw scale steps when the file opts in (styleguide)", () => {
    expect(checkClass("border-primary-700", { allowScales: true })).toBeNull();
  });
});

describe("tsoh/design-tokens rule", () => {
  const tester = new RuleTester({
    languageOptions: { ecmaVersion: 2022, sourceType: "module", parserOptions: { ecmaFeatures: { jsx: true } } },
  });

  it("passes the RuleTester suite", () => {
    tester.run("design-tokens", plugin.rules["design-tokens"], {
      valid: [
        { code: `const x = <div className="bg-surface text-ink rounded-md" />;` },
        { code: `const recipe = { base: "inline-flex min-h-11 rounded-md bg-action text-on-inverse" };` },
        { code: `const s = "Serving and Sharing Hope";` },
        { code: `const u = "/events";` },
        { code: "const t = `px-4 ${a} md:px-8`;" },
      ],
      invalid: [
        { code: `const x = <div className="bg-red-500 p-4" />;`, errors: 1 },
        { code: `const r = { base: "rounded-2xl text-xlg" };`, errors: 2 },
        { code: "const t = `w-[37px] ${a}`;", errors: 1 },
      ],
    });
  });
});

import { describe, expect, it } from "vitest";
import { sanityAssetUrl, toContentImage } from "./image";
import { paragraphs, text } from "./localized";

const localized = (value: unknown, language = "en") => [{ _key: language, _type: "internationalizedArrayStringValue", language, value }];

describe("content text", () => {
  it("reads plain strings and localized arrays alike", () => {
    expect(text("Board chair")).toBe("Board chair");
    expect(text(localized("Board chair"))).toBe("Board chair");
    expect(text([...localized("Presidenta", "es"), ...localized("President")], "es-US")).toBe("Presidenta");
    expect(text(localized("President"), "es-US")).toBe("President");
    expect(text("  ")).toBeNull();
    expect(text(undefined)).toBeNull();
  });

  it("reads paragraphs from plain text or Portable Text", () => {
    expect(paragraphs("One.\n\nTwo.")).toEqual(["One.", "Two."]);
    const blocks = [{ _type: "block", children: [{ text: "Hello " }, { text: "world." }] }];
    expect(paragraphs(blocks)).toEqual(["Hello world."]);
    expect(paragraphs(localized(blocks))).toEqual(["Hello world."]);
  });
});

describe("content images", () => {
  it("keeps today's images, and hides v2 images without confirmed consent", () => {
    const base = { src: "https://cdn.sanity.io/x.webp", width: 800, height: 600 };
    expect(toContentImage({ ...base, alt: "Volunteers" })).toEqual({ ...base, alt: "Volunteers" });
    expect(toContentImage({ ...base, alt: localized("Volunteers"), consentCleared: false })).toBeNull();
    expect(toContentImage({ ...base, alt: localized("x"), decorative: true, consentCleared: true })).toEqual({ ...base, alt: "" });
    expect(toContentImage(null)).toBeNull();
  });

  it("builds CDN URLs from asset ids", () => {
    expect(sanityAssetUrl("image-abc123-800x600-webp", "p1", "staging")).toEqual({
      src: "https://cdn.sanity.io/images/p1/staging/abc123-800x600.webp",
      width: 800,
      height: 600,
    });
    expect(sanityAssetUrl("file-abc", "p1", "x")).toBeNull();
  });
});

describe("team group order", () => {
  it("puts leadership first, then cohorts newest first", async () => {
    const { sortTeamGroups } = await import("./loaders");
    const names = ["EPP Spring 2025", "Chief of Staff", "EPP Summer 2026", "Director Board", "EPP Spring 2026", "EPP Fall 2024", "Intern Summer 2026"];
    expect(sortTeamGroups(names.map((name) => ({ name }))).map((g) => g.name)).toEqual([
      "Chief of Staff",
      "Director Board",
      "EPP Summer 2026",
      "Intern Summer 2026",
      "EPP Spring 2026",
      "EPP Spring 2025",
      "EPP Fall 2024",
    ]);
  });
});

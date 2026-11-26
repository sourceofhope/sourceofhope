import { describe, expect, it } from "vitest";
import { contentGaps, diffAction, localized, seedDocuments, slugify, toAccessibleImage, toBlocks, toEventRow, TRANSFORMS } from "./transforms.mjs";

describe("v2 content transforms", () => {
  it("wraps values in the localized array shape with a stable key", () => {
    expect(localized("Team")).toEqual([{ _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: "Team" }]);
    expect(localized("  ")).toBeUndefined();
    expect(localized(null)).toBeUndefined();
  });

  it("turns paragraphs into Portable Text blocks", () => {
    const blocks = toBlocks("First line\ncontinues.\n\nSecond paragraph.");
    expect(blocks).toHaveLength(2);
    expect(blocks![0].children[0].text).toBe("First line continues.");
    expect(toBlocks("")).toBeUndefined();
  });

  it("images keep alt text and start with consent unconfirmed", () => {
    expect(toAccessibleImage({ asset: { _ref: "image-abc" }, alt: "Volunteers serving" })).toEqual({
      _type: "accessibleImage",
      asset: { _type: "reference", _ref: "image-abc" },
      decorative: false,
      consentCleared: false,
      alt: localized("Volunteers serving"),
    });
    expect(toAccessibleImage(undefined)).toBeUndefined();
  });

  it("maps a team member and keeps its id, so reruns replace", () => {
    const out = TRANSFORMS.teamMember({
      _id: "abc",
      _type: "teamMember",
      name: "Ana Diaz",
      title: "Board chair",
      bio: "One.\n\nTwo.",
      teamGroup: { _ref: "grp" },
      image: { asset: { _ref: "image-1" }, alt: "Ana" },
    });
    expect(out).toMatchObject({ _id: "abc", _type: "teamMember", slug: { current: "ana-diaz" }, teamGroup: { _ref: "grp" } });
    expect(out.bio[0].value).toHaveLength(2);
    expect(contentGaps(out)).toEqual(["image: confirm photo consent"]);
  });

  it("reports unchanged on a rerun, ignoring system fields", () => {
    const doc = TRANSFORMS.publication({ _id: "p1", title: "Story", date: "2026-05-01T12:00:00Z", url: "https://x.org" });
    expect(diffAction(doc, null)).toBe("create");
    expect(diffAction(doc, { ...doc, _rev: "r1", _updatedAt: "now" })).toBe("unchanged");
    expect(diffAction({ ...doc, url: "https://y.org" }, doc)).toBe("update");
  });

  it("slugs are URL-safe", () => {
    expect(slugify("Back to School Bash & Health Fair!")).toBe("back-to-school-bash-and-health-fair");
    expect(slugify("Niños en Acción")).toBe("ninos-en-accion");
  });

  it("legacy events become draft rows with a review list", () => {
    const { row, text, review } = toEventRow({
      _id: "e1",
      title: "Hope Run for Hunger",
      date: "2027-04-10T14:00:00Z",
      location: "Oak Point Park",
      summary: "5K",
      eventPage: { url: "https://runsignup.com/hope" },
    });
    expect(row).toMatchObject({ slug: "hope-run-for-hunger-2027-04-10", status: "draft", ends_at: "2027-04-10T16:00:00.000Z" });
    expect(text).toEqual({ locale: "en", title: "Hope Run for Hunger", summary: "5K" });
    expect(review.join(" ")).toMatch(/runsignup\.com/);
    expect(review).toContain("add a hero image");
    expect(toEventRow({ _id: "e2", title: "Hope Run for Hunger 2027", date: "2027-04-03T14:00:00Z" }).row.slug).toBe("hope-run-for-hunger-2027-04-03");
  });

  it("seeds settings and the five programs with glossary names", () => {
    const docs = seedDocuments({ phone: "(469) 969-0244", email: "info@thesourceofhope.org", address: "Plano" });
    expect(docs.map((d) => d._id)).toEqual(["siteSettings", "program-servingHope", "program-educationHope", "program-wellnessHope", "program-outdoorHope", "program-internationalHope"]);
    expect(docs[1]).toMatchObject({ key: "servingHope", name: [{ value: "Serving and Sharing Hope" }] });
  });
});

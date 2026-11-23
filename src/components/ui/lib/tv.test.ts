import { describe, expect, it } from "vitest";
import { tv } from "./tv";

describe("tv (shared variant helper)", () => {
  const box = tv({
    base: "rounded-md bg-surface p-4 shadow-raised",
    variants: { tone: { muted: "bg-surface-muted", inverse: "bg-surface-inverse text-on-inverse" } },
  });

  it("applies variants", () => {
    expect(box({ tone: "inverse" })).toContain("bg-surface-inverse");
  });

  it("merges our custom token names in the right groups", () => {
    const out = box({ tone: "muted", class: "shadow-overlay rounded-lg" });
    expect(out).toContain("shadow-overlay");
    expect(out).not.toContain("shadow-raised");
    expect(out).toContain("rounded-lg");
    expect(out).not.toContain("rounded-md");
    expect(out).toContain("bg-surface-muted");
    expect(out.split(" ")).not.toContain("bg-surface");
  });

  it("keeps text color and font size apart", () => {
    const text = tv({ base: "text-ink text-lg" });
    const out = text({ class: "text-muted" });
    expect(out).toContain("text-muted");
    expect(out).toContain("text-lg");
    expect(out).not.toContain("text-ink");
  });
});

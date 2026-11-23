import { describe, expect, it } from "vitest";
import { isStyleguideEnabled } from "./enabled";

describe("isStyleguideEnabled", () => {
  it("is off in Vercel production", () => {
    expect(isStyleguideEnabled({ VERCEL_ENV: "production" })).toBe(false);
  });
  it("is on for preview, development and local or CI builds", () => {
    expect(isStyleguideEnabled({ VERCEL_ENV: "preview" })).toBe(true);
    expect(isStyleguideEnabled({ VERCEL_ENV: "development" })).toBe(true);
    expect(isStyleguideEnabled({})).toBe(true);
  });
});

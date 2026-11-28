import { describe, expect, it } from "vitest";
import { attributionSchema, parseFirstTouch, readUtm } from "./attribution";

describe("readUtm", () => {
  it("reads the four UTM keys, lowercased", () => {
    expect(readUtm("?utm_source=Facebook&utm_medium=post&utm_campaign=serving_hope_2026_12&utm_content=a&gclid=x")).toEqual({
      utm_source: "facebook",
      utm_medium: "post",
      utm_campaign: "serving_hope_2026_12",
      utm_content: "a",
    });
  });
  it("drops values that aren't plain tokens", () => {
    expect(readUtm("?utm_source=<script>&utm_medium=" + "x".repeat(101))).toEqual({});
  });
});

describe("attributionSchema", () => {
  it("drops bad fields instead of failing", () => {
    expect(attributionSchema.parse({ utm_source: "print", landing_path: "not-a-path", utm_medium: 5 })).toEqual({ utm_source: "print" });
    expect(attributionSchema.parse("nonsense")).toEqual({});
  });
  it("keeps a landing path without its query", () => {
    expect(attributionSchema.parse({ landing_path: "/programs/serving-hope" })).toEqual({ landing_path: "/programs/serving-hope" });
    expect(attributionSchema.parse({ landing_path: "/x?email=a@b.c" })).toEqual({});
  });
});

describe("parseFirstTouch", () => {
  it("reads the cookie's encoded JSON", () => {
    const value = encodeURIComponent(JSON.stringify({ utm_source: "print", landing_path: "/" }));
    expect(parseFirstTouch(value)).toEqual({ utm_source: "print", landing_path: "/" });
  });
  it("ignores a missing or broken cookie", () => {
    expect(parseFirstTouch(undefined)).toEqual({});
    expect(parseFirstTouch("%7Bbroken")).toEqual({});
  });
});

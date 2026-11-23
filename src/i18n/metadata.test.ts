import { describe, expect, it } from "vitest";
import { hasLanguageChoice, parseEnabledLocales } from "./locales";
import { localeAlternates, localizedPath } from "./metadata";

describe("parseEnabledLocales", () => {
  it("defaults to English only", () => {
    expect(parseEnabledLocales(undefined)).toEqual(["en-US"]);
  });
  it("always keeps English first, drops unknown tags and duplicates", () => {
    expect(parseEnabledLocales("es-US, fr-FR, en-US, es-US")).toEqual(["en-US", "es-US"]);
  });
  it("only offers a language choice with two real languages", () => {
    expect(hasLanguageChoice(["en-US"])).toBe(false);
    expect(hasLanguageChoice(["en-US", "en-XA"])).toBe(false);
    expect(hasLanguageChoice(["en-US", "es-US"])).toBe(true);
  });
});

describe("localizedPath", () => {
  it("leaves English unprefixed and prefixes the others", () => {
    expect(localizedPath("/", "en-US")).toBe("/");
    expect(localizedPath("/events", "en-US")).toBe("/events");
    expect(localizedPath("/events", "es-US")).toBe("/es/events");
    expect(localizedPath("/", "es-US")).toBe("/es");
  });
});

describe("localeAlternates", () => {
  it("emits only a canonical while English is the only language", () => {
    expect(localeAlternates("/events", "en-US", ["en-US", "en-XA"])).toEqual({
      canonical: "https://thesourceofhope.org/events",
    });
  });

  it("emits reciprocal hreflang plus x-default once Spanish exists", () => {
    expect(localeAlternates("/events", "es-US", ["en-US", "es-US"])).toEqual({
      canonical: "https://thesourceofhope.org/es/events",
      languages: {
        en: "https://thesourceofhope.org/events",
        es: "https://thesourceofhope.org/es/events",
        "x-default": "https://thesourceofhope.org/events",
      },
    });
  });

  it("omits languages a page doesn't exist in", () => {
    expect(localeAlternates("/store", "en-US", ["en-US"]).languages).toBeUndefined();
  });
});

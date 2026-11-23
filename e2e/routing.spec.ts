import { expect, test } from "@playwright/test";

/*
 * Locale routing (ADR-0004) and a regression net for every page that hasn't
 * been rebuilt yet. Runs with English only, as production does at launch.
 * Request-level checks run once (desktop project).
 */

const LEGACY_PAGES = [
  "/", "/about", "/about/team", "/programs", "/programs/servingHope", "/programs/educationHope",
  "/programs/wellnessHope", "/programs/outdoorHope", "/programs/internationalHope", "/events", "/media",
  "/media/awards", "/media/press", "/media/podcast", "/members", "/donate", "/planned-giving", "/connect",
  "/store", "/store/cart", "/store/checkout",
];

test.describe("locale routing", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "request-level checks run once");
  });

  for (const path of LEGACY_PAGES) {
    test(`${path} renders in English at its unchanged URL`, async ({ request }) => {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status()).toBe(200);
      const html = await res.text();
      expect(html).toMatch(/<html[^>]*lang="en-US"/);
    });
  }

  test("the explicit default prefix redirects to the unprefixed URL", async ({ request }) => {
    const res = await request.get("/en-US/events", { maxRedirects: 0 });
    expect([301, 302, 307, 308]).toContain(res.status());
    expect(res.headers()["location"]).toMatch(/\/events$/);
  });

  test("a Spanish browser is not redirected (no locale detection)", async ({ request }) => {
    const res = await request.get("/", { maxRedirects: 0, headers: { "accept-language": "es-MX,es;q=0.9" } });
    expect(res.status()).toBe(200);
  });

  test("locales that aren't enabled don't exist", async ({ request }) => {
    expect((await request.get("/es/events", { maxRedirects: 0 })).status()).toBe(404);
    expect((await request.get("/fr/events", { maxRedirects: 0 })).status()).toBe(404);
    expect((await request.get("/does-not-exist", { maxRedirects: 0 })).status()).toBe(404);
  });

  test("existing redirects and the API are unaffected", async ({ request }) => {
    const awards = await request.get("/awards", { maxRedirects: 0 });
    expect(awards.status()).toBe(308);
    expect(awards.headers()["location"]).toMatch(/\/media\/awards$/);
    expect((await request.get("/api/health")).status()).toBe(200);
  });

  test("legacy team-member URLs still redirect to the profile", async ({ request }) => {
    const groups = await (await request.get("/api/team-member")).json();
    const slug: string | undefined = groups?.[0]?.members?.[0]?.slug?.current;
    test.skip(!slug, "no team members in the dataset");
    const res = await request.get(`/${slug}`, { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toMatch(new RegExp(`/about/team/${slug}$`));
  });

  test("the styleguide has its own shell, outside locale routing", async ({ request }) => {
    const html = await (await request.get("/styleguide")).text();
    expect(html).toMatch(/<html[^>]*lang="en-US"/);
    expect(html).not.toContain("THE SOURCE OF HOPE</span>"); // no legacy header
  });
});

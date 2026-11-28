import { expect, test } from "@playwright/test";

/* Slice 3.9: retired URLs (spec §8.5) are permanent redirects that keep UTMs. */
const REDIRECTS: [string, string][] = [
  ["/donate", "/?action=give&type=once"],
  ["/members", "/?action=give&type=monthly"],
  ["/sponsor", "/?action=give&type=business"],
  ["/planned-giving", "/?action=give&type=planned"],
  ["/giving", "/?action=give&type=planned"],
  ["/connect", "/contact"],
  ["/media/press", "/media#press"],
  ["/media/podcast", "/media#podcast"],
  ["/awards", "/media/awards"],
  ["/serve/servingHope", "/programs/servingHope"],
];

test.describe("redirects", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "request-level checks run once");
  });

  for (const [from, to] of REDIRECTS) {
    test(`${from} → ${to} (308, UTMs kept)`, async ({ request }) => {
      const res = await request.get(`${from}?utm_source=flyer&utm_campaign=spring`, { maxRedirects: 0 });
      expect(res.status()).toBe(308);
      const location = new URL(res.headers()["location"], "http://x");
      const expected = new URL(to, "http://x");
      expect(location.pathname).toBe(expected.pathname);
      expect(location.hash).toBe(expected.hash);
      for (const [key, value] of expected.searchParams) expect(location.searchParams.get(key)).toBe(value);
      expect(location.searchParams.get("utm_source")).toBe("flyer");
      expect(location.searchParams.get("utm_campaign")).toBe("spring");
    });
  }

  test("sitemap and robots are generated", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("<loc>https://thesourceofhope.org/programs/servingHope</loc>");
    expect(sitemap).not.toContain("/staff");
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /staff");
    expect(robots).toContain("Sitemap: https://thesourceofhope.org/sitemap.xml");
  });
});

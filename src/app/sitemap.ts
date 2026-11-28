import type { MetadataRoute } from "next";
import { PROGRAM_KEYS } from "@/content/programs";
import { ENABLED_LOCALES } from "@/i18n/locales";
import { localizedPath, SITE_URL } from "@/i18n/metadata";
import { getProducts, getTeam } from "@/lib/content/loaders";

/* sitemap.xml (slice 3.9): every public page, in each enabled language. */

const STATIC_PAGES = ["/", "/programs", "/events", "/about", "/about/team", "/about/partners", "/media", "/media/awards", "/careers", "/contact", "/store", "/privacy", "/terms"];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [team, products] = await Promise.all([getTeam(), getProducts()]);
  const paths = [
    ...STATIC_PAGES,
    ...PROGRAM_KEYS.map((key) => `/programs/${key}`),
    ...team.flatMap((group) => group.members.map((m) => `/about/team/${m.slug}`)),
    ...products.map((p) => `/store/product/${p.slug}`),
  ];
  const locales = ENABLED_LOCALES.filter((l) => l !== "en-XA");
  return [...new Set(paths)].flatMap((path) =>
    locales.map((locale) => ({
      url: `${SITE_URL}${localizedPath(path, locale)}`,
      changeFrequency: path === "/" || path === "/events" ? ("daily" as const) : ("weekly" as const),
      priority: path === "/" ? 1 : path.split("/").length <= 2 ? 0.8 : 0.5,
    })),
  );
}

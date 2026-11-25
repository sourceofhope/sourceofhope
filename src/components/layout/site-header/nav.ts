/*
 * The site's navigation, in one place (spec §8.1–8.3). Keys are message keys
 * under `Shell`; hrefs are locale-free paths (the Link adds the prefix).
 */

export const PROGRAM_LINKS = [
  { key: "servingHope", href: "/programs/servingHope" },
  { key: "educationHope", href: "/programs/educationHope" },
  { key: "wellnessHope", href: "/programs/wellnessHope" },
  { key: "outdoorHope", href: "/programs/outdoorHope" },
  { key: "internationalHope", href: "/programs/internationalHope" },
] as const;

export const ABOUT_LINKS = [
  { key: "story", href: "/about" },
  { key: "team", href: "/about/team" },
  { key: "awards", href: "/media/awards" },
  { key: "media", href: "/media" },
  { key: "partners", href: "/about/partners" },
  { key: "careers", href: "/careers" },
  { key: "contact", href: "/contact" },
] as const;

export const NAV_HREFS = { programs: "/programs", events: "/events", store: "/store" } as const;

/**
 * The nav href that best matches the current path: the longest one that is
 * the path itself or a parent of it. "/media/awards" wins over "/media".
 */
export function currentHref(pathname: string, hrefs: readonly string[]): string | undefined {
  return hrefs
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];
}

export const ALL_NAV_HREFS: readonly string[] = [
  ...Object.values(NAV_HREFS),
  ...PROGRAM_LINKS.map((l) => l.href),
  ...ABOUT_LINKS.map((l) => l.href),
];

import type { MetadataRoute } from "next";

// Same domain as `metadataBase` in layout.tsx. Hardcoded on purpose so preview
// and development deployments never advertise their own URLs to search engines.
const SITE_URL = "https://thesourceofhope.org";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

const ROUTES: { path: string; changeFrequency: ChangeFrequency; priority?: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },

  { path: "/about", changeFrequency: "monthly" },
  { path: "/about/team", changeFrequency: "monthly" },

  { path: "/programs", changeFrequency: "weekly" },
  { path: "/programs/servingHope", changeFrequency: "monthly" },
  { path: "/programs/educationHope", changeFrequency: "monthly" },
  { path: "/programs/wellnessHope", changeFrequency: "monthly" },
  { path: "/programs/outdoorHope", changeFrequency: "monthly" },
  { path: "/programs/internationalHope", changeFrequency: "monthly" },

  { path: "/connect", changeFrequency: "daily" },

  { path: "/media", changeFrequency: "weekly" },
  { path: "/media/press", changeFrequency: "monthly" },
  { path: "/media/podcast", changeFrequency: "monthly" },
  { path: "/media/awards", changeFrequency: "monthly" },

  { path: "/events", changeFrequency: "weekly" },

  { path: "/planned-giving", changeFrequency: "monthly" },
  { path: "/members", changeFrequency: "monthly" },
  { path: "/donate", changeFrequency: "monthly" },
  { path: "/store", changeFrequency: "weekly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    ...(priority !== undefined && { priority }),
  }));
}

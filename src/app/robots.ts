import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/metadata";

/* robots.txt (slice 3.9): everything public, nothing private or transactional. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/staff", "/styleguide", "/api/", "/link", "/store/cart", "/store/checkout", "/store/success", "/*?action=", "/*&action="] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

/**
 * Sponsors shown in the homepage strip and on Partners & Sponsors (spec
 * §10.1, §10.8). A static list in code, every sponsor shown equally, no
 * tiers. The logos are placeholders until TSOH supplies the files: replace
 * `logo` with the real path (put files in public/v2/sponsors/) and `name`.
 */
export type Sponsor = { name: string; logo: string; href?: `https://${string}` };

export const SPONSORS: readonly Sponsor[] = [
  { name: "Sponsor one", logo: "/v2/core/placeholder.webp" },
  { name: "Sponsor two", logo: "/v2/core/placeholder.webp" },
  { name: "Sponsor three", logo: "/v2/core/placeholder.webp" },
  { name: "Sponsor four", logo: "/v2/core/placeholder.webp" },
  { name: "Sponsor five", logo: "/v2/core/placeholder.webp" },
  { name: "Sponsor six", logo: "/v2/core/placeholder.webp" },
];

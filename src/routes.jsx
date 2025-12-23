export const ROUTE_ALIASES = {
  home: ["", "home"],

  about: ["about", "aboutus"],

  serve: ["serve", "serving"],

  connect: ["connect", "connection"],

  media: ["media", "photos"],

  servingHope: ["serve/servingHope", "serve/sharingHope"],
  educationHope: ["serve/educationHope", "serve/education"],
  wellnessHope: ["serve/wellnessHope", "serve/wellness"],
  outdoorHope: ["serve/outdoorHope", "serve/outdoor"],
  internationalHope: ["serve/internationalHope", "serve/internationalHope"],

  member: ["members", "membership", "signup"],
};

export const ROUTES = Object.fromEntries(
  Object.entries(ROUTE_ALIASES).map(([key, paths]) => [
    key,
    paths.map((p) => `/${p}`),
  ])
);
const BASE_URL = "https://thesourceofhope.org";

export const CANONICAL = {
  home: "home",

  about: "about",

  serve: "serve",

  connect: "connect",

  media: "media",

  servingHope: "serve/servingHope",
  educationHope: "serve/educationHope",
  wellnessHope: "serve/wellnessHope",
  outdoorHope: "serve/outdoorHope",
  internationalHope: "serve/internationalHope",

  member: "members",
};

export const CANONICAL_URL = {
  home: `${BASE_URL}/${CANONICAL.home}`,

  about: `${BASE_URL}/${CANONICAL.about}`,

  serve: `${BASE_URL}/${CANONICAL.serve}`,

  connect: `${BASE_URL}/${CANONICAL.connect}`,

  media: `${BASE_URL}/${CANONICAL.media}`,

  servingHope: `${BASE_URL}/${CANONICAL.servingHope}`,
  educationHope: `${BASE_URL}/${CANONICAL.educationHope}`,
  wellnessHope: `${BASE_URL}/${CANONICAL.wellnessHope}`,
  outdoorHope: `${BASE_URL}/${CANONICAL.outdoorHope}`,
  internationalHope: `${BASE_URL}/${CANONICAL.internationalHope}`,

  member: `${BASE_URL}/${CANONICAL.member}`,
};

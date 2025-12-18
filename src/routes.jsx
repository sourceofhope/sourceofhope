export const ROUTE_ALIASES = {
  home: ["/", "/home"],

  about: ["/about", "/aboutus"],

  serve: ["/serve", "/serving"],

  connect: ["/connect", "/connection"],

  media: ["/media", "/photos"],

  servingHope: ["/serve/servingHope", "/serve/sharingHope"],
  educationHope: ["/serve/educationHope", "/serve/education"],
  wellnessHope: ["/serve/wellnessHope", "/serve/wellness"],
  outdoorHope: ["/serve/outdoorHope", "/serve/outdoor"],
  internationalHope: ["/serve/internationalHope", "/serve/internationalHope"],

  member: ["/members", "/membership", "signup"],
};

export const ROUTES = Object.fromEntries(
  Object.entries(ROUTE_ALIASES).map(([key, paths]) => [
    key,
    paths.map((p) => `${p}`),
  ])
);

export const CANONICAL = {
  home: `/home`,

  about: `/about`,

  serve: `/serve`,

  connect: `/connect`,

  media: `/media`,

  servingHope: `/serve/servingHope`,
  educationHope: `/serve/educationHope`,
  wellnessHope: `/serve/wellnessHope`,
  outdoorHope: `/serve/outdoorHope`,
  internationalHope: `/serve/internationalHope`,

  member: `/members`,
};

const BASE_URL = "https://thesourceofhope.org";

export const CANONICAL_URL = {
  home: `${BASE_URL}/`,

  about: `${BASE_URL}/about`,

  serve: `${BASE_URL}/serve`,

  connect: `${BASE_URL}/connect`,

  media: `${BASE_URL}/media`,

  servingHope: `${BASE_URL}/serve/servingHope`,
  educationHope: `${BASE_URL}/serve/educationHope`,
  wellnessHope: `${BASE_URL}/serve/wellnessHope`,
  outdoorHope: `${BASE_URL}/serve/outdoorHope`,
  internationalHope: `${BASE_URL}/serve/internationalHope`,

  member: `${BASE_URL}/members`,
};

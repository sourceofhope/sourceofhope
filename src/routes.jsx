export const BASE = "/sourceofhope";

export const ROUTE_ALIASES = {
  home: ["/", "/home"],

  about: ["/about", "/aboutus"],

  serve: ["/serve", "/serving"],
  servingHope: ["/serve/servingHope", "/serve/sharingHope", "/serve/hope"],

  member: ["/members", "/membership", "signup"],
};

export const ROUTES = Object.fromEntries(
  Object.entries(ROUTE_ALIASES).map(([key, paths]) => [
    key,
    paths.map((p) => `${BASE}${p}`),
  ])
);

export const CANONICAL = {
  home: `${BASE}/`,

  about: `${BASE}/about`,

  serve: `${BASE}/serve`,
  servingHope: `${BASE}/serve/servingHope`,

  member: `${BASE}/member`,
};

const BASE_URL = "https://thesourceofhope.org";

export const CANONICAL_URL = {
  home: `${BASE_URL}/`,

  about: `${BASE_URL}/about`,

  serve: `${BASE_URL}/serve`,
  servingHope: `${BASE_URL}/serve/servingHope`,

  member: `${BASE}/member`,
};

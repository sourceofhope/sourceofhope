export const BASE = "/sourceofhope";

export const ROUTE_ALIASES = {
  home: ["/", "/home"],
  about: ["/about", "/aboutus"],
  serve: ["/serve", "/serving"],
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
};
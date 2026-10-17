# Repository Layout

This is a single repository containing the Next.js website (pages and API routes) and the Sanity Studio project.

Top-level:

- `/src` Website source (pages, API routes, components, helpers)
- `/public` Static files served from the site root
- `/sanity/the-source-of-hope` Sanity Studio (separate npm project)
- `/docs` Documentation
- `/next.config.ts` Redirects, security headers, image settings
- `/.env.template` Environment variable template
- `/eslint.config.mjs`, `/tsconfig.json`, `/postcss.config.mjs` Tooling

---

## `/src` Layout

```
/src
  /app
    layout.tsx                 root layout (providers, header, footer, analytics)
    globals.css                Tailwind import + @theme tokens (colors, fonts, sizes)
    page.tsx                   home page
    [slug]/page.tsx            legacy team-member URL redirect
    about/ connect/ donate/ events/ media/ members/ planned-giving/ programs/ store/
    api/                       Route Handlers (see 06_API_ROUTES.md)
  /components
    <area>/                    page sections: about, awards, connect, donate, events, home,
                               media, members, planned-giving, programs, store (+ cart, checkout)
    layout/                    Header, Footer, PageHeader, HeaderBlocker
    ui/                        shared primitives (buttons, PageSection, SectionHeading, Carousel,
                               HookInput, HoneypotField, expressive/, parallax/, ...)
    structure/Loader.tsx       full-screen loading indicator
  /context
    HeaderContext.tsx          header blocking + banner state
    StoreCartContext.tsx       cart, shipping method, processing fee (localStorage)
  /lib
    environment.ts             ASSET_VERSION (client-safe)
    environment.server.ts      getEnvironment(): all env vars (server-only)
    sanity-client.ts           next-sanity client (server-only)
    sanity-content.ts          GROQ queries + TypeScript types (server-only)
    store-constants.ts         shipping options, tax and processing rates
    store-pricing.ts           quoteStoreOrder() server-side pricing (server-only)
    rate-limit.ts              per-IP rate limiting for API routes
    validation.ts              readJsonObject() request body parsing
```

Conventions:

- Routes are folders under `/src/app`; the page file is always `page.tsx`.
- Page sections are named `<Area><Name>Section.tsx` and live in `/src/components/<area>/`.
- Components that only one route uses may sit beside the route (for example `/src/app/about/team/CarouselCard.tsx`).
- Import from `/src` with the `@/` alias (`import PageSection from "@/components/ui/PageSection"`).

---

## Root Scripts (`package.json`)

- `dev`: `next dev` — local development server on `http://localhost:3000`
- `build`: `next build` — production build (type-checks and fails on TypeScript errors)
- `start`: `next start` — serve a production build locally
- `lint`: `eslint` — Next.js core-web-vitals + TypeScript rules (`/eslint.config.mjs`)
- `sanity`: `sanity dev` — note there is no Studio config at the repo root; run the Studio from its own folder instead (below)

Requirements:

- Node.js 20.9 or newer (Next.js 16 requirement; Node 22 LTS works)
- If `npm install` reports peer dependency conflicts, use `npm install --legacy-peer-deps`

There is no automated test suite and no Prettier script; Prettier is installed as a dev dependency for editor use.

---

## Sanity Studio (`/sanity/the-source-of-hope`)

A separate npm project with its own `package.json` and lockfile. The root `tsconfig.json` excludes it.

- `sanity.config.ts` — Studio config (project id and dataset are hardcoded)
- `sanity.cli.ts` — CLI config, deployment app id, auto-updates
- `schemaTypes/*.ts` — content type definitions, registered in `schemaTypes/index.ts`

Scripts (run inside that folder):

- `npm run dev` — Studio at `http://localhost:3333`
- `npm run build` — build the Studio
- `npm run deploy` — deploy the hosted Studio (required after schema changes)

See `/docs/developers/04_CMS_INTEGRATION.md`.

---

## `/public`

- `/public/v2/core/` logos, hero images and video, placeholders, awards images
- `/public/v2/<program>/` program carousels and tiles (servingHope, educationHope, wellnessHope, outdoorHope, internationalHope, sharingHope)
- `/public/v2/serve/` program banners
- `/public/v2/plannedgiving/` planned giving images
- `/public/v2/documents/` downloadable PDFs (volunteer agreements)
- `/public/sitemap.xml`, `/public/robots.txt`, favicons, `site.webmanifest`

The `v2` segment is the `ASSET_VERSION`. See `/docs/recipes/fixes/UPDATE_STATIC_ASSETS.md`.

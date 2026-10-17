# Add a Redirect

When a page moves or is renamed, the old URL must keep working. Search engines, printed flyers, emails, and social posts keep pointing at it long after the change.

Site-wide redirects live in `redirects()` in `/next.config.ts`.

---

## Existing Redirects

```ts
async redirects() {
  return [
    // Awards now lives under Media.
    { source: "/awards", destination: "/media/awards", permanent: true },
    { source: "/giving", destination: "/planned-giving", permanent: true },
    // Serve was renamed to Programs.
    { source: "/serve/:path*", destination: "/programs/:path*", permanent: true },
  ];
},
```

---

## Add a Redirect

Add an object to the returned array:

```ts
{ source: "/old-page", destination: "/new-page", permanent: true },
```

- `permanent: true` sends a 308. Use it when the move is final, which is almost always.
- `permanent: false` sends a 307. Use it for short-term moves, such as pointing a URL at a seasonal page.
- Leave a short comment explaining why the redirect exists.

Redirects run before pages are matched, so a redirect `source` hides any page at that path.

---

## Redirect a Whole Section

`:path*` matches zero or more segments and carries them over to the destination.

When "Serve" was renamed "Programs", one rule kept every old link working:

```ts
{ source: "/serve/:path*", destination: "/programs/:path*", permanent: true },
```

- `/serve` → `/programs`
- `/serve/servingHope` → `/programs/servingHope`

Use `:slug` instead of `:path*` to match exactly one segment.

---

## Redirecting From Inside a Page

When the destination depends on data, redirect in the page instead. `/src/app/[slug]/page.tsx` looks up a team member by slug and sends old root-level links to their profile:

```tsx
import { notFound, permanentRedirect } from "next/navigation";
import { fetchTeamMemberBySlug } from "@/lib/sanity-content";

export default async function LegacyTeamMemberRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await fetchTeamMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  permanentRedirect(`/about/team/${encodeURIComponent(member.slug.current)}`);
}
```

- `permanentRedirect()` is permanent (308).
- `redirect()` is temporary (307).
- Both come from `next/navigation` and stop rendering, so nothing after them runs.

Prefer `/next.config.ts` for fixed paths. It is faster and keeps every redirect in one place.

---

## When You Rename or Move a Route

Update all of these in the same change:

1. Move the folder in `/src/app`.
2. Add the redirect from the old path.
3. Update `getHeaderLinks()` in `/src/components/layout/Header.tsx` and any footer links in `/src/components/layout/Footer.tsx`.
4. Search `/src` for the old path in `href` strings and update them. There is no central route constant.
5. Replace the old URL in `/public/sitemap.xml`.

---

## Validate

- Changes to `/next.config.ts` need a dev server restart (`npm run dev`).
- Visit the old URL and confirm you land on the new one.
- In the browser Network tab, confirm the status is 308 (or 307 for temporary redirects).
- For wildcard rules, test the bare path and at least one child path.
- Confirm no internal link still points at the old URL.

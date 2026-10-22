# Add a CMS Content Type

This recipe walks through adding a new kind of editable content end to end: a Sanity schema, the Studio deploy, a GROQ fetcher, and the component that renders it.

The example adds **Partners** (name, website, logo) to show on the About page.

Pieces involved:

- Sanity Studio project: `/sanity/the-source-of-hope` (its own `package.json`)
- Schemas: `/sanity/the-source-of-hope/schemaTypes/`
- Website data layer: `/src/lib/sanity-content.ts`
- A Server Component that renders the data

---

## 1) Add the Schema

Create `/sanity/the-source-of-hope/schemaTypes/partner.ts`. Follow the existing types (file names are kebab-case, exports are `<name>Type`, images have `hotspot` and an `alt` field):

```ts
import {defineField, defineType} from 'sanity'

export const partnerType = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'image',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
```

Register it in `/sanity/the-source-of-hope/schemaTypes/index.ts`:

```ts
import {partnerType} from './partner'

export const schemaTypes = [
  // ...existing types
  partnerType,
]
```

Naming the image field `image` lets you reuse the shared `IMAGE_PROJECTION` in step 3.

---

## 2) Run and Deploy the Studio

From the Studio folder (not the repo root):

```bash
cd sanity/the-source-of-hope
npm install
npm run dev      # http://localhost:3333
```

Create a test Partner and click **Publish**. The website only reads published documents, never drafts.

When the schema is ready, publish the Studio so content creators see the new type:

```bash
npm run deploy
```

Schema changes do not alter existing documents. Renaming or removing a field leaves old data in place, so coordinate with the code that reads it.

---

## 3) Add a Type and Fetcher

In `/src/lib/sanity-content.ts`, add an interface and a fetcher next to the existing ones:

```ts
export interface SanityPartner {
  id: string;
  name: string;
  url?: string;
  image?: SanityImage;
}

export async function fetchPartners(limit = 24) {
  return client.fetch<SanityPartner[]>(
    `*[_type == "partner"] | order(name asc)[0...${clampLimit(limit, 24)}] {
      "id": _id,
      name,
      url,
      ${IMAGE_PROJECTION}
    }`,
    {},
    options,
  );
}
```

Conventions in this file:

- Always pass `options` (`{ next: { revalidate: 30 } }`) so the site picks up changes within about 30 seconds.
- Run numeric limits through `clampLimit` before putting them in a query.
- Pass user-controlled values as GROQ parameters (`$slug`), never by string interpolation.
- The module is `server-only`. Client components may import its **types** (`import type { SanityPartner } ...`) but not its functions.

---

## 4) Render It

Create a Server Component, e.g. `/src/components/about/AboutPartnersSection.tsx`:

```tsx
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { fetchPartners } from "@/lib/sanity-content";

async function getPartners() {
  try {
    return await fetchPartners();
  } catch {
    return [];
  }
}

export default async function AboutPartnersSection() {
  const partners = await getPartners();

  return (
    <PageSection>
      <SectionHeading eyebrow="Together" title="Our Partners" />
      {partners.length === 0 ? (
        <p className="text-neutral-500 text-center">No partners to display</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {partners.map((partner) => (
            <li key={partner.id} className="h-24 flex items-center justify-center">
              {partner.image?.sourceUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={partner.image.sourceUrl}
                  alt={partner.image.altText || partner.name}
                  loading="lazy"
                  decoding="async"
                  className="max-h-full w-auto object-contain"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </PageSection>
  );
}
```

Then mount it in `/src/app/about/page.tsx`.

Notes:

- The `try/catch` keeps the page (and the build) working if Sanity is unreachable.
- `sourceUrl` is the original uploaded file, not a resized copy. Put the image in a fixed-size container and see `/docs/recipes/fixes/USING_CMS_IMAGES.md`.
- If the section needs interactivity, fetch in a server component and pass the data as props to a client component.

---

## 5) Optional: Expose an API Route

The site's pages read Sanity directly, so an API route is only needed if browser code or an outside consumer must fetch this content. Follow the pattern in `/src/app/api/publication/route.ts` and `/docs/recipes/tutorials/ADD_AN_API_ROUTE.md`.

---

## 6) Document It

- Add the new type, its fields, and where it appears on the site to `/docs/creators/CONTENT_TYPES_REFERENCE.md`
- Mention it in `/docs/developers/04_CMS_INTEGRATION.md`

---

## Validation checklist

- The new type appears in the local Studio and in the deployed Studio
- A published document shows on the site within about 30 seconds; a draft does not
- Deleting all documents shows the empty state, not an error
- Missing image or alt text does not break the layout
- `npm run lint` and `npm run build` pass

# Add a Downloadable Document

This recipe covers offering a file (usually a PDF) for visitors to download, and updating the volunteer agreements, which can be downloaded and also signed online.

Static files are served from `/public`:

- Files: `/public/v2/documents/`
- Waiver list: `WAIVERS` and `WAIVER_IDS` in `/src/lib/waivers.ts`
- Section: `EventsDocumentsSection` (`/src/components/events/EventsDocumentsSection.tsx`, heading "Volunteer Agreements", anchor `#volunteer-agreements`)

Documents in the repository today:

- `/public/v2/documents/TSOH-Volunteer-Agreement.pdf` (General Volunteer Agreement)
- `/public/v2/documents/TSOH-Serving-Hope-Volunteer-Agreement.pdf` (Serving Hope Volunteer Agreement)

Where they are used:

- `/events` shows both agreements: `<EventsDocumentsSection />`
- `/programs/servingHope` shows only the Serving Hope agreement: `<EventsDocumentsSection only={["serving-hope"]} />`
- The event details window links to the agreement chosen in the event's **Volunteer Waiver** field

Each agreement always has a **Download PDF** link. When DocuSign is configured, a **Sign online** button appears next to it (see `/docs/recipes/guidelines/SET_UP_DOCUSIGN_WAIVERS.md`).

---

## Adding a Document That Is Not a Waiver

For a flyer, handbook, or form that is only downloaded, do not add it to `WAIVERS`: every waiver needs matching DocuSign templates.

1. Put the file in `/public/v2/documents/` with a descriptive, URL-safe name, for example `/public/v2/documents/TSOH-Volunteer-Handbook.pdf`. Keep PDFs small (compress scans; a few hundred KB is typical).
2. Link to it where it is needed, building the path with `ASSET_VERSION`:

```tsx
import { AnchorButton } from "@/components/ui/Button";
import { ASSET_VERSION } from "@/lib/environment";

<AnchorButton
  text="DOWNLOAD THE HANDBOOK"
  href={`/${ASSET_VERSION}/documents/TSOH-Volunteer-Handbook.pdf`}
/>;
```

Files in `/public` are served as-is at the same path, e.g. `https://thesourceofhope.org/v2/documents/TSOH-Volunteer-Handbook.pdf`. Do not hardcode `/v2/`.

---

## Updating a Volunteer Agreement

When the wording of an agreement changes:

1. Overwrite the PDF in `/public/v2/documents/` with the **same file name**.
2. Bump `WAIVER_REVISION` in `/src/lib/waivers.ts` (for example `"2027-03"`). Volunteers who signed the old revision online are then asked to sign again on their device.
3. If DocuSign is configured, replace the document in both of that agreement's templates (adult and minor) in DocuSign, or create new templates and update the `DOCUSIGN_TEMPLATE_*` variables in every environment.
4. Deploy.

Browsers and CDNs may cache the old PDF for a while. If the new version must be seen immediately, give the file a new name (e.g. `...-2027.pdf`) and update its `href` in `WAIVERS`.

---

## Adding a New Volunteer Agreement

A new agreement touches the website, the Studio, and DocuSign:

1. Add the PDF to `/public/v2/documents/`.
2. In `/src/lib/waivers.ts`, add the id to `WAIVER_IDS` and an entry to `WAIVERS`:

```ts
export const WAIVER_IDS = ["general", "serving-hope", "youth-sports"] as const;

export const WAIVERS: Record<WaiverId, Waiver> = {
  // ...existing entries
  "youth-sports": {
    id: "youth-sports",
    title: "Youth Sports Volunteer Agreement",
    shortTitle: "Youth Sports Agreement",
    description: "Required for volunteers coaching youth sports programs.",
    href: `/${ASSET_VERSION}/documents/TSOH-Youth-Sports-Volunteer-Agreement.pdf`,
  },
};
```

3. Run `npx tsc --noEmit`. TypeScript flags the other places keyed by waiver id, such as `docusignTemplates` in `/src/lib/environment.server.ts`. Add the two new `DOCUSIGN_TEMPLATE_*` variables there, to `isDocusignConfigured()` in `/src/lib/docusign.server.ts`, and to `/.env.template`.
4. Add the option to the `waiver` field in `/sanity/the-source-of-hope/schemaTypes/event-fields.ts`, then deploy the Studio (`npm run deploy`).
5. Build the adult and minor templates in DocuSign and set their ids in every environment.
6. Update `/docs/creators/CONTENT_TYPES_REFERENCE.md` so editors know when to choose it.

`/events` lists every id in `WAIVER_IDS`; use `only` to show a subset elsewhere:

```tsx
<EventsDocumentsSection only={["youth-sports"]} />
```

To link to the section from elsewhere on a page, use `#volunteer-agreements` (e.g. `href="/events#volunteer-agreements"`).

---

## Validation Checklist

- Each download link opens the right file (no 404)
- `/events` lists all agreements; pages using `only` show just the intended ones
- Titles and descriptions read correctly on mobile
- The file opens on a phone and is a reasonable size
- If DocuSign is configured, "Sign online" opens the new or updated template

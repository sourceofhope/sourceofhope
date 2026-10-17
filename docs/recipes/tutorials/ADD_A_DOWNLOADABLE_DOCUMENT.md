# Add a Downloadable Document

This recipe covers offering a file (usually a PDF, such as a volunteer agreement) for visitors to download.

Downloadable documents are static files served from `/public`, listed in one array, and rendered by a shared section:

- Files: `/public/v2/documents/`
- List: `VOLUNTEER_DOCUMENTS` in `/src/components/events/EventsDocumentsSection.tsx`
- Section: `EventsDocumentsSection` (heading "Volunteer Agreements", anchor `#volunteer-agreements`)

Where it is used today:

- `/events` shows all documents: `<EventsDocumentsSection />`
- `/programs/servingHope` shows only the Serving Hope agreement: `<EventsDocumentsSection only={["serving-hope"]} />`

---

## Important: Files Still Missing

`VOLUNTEER_DOCUMENTS` already links to two PDFs that are **not yet in the repository**:

- `/public/v2/documents/TSOH-Volunteer-Agreement.pdf`
- `/public/v2/documents/TSOH-Serving-Hope-Volunteer-Agreement.pdf`

Until they are added, the download links on `/events` and `/programs/servingHope` return 404. Adding them with exactly these names fixes the links; no code change is needed.

---

## 1) Add the File

Put the file in `/public/v2/documents/` with a descriptive, URL-safe name:

- `/public/v2/documents/TSOH-Youth-Volunteer-Waiver.pdf`

Keep PDFs small (compress scans; a few hundred KB is typical). Files in `/public` are served as-is at the same path, e.g. `https://thesourceofhope.org/v2/documents/TSOH-Youth-Volunteer-Waiver.pdf`.

---

## 2) Add It to the List

In `/src/components/events/EventsDocumentsSection.tsx`:

```tsx
export const VOLUNTEER_DOCUMENTS = [
  // ...existing entries
  {
    id: "youth-waiver",
    title: "Youth Volunteer Waiver",
    description:
      "Required for volunteers under 18, signed by a parent or guardian.",
    href: `/${ASSET_VERSION}/documents/TSOH-Youth-Volunteer-Waiver.pdf`,
  },
];
```

- `id` is used for filtering with `only` and as the React key; keep it short and unique.
- Build `href` with `ASSET_VERSION` (from `@/lib/environment`); do not hardcode `/v2/`.

---

## 3) Show It Where Needed

All documents (as on `/events`):

```tsx
import EventsDocumentsSection from "@/components/events/EventsDocumentsSection";

<EventsDocumentsSection />;
```

Only specific documents (as on `/programs/servingHope`):

```tsx
<EventsDocumentsSection only={["youth-waiver"]} />
```

To link to the section from elsewhere on a page, use `#volunteer-agreements` (e.g. `href="/events#volunteer-agreements"`).

---

## Replacing a Document

Overwrite the file in `/public/v2/documents/` with the **same file name** and deploy. No code change is needed.

Browsers and CDNs may cache the old copy for a while. If an updated version must be seen immediately, give the new file a new name (e.g. `...-2027.pdf`) and update its `href`.

---

## Validation checklist

- Each download link opens or downloads the right file (no 404)
- `/events` lists all documents; pages using `only` show just the intended ones
- Titles and descriptions read correctly on mobile
- The file opens on a phone and is a reasonable size

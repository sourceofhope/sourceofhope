# UI and Component Conventions

This project uses three UI layers:

1. Global layout (root layout, Header, Footer, PageHeader)
2. Reusable UI primitives (`/src/components/ui`)
3. Page-scoped sections (`/src/components/<area>`)

Styling is Tailwind CSS v4 with project theme tokens. Components are TypeScript with a typed props interface and a `className = ""` default for extension.

---

## Global Layout

Root layout:

- `/src/app/layout.tsx`

Provides, in order: fonts, default metadata, JSON-LD, analytics, then

```
HeaderProvider
  StoreCartProvider
    Header
    <main> page </main>
    Footer
```

There is no separate error layout; 404s render inside this layout.

`Header` (`/src/components/layout/Header.tsx`, client):

- Transparent over the page hero, solid `primary-800` after scrolling
- Navigation from `getHeaderLinks()`; desktop dropdowns open on hover, focus, or chevron click and close on Escape; mobile uses a drill-down menu with "BACK" and "<SECTION> OVERVIEW" entries
- Optional banner strip (`HeaderBanner`) — see `/docs/recipes/tutorials/ADD_OR_EDIT_GLOBAL_HEADER.md`

`HeaderBlocker` (`/src/components/layout/HeaderBlocker.tsx`, client, renders nothing):

- Put it on pages that do **not** start with a dark `PageHeader` (store pages) so the header switches to dark text. Cart, checkout, and success pages set the same flag through `useHeaderContext()`.

`Footer` (`/src/components/layout/Footer.tsx`, client): logo and Candid seal, contact, social, location, and quick-link columns, plus a parallax image band on every page except home. Its links are maintained separately from the header.

---

## Page Framing

`PageHeader` (`/src/components/layout/PageHeader.tsx`):

- Standard hero banner for every primary page
- Props: `title` (renders the page's single `<h1>`), `subtitle`, `src` (default `/${ASSET_VERSION}/core/TSOH-Family.webp`), `position` (CSS object-position), `children`, `className`
- Uses `next/image` with `fill`, `preload`, and `fetchPriority="high"`; fixed height and gutters

New pages pass `title`/`subtitle`. Some older pages still pass their own heading as `children`; migrate them when you touch them.

`PageSection` (`/src/components/ui/PageSection.tsx`):

- `<section>` with `w-full grid gap-10 py-5 px-5 lg:px-35 scroll-mt-25`
- Props: `children`, `className`, `id` (for in-page anchors; `scroll-mt-25` clears the fixed header)
- Shares the header's horizontal gutter so content lines up with the logo

`SectionHeading` (`/src/components/ui/SectionHeading.tsx`):

- Eyebrow (`Heading`) + title (`Title`) + optional supporting paragraph; `inverted` for dark backgrounds
- Start sections with it so headings read the same everywhere

`CallToActionSection` (`/src/components/ui/CallToActionSection.tsx`):

- Full-width closing band (`accent-800`) with icon, title, text, and a `LinkButton`
- Props: `icon`, `title`, `children`, `href`, `buttonText`

Guides: `/docs/recipes/guidelines/CONSISTENT_PAGE_HEADER.md`, `/docs/recipes/guidelines/CONSISTENT_PAGE_LAYOUT.md`.

---

## Typography Primitives

- `Title` — `<h2>`, Urbanist, `text-xlg md:text-xxlg`
- `Heading` — `<h3>` uppercase eyebrow in `accent-700`
- `HighlightedText` — animated highlight behind inline text (client)
- `Bold`, `Emphasis`, `Blockquote` — inline/text helpers

Each page should have exactly one `<h1>` (from `PageHeader`).

---

## Links and Buttons

From `/src/components/ui/Button.tsx`:

- `LinkButton` — `{ text, href, full?, className? }`, internal navigation via `next/link`
- `AnchorButton` — same props, external link (`target="_blank"`, `rel="noopener noreferrer"`)
- `Button` — plain `<button>` with `onClick`

Inline links:

- `ExpressiveLink` — `{ to, children, inline? }`, internal `next/link` with an arrow
- `ExpressiveAnchor` — `{ href, children, inText? }`, external link with an up-right arrow
- `SimpleLink` — `{ to, children }`, plain internal link

Rules:

- Internal links use `next/link` (never `<a href>` for internal pages).
- Use plain `href` strings; there is no route constant.
- External links open in a new tab with `rel="noopener noreferrer"`.

---

## Other Primitives

- `Carousel` (client) — `auto`, `showProgress`, `hideControls`, `itemsPerView={{ base, md, lg }}`; autoplays every 5 seconds and stops for good once the visitor uses the controls
- `ExpressiveCard` (client) — click-to-expand card
- `ExpressiveNumber` (client) — animated count-up number
- `Overlay`, `Takeover` (client) — portal-based modal layers
- `ParallaxSection`, `ParallaxLayer` (client) — scroll parallax (used by the Footer)
- `Icon` — `aria-hidden` icon wrapper
- `Loader` (`/src/components/structure/Loader.tsx`) — full-screen loading animation

Icons come from `@heroicons/react` (and `react-icons` for payment brand marks).

---

## Forms and Inputs

Two form patterns exist today:

- **react-hook-form + `HookInput`** — the contact form (`/src/components/connect/ConnectMapSection.tsx`). Preferred for new forms.
- **Local state + plain inputs** — the planned giving form (`/src/components/planned-giving/FormSection.tsx`).

`HookInput` (`/src/components/ui/HookInput.tsx`) is a `forwardRef` input with a visible label (`title`), an `error` prop for validation messages, and a `border` toggle. Spread `register("field", rules)` into it. Pick one pattern per form.

Every form that posts to `/api/email/send` must include the honeypot:

```tsx
import HoneypotField, { readHoneypot } from "@/components/ui/HoneypotField";

const formRef = useRef<HTMLFormElement>(null);
// ...
<form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
  <HoneypotField />
  {/* inputs */}
</form>
// in onSubmit: businessName: readHoneypot(formRef.current)
```

(With a native `onSubmit` handler, `readHoneypot(event.currentTarget)` works too, as in the planned giving form.) `readHoneypot` reads the DOM directly so bots that set values without input events are caught.

Show submission status in an `aria-live="polite"` region; do not use `alert()`.

Payment forms use Stripe's `Elements`/`PaymentElement` from `@stripe/react-stripe-js`, loading the publishable key from `POST /api/checkout/retrieve-stripe-publishable-key`.

Guide: `/docs/recipes/tutorials/BUILD_AN_EMAIL_FORM.md`.

---

## Theme Tokens

Defined in `/src/app/globals.css` (`@theme`). There is no `tailwind.config` file.

- Colors: `primary-50…900` (navy), `accent-50…900` (blue/teal), `neutral-50…900` (`neutral-50` is white)
- Font sizes: `text-xs`, `text-sm`, `text-md`, `text-lg`, `text-xlg`, `text-xxlg`, `text-xxxlg`, `text-xxxxlg`
- Spacing extras: `15` (3.75rem), `35` (8.75rem) — e.g. `lg:px-35`
- Fonts: `font-inter` (body), `font-urbanist` (titles); Montserrat is loaded for eyebrows

Use theme tokens, not Tailwind's default `blue-*`, `gray-*`, or `teal-*` palettes.

---

## Server vs Client

Components are Server Components unless they need state, effects, event handlers, browser APIs, or context. Keep `"use client"` components small and pass data into them as props.

Guide: `/docs/recipes/guidelines/SERVER_AND_CLIENT_COMPONENTS.md`.

---

## Accessibility Expectations

- Visible keyboard focus (`focus-visible:ring-*`) on custom interactive elements
- `aria-label` on icon-only buttons; decorative icons `aria-hidden="true"`
- Meaningful `alt` text for content images (use the CMS `altText`), empty `alt=""` for decorative ones
- Respect `prefers-reduced-motion` for heavy motion (the home hero video already does)

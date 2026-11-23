# 01 · UI/UX Design Spec

**Status:** Approved baseline, 2026-11-21. Values marked *(mockup)* are confirmed or adjusted when the project lead approves the Phase 0 visual-direction mockup, then frozen in `src/app/globals.css`.

This spec says how the relaunched site looks, reads and behaves. Data and API details live in [02_SYSTEM_DESIGN.md](02_SYSTEM_DESIGN.md). The order of work lives in [03_IMPLEMENTATION_PLAN.md](03_IMPLEMENTATION_PLAN.md).

---

## 1. Scope and depth

The refresh **evolves** the current site:

- **Kept:** the logo, the navy and blue palette, Urbanist headings and Inter body type, real photography, and the organization's voice.
- **Rebuilt:** the design system (tokens, components, templates), the navigation, every page, and the key journeys. Those journeys now run through the Action Hub.
- **New:** the Action Hub (Get Help · Volunteer · Give), two-sided events, a real newsletter sign-up, legal pages, and the Staff Portal UI.

One visual direction, "refined current", is mocked up for approval in Phase 0 ([ADR-0008](adr/0008-refined-current-visual-direction.md)). After that, the code is the design. The living reference is the `/styleguide` route on preview deployments.

## 2. Design principles

1. **Clear before clever.** Every screen answers "what is this and what do I do next?" in one glance. Headings say what a section is.
2. **Real people, real places.** Real TSOH photos, real numbers, real dates and addresses. No stock, AI imagery or invented claims.
3. **One way to do each thing.** One button style per role, one dialog, one card pattern, one way to open an action. No page-specific one-offs.
4. **Accessible by default.** Keyboard, screen reader, zoom, contrast and reduced motion work without special effort, because the primitives do it.
5. **Calm.** Motion only explains change (a dialog opening, a section expanding). Nothing moves on its own except the muted hero video, which can be paused.
6. **Respect people's time and privacy.** Short flows, no accounts, no personal data in URLs, no ad tracking where people seek help.

## 3. Never-rules

These are acceptance criteria, not suggestions. A PR that breaks one is not merged.

### Visual

- No decorative gradients and no gradient text. A flat tint behind text on a photo is allowed (§5.6).
- No frosted glass, backdrop blur panels, glows, neon or colored shadows.
- No purple or indigo, and no colors outside the token palette (Tailwind's default palette is banned by lint).
- No sparkle, emoji or "AI" iconography. Icons come from one set (§5.7).
- No pill badges above heroes ("✨ New", "Now live").
- No oversized rounded cards (`rounded-2xl` and above) with soft drop shadows everywhere. Radius comes only from tokens (§5.4).
- No bento grids or asymmetric collage layouts used for decoration.
- No auto-advancing carousels, parallax, scroll-jacking or counters that animate from zero. **Exceptions, decided by the project lead on 2026-11-23:** the homepage sponsor strip (a constant-speed loop with a pause control) and the hero video's shrink on scroll. Both are specified in §5.8.
- No stock photography and no AI-generated images or illustrations.
- No text baked into images.

### Copy

- Taglines appear **only in the homepage hero**, which keeps today's: "Empowering and providing hope through education, health, and wellness." Nowhere else gets a tagline or slogan ("Empowering communities, one meal at a time").
- Banned words in UI copy outside the hero tagline: *unlock, elevate, empower, seamless, journey, transform, revolutionize, game-changing, cutting-edge, delve*.
- No three-part tagline stacks ("Feed. Teach. Heal.") and no rhetorical-question headings.
- Headings name the section ("Upcoming events", not "Join the movement").
- Concrete over abstract: "353,000 meals served since 2014", not "countless lives touched". Every number has a source and an as-of date.
- No exclamation marks in headings or buttons.
- No internal or placeholder copy in production (the old donate page's "Thank you everyone for your support and attention to detail…" paragraph is the example).

## 4. Current state: what this refresh fixes

From the 2026-11-21 inventory of the current code:

| Problem today | Fixed by |
|---|---|
| Two generations of pages; older ones are hand-built with off-token colors (69 uses of Tailwind's default palette) | Tokens plus lint guardrails (§5, [03](03_IMPLEMENTATION_PLAN.md) slice 1.2) |
| Montserrat loaded but never applied; 27 font weights declared | §5.2 |
| Five overlapping layer patterns (Modal, Overlay, Takeover, ExpressiveCard, EventDetailsModal); only the events Modal is accessible | One Dialog primitive and one Disclosure (§6) |
| No skip link; mobile menu has no focus trap or Escape; 54 buttons without `type`; links nested in buttons | Shell and primitives (§6, §8); lint |
| Four pages without an `h1` | Page templates (§7) |
| Parallax, highlighter sweep and scroll-animated panels ignore reduced motion; auto-carousels with no pause | Motion policy (§5.8) |
| Impact counters render "$0K" until animated, and screen readers never get the real value | Stat component renders real values server-side (§6) |
| Newsletter promised site-wide, but no sign-up exists; the footer "Subscribe" goes to /members | Real sign-up (§9.9) |
| Membership copy contradicts itself (perks vs none); a nonexistent tier mentioned; three different cancellation instructions | Give flow and giving products (§9.7), content rules (§13) |
| Three conflicting volunteer-agreement instructions; PDFs and email | Volunteer flow with in-Hub signing (§9.6) |
| Program names, founder titles, phone and social handles vary across pages | Glossary (§13.3) |
| Dead links (`href=""`, buttons with no handler, partner cards with no href, a 404ing image fallback) | Page rebuild and e2e link checks |
| Raw `<img>` without alt on several carousels; generic alt text | Image wrapper requires `alt` or an explicit `decorative` (§6) |

## 5. Visual foundation

All tokens live in `src/app/globals.css` under Tailwind v4 `@theme`. Components reference tokens only.

### 5.1 Color

**Brand scales** stay as they are in `globals.css`: `primary` (navy, `primary-900` = `#0b1026`), `accent` (blue, `accent-500` = `#1b75bc`) and `neutral`. `neutral-950` is added so the scale is complete, and the stray Tailwind default neutral stops leaking in.

**Semantic tokens** (new). Components use these, not raw scale steps:

| Token | Use | Maps to *(mockup)* |
|---|---|---|
| `--color-surface` | Page background | `neutral-50` (white) |
| `--color-surface-muted` | Alternating section bands, table stripes | a light neutral step |
| `--color-surface-inverse` | Footer, dark bands | `primary-900` |
| `--color-text` | Body text | `primary-900` |
| `--color-text-muted` | Secondary text | a neutral step ≥ 4.5:1 on surface |
| `--color-text-inverse` | Text on inverse surfaces | white |
| `--color-border` | Dividers, input borders | a neutral step ≥ 3:1 for inputs |
| `--color-action` | Primary buttons, links | `accent-500` (white text on it = 4.86:1) |
| `--color-action-hover` | Hover/pressed | `accent-600` |
| `--color-focus` | Focus ring | `accent-500`, 2px ring + 2px offset |
| `--color-success` / `-warning` / `-danger` / `-info` | Status text, icons, alerts | values chosen in slice 1.1, each ≥ 4.5:1 on surface |
| `--color-*-subtle` | Status backgrounds | light tints of the above |

**Contrast rules:** body text ≥ 4.5:1; large text (≥ 24px, or ≥ 18.66px bold) ≥ 3:1; UI boundaries and icons that carry meaning ≥ 3:1. Color is never the only signal (status badges always have a word).

### 5.2 Typography

| Role | Font | Weights | Notes |
|---|---|---|---|
| Headings, display | Urbanist | 600, 700 | No vertical scaling (the current `scale-y-85` squash is removed) |
| Body, UI, eyebrows | Inter | 400, 500, 600, 700 | Eyebrows: Inter 600, uppercase, `tracking-wide`, `text-xs`/`text-sm` |

- Montserrat is removed. Load through `next/font` with the `latin` subset only (it covers Spanish). Prefer the variable font files, so the 27 declared weights become about 6.
- The redundant preconnect to fonts.googleapis.com is removed (`next/font` self-hosts).
- **Type scale:** the custom names (`md`, `xlg`, `xxlg`, `xxxlg`, `xxxxlg`) are replaced by Tailwind's standard scale, redefined in `@theme` *(mockup)*:

| Token | Size / line height | Typical use |
|---|---|---|
| `text-xs` | 0.75rem / 1rem | Fine print, eyebrows |
| `text-sm` | 0.875rem / 1.25rem | Captions, table cells, helper text |
| `text-base` | 1rem / 1.5rem (mobile body) | Body |
| `text-lg` | 1.125rem / 1.75rem (desktop body) | Body ≥ md, lead paragraphs |
| `text-xl` | 1.25rem / 1.75rem | h4, card titles |
| `text-2xl` | 1.5rem / 2rem | h3 |
| `text-3xl` | 1.875rem / 2.25rem | h2 |
| `text-4xl` | 2.25rem / 2.5rem | h1 (content pages) |
| `text-5xl` | `clamp(2.5rem, 5vw, 3.5rem)` / 1.1 | Home hero headline only |

- **Semantic heading level is separate from visual size.** `<Heading level={2} size="xl">` and similar. The current pattern of `<h3>` eyebrows for prices and card titles goes away.
- Body text is capped at about 70ch. Never justify text.

### 5.3 Spacing and layout

- Spacing uses Tailwind's 4px base. Only the scale steps in the allowlist are allowed (lint). Off-grid one-offs like `h-115` and `min-w-215` go.
- **Container:** page max width 1200px *(mockup)*. Gutters 20px (< md), 32px (md), 48px (≥ lg).
- **Section rhythm:** three tokens, `--space-section-sm` (48px), `--space-section` (72px) and `--space-section-lg` (96px) *(mockup)*. Sections never set their own padding.
- **Breakpoints:** Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280). Design and test mobile first at 360px wide.
- **Grids:** 12-column at ≥ lg; cards in 1 / 2 / 3 columns. No asymmetric decorative grids.

### 5.4 Radius

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 4px | Inputs, badges, small chips |
| `rounded-md` | 8px | Buttons, cards, images in cards |
| `rounded-lg` | 12px | Dialogs, the Hub, large media |
| `rounded-full` | 9999px | Avatars, icon buttons, status dots only |

`rounded-xl` through `rounded-4xl` are banned by lint.

### 5.5 Elevation and borders

- Prefer a 1px `--color-border` over shadows.
- Two shadows only: `--shadow-raised` (hover on interactive cards) and `--shadow-overlay` (dialogs, menus, popovers). Both are neutral and low-spread.
- Z-index tokens: `--z-header`, `--z-overlay`, `--z-toast`. This replaces today's `z-9998`.

### 5.6 Imagery and photography

- **Real TSOH photos only.** Aspect ratios: 16:9 (heroes), 4:3 (cards), 1:1 (team avatars), 3:2 (program galleries).
- **Text over photos and the hero video** sits on a flat tint (`primary-900` at about 60%) or in a solid caption band below the image. No gradient fades. Hero text must hold 4.5:1 against the brightest frame of the video once tinted; check this whenever the video is replaced.
- **Every image goes through the `Image` wrapper** (next/image). `alt` is required, or `decorative` must be set explicitly. Alt text describes the content ("Volunteers plating meals at Cornerstone Kitchen"), not "image" or the program name.
- **Consent:**
  - Volunteer sign-up includes a photo-consent checkbox. Guardian consent covers minors.
  - Guests receiving services are never shown identifiably without their consent.
  - Staff mark consent-cleared photos in Sanity (`consentCleared: true`). The frontend refuses uncleared images in Get Help and program contexts.
- **Phase 0 photo audit:** list usable photos per program and per page slot, flag gaps, and plan a shoot at an upcoming event if needed.
- **Formats:** Sanity CDN images with `next/image` sizes. Static heroes are WebP, at least 1600px wide.

### 5.7 Iconography

- One set: **Heroicons** (outline 24px for UI, solid 20px for small UI). `react-icons` is used only for social brand logos, or those become inline SVGs and `react-icons` is removed.
- Icons next to text are `aria-hidden`. Icon-only buttons require an accessible name; the `IconButton` type makes `label` mandatory.
- External links show a ↗ icon, plus visually hidden "(opens in a new tab)" when they open one.

### 5.8 Motion

| Token | Value |
|---|---|
| `--duration-fast` | 120ms (hover, color) |
| `--duration-base` | 200ms (disclosure, menu) |
| `--duration-slow` | 300ms (dialog and sheet enter) |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |

- **Allowed:**
  - Color and opacity transitions on hover and focus.
  - Dialog fade with a slight scale on desktop; the mobile takeover slides up.
  - Disclosure height animation.
  - The menu sheet.
- **Under `prefers-reduced-motion: reduce`:** no transforms or translations. Opacity changes only, at `--duration-fast` or less.
- **Hero video** (a core part of the site; the file is swapped manually by the project lead):
  - **Full-bleed background** on first view, with the eyebrow, tagline, intro and actions on top (flat tint, §5.6).
  - Muted, looped and `aria-hidden`, with a visible **Pause/Play** button. It pauses automatically when off screen.
  - **On scroll**, it eases from full width into a card inset 40px from each side with 12px corners, then scrolls away with the page. The scale is driven by scroll position (CSS scroll-driven animation, or a passive, rAF-throttled listener). It never blocks or hijacks scrolling.
  - With reduced motion, Save-Data or a slow connection: no shrink and no video; the poster image shows. This matches today's skip behavior.
- **Sponsor strip** (homepage, under the hero):
  - Logos loop horizontally at constant speed (one cycle about 40s) using a CSS transform on a duplicated list. The duplicate is `aria-hidden`.
  - It pauses on hover, on keyboard focus inside it, and with a visible **Pause/Play** button (WCAG 2.2.2).
  - With reduced motion, it doesn't move; logos sit in a static row that can be scrolled sideways.
- **Removed:** parallax, the highlighter sweep (`HighlightedText`), the scroll-animated sticky program panels, auto-advancing photo carousels, hover font-size growth (`Emphasis`), and count-up numbers.

## 6. Components

All components live in `src/components/ui/`. **Pages and features import only from there, never from the underlying library** ([ADR-0003](adr/0003-component-foundation-wrappers.md)). The library behind the wrappers (Vercel UI SDK, or React Aria Components as fallback) is picked by the Phase 0 spike.

| Component | Behavior and accessibility requirements |
|---|---|
| `Button` | Variants: `primary` (filled action color), `secondary` (outline), `tertiary` (text), `danger` (portal only). Sizes: `md` (44px tall, default) and `lg` (52px); `sm` (36px) in the portal only. Always has a `type`. A loading state disables it and announces "Working…" |
| `LinkButton` | A next/link styled as a button. Internal only |
| `TextLink` | Internal links (next/link). Underlined in body text |
| `ExternalLink` | `<a>` with `rel="noopener noreferrer"` and the ↗ icon. Opens a new tab only when `newTab` is set, which adds the visually hidden note |
| `HubLink` / `HubButton` | Opens a Hub state (`openHub({action:'give', type:'monthly'})`). Renders a real link with the query string, so it works with modifier-click and copy-link |
| `IconButton` | Requires `label`. 44×44 hit area |
| `Dialog` | Modal dialog: focus moves in and is trapped, Escape closes, focus returns to the trigger, background inert, scroll locked, labelled by its title |
| `HubDialog` | The Hub shell (§9.2) built on `Dialog`. Centered on desktop, full-screen on mobile |
| `Sheet` | Full-screen mobile menu, built on `Dialog` |
| `Menu` | Desktop "About" dropdown: arrow keys, Escape, typeahead, `aria-expanded` |
| `Select` | Native-feeling select (used by the language dropdown and the designation picker) |
| `Combobox` | Portal search and select (staff picker, event picker) |
| `Tabs` | Hub door tabs and the event details guest/volunteer toggle. Arrow-key navigation, `aria-selected` |
| `Disclosure` / `Accordion` | A real `<button aria-expanded>`. Collapsed content is not focusable. Replaces `ExpressiveCard` |
| `RadioGroup` / `RadioCards` | Amount presets, need tiles and type cards are radio groups, not loose buttons |
| `Field`, `Input`, `Textarea`, `Checkbox`, `Switch` | Integrated with react-hook-form + zod (§11). Visible label, hint, error tied with `aria-describedby`, `aria-invalid` |
| `DatePicker`, `Table`, `Pagination`, `Tooltip` | Portal only |
| `Toast` | Polite live region. Never the only place an outcome appears. Replaces the "Added To Cart" Takeover |
| `Alert` | Inline status (info, success, warning, danger) with `role="status"` or `role="alert"` as appropriate |
| `Badge` | Short status words ("Open to the public", "Volunteers needed", "Partner event", "Full") |
| `Card` / `LinkCard` | Whole-card click target uses one link stretched with a pseudo-element. No nested interactive elements |
| `Stat` | Impact number rendered as its real value in the server HTML, with a label and an as-of date. No animation |
| `Steps` | Hub step header progress ("Step 2 of 4" plus bar), announced on change |
| `Carousel` | Manual only (prev/next, counter "3 of 8", swipe). Off-screen slides are `inert`. Prefer a grid |
| `VideoHero` | Poster first, deferred video, Pause/Play control, reduced-motion and Save-Data skip |
| `YouTubeEmbed` | Click-to-load facade (thumbnail + play button) so YouTube loads only on request. Requires `title` |
| `Image` | Wraps next/image. `alt` required, or `decorative`. Sizes from the template |
| `Spinner`, `Skeleton`, `EmptyState` | One spinner, replacing five copy-pasted SVGs. Skeletons for lists. Empty states say what to do next |
| `SkipLink`, `VisuallyHidden` | Skip to `#main` |

## 7. Page templates

Every page uses exactly one template. Each template guarantees a single `h1`, landmark regions and consistent spacing.

| Template | Used by | Structure |
|---|---|---|
| `Landing` | Home | Custom hero → sections; the h1 lives in the hero |
| `Content` | Our Story, Careers, Contact, Partners & Sponsors, Privacy, Terms | `PageHeader` (h1, optional image and lead) → sections |
| `Program` | Five program pages | Hero (h1 + one line + image) → What it is → Who it serves → When and where → Upcoming events → How to help (Hub CTAs with the program pre-selected as designation) → Gallery (grid) → FAQ |
| `Listing` | Programs index, Events, News & Media, Team, Store | `PageHeader` → optional filters → grid or list → pagination or "load more" |
| `Detail` | Team profile, product detail | Back link → h1 → media + body → related |
| `Utility` | Cart, checkout, success, 404, 500 | Minimal heading, focused content, same header and footer |

`PageHeader` always renders the `h1` from a `title` prop; children never replace it. Section headings use `SectionHeading` (eyebrow optional, h2, optional lead).

## 8. Information architecture and navigation

### 8.1 Sitemap

```
/                                Home
/programs                        Programs index
/programs/{servingHope|educationHope|wellnessHope|outdoorHope|internationalHope}
/events                          Events (list); event details open in the Hub via ?event=
/about                           Our Story
/about/team, /about/team/[slug]  Team, profiles
/about/partners                  Partners & Sponsors (logo directory, sponsor tiers summary → Give → Business)
/media                           News & Media (stories, press, podcast, newsletter archive)
/media/awards                    Awards
/careers                         Careers (from /connect)
/contact                         Contact (form, map, hours; from /connect)
/store, /store/product/[id], /store/cart, /store/checkout, /store/success
/privacy, /terms                 Legal
/staff/...                       Staff Portal (private)
```

Program URL slugs stay as they are, to keep existing links. `/media/press` and `/media/podcast` become sections of `/media` and redirect to anchors.

### 8.2 Desktop header

```
[Logo]  Programs  Events  About▾  Store            🌐 English▾   Get Help   [Volunteer]  [■ Give ■]
```

- **Height and behavior:** solid surface background, 72px tall, sticky, with a 1px bottom border. One header style on every page, which removes `HeaderBlocker`, `HeaderContext` and the transparent-over-hero variant *(mockup)*.
- **About ▾** contains: Our Story · Team · Awards · News & Media · Partners & Sponsors · Careers · Contact.
- **Actions:** **Get Help** is a tertiary (text) button with an icon; **Volunteer** is secondary (outline); **Give** is primary (filled). All three open the Hub.
- **Language dropdown:** hidden while only one language is enabled (§8.6).
- **Cart:** a cart icon with count appears in the header only when the cart has items.
- **Current section** is marked with `aria-current="page"` and a visible underline.

### 8.3 Mobile header and menu

```
[Logo]                         Get Help  [■ Give ■]  ☰
```

- 60px tall. Get Help and Give stay visible in the bar. Volunteers mostly arrive through event links and QR codes that open their flow directly.
- **☰** opens a full-screen `Sheet`:
  1. Close button and language dropdown.
  2. Three large action tiles: **Get Help · Volunteer · Give**.
  3. Nav links: Programs (expands to the five programs) · Events · About (expands) · Store.
  4. Contact line (phone, email).
- Focus is trapped, Escape closes the menu, the background is inert and scroll locked, and the menu closes on navigation.

### 8.4 Footer

- **Brand:** logo, one factual line about TSOH, Candid seal.
- **Get involved:** Get Help · Volunteer · Give · Community Sponsors. These open the Hub.
- **Organization:** Our Story · Team · Awards · News & Media · Careers · Contact.
- **Contact:** address, phone `(469) 969-0244`, email, social icons with accessible names.
- **Newsletter:** email field plus "Sign up" (§9.9).
- **Legal row:** © year · EIN · Privacy · Terms · language dropdown (hidden while English only).
- No parallax band.

### 8.5 Redirects

| Old URL | Goes to |
|---|---|
| `/donate` | `/?action=give&type=once` |
| `/members` | `/?action=give&type=monthly` |
| `/sponsor` | `/?action=give&type=business` |
| `/planned-giving`, `/giving` | `/?action=give&type=planned` |
| `/connect` | `/contact` |
| `/media/press`, `/media/podcast` | `/media#press`, `/media#podcast` |
| `/awards`, `/serve/*` | Kept as today (`/media/awards`, `/programs/*`) |
| `/[slug]` (legacy team URLs) | `/about/team/[slug]` (kept) |

All redirects are permanent (308) and preserve incoming query strings, including UTMs. Accepted trade-off: search results for "donate" and "planned giving" land on the homepage with the Hub open, not on a dedicated page.

### 8.6 Language dropdown

- `🌐 English ▾` lists each enabled language in its own language ("English", "Español"). No flags. Each option has a `lang` attribute.
- Choosing a language goes to the **same page** in that language and remembers the choice in a cookie.
- Hidden entirely while only English is enabled. Shown automatically when a second locale is switched on.

## 9. The Action Hub

### 9.1 Concept

One overlay holds every action. It opens from any page through query parameters. There is no separate page version ([ADR-0002](adr/0002-query-param-action-hub.md)). The URL contract is defined in [02_SYSTEM_DESIGN.md §3](02_SYSTEM_DESIGN.md#3-action-hub-url-contract).

| Opened with | Shows |
|---|---|
| `?action=help` | Get Help |
| `?action=volunteer` | Volunteer |
| `?action=give&type=once\|monthly\|planned\|business` | Give |
| `?event=<slug>` | Event details (no tabs) |

### 9.2 Shell anatomy

**First step of a flow (door landing):**

```
┌────────────────────────────────────────────┐
│  [ Get Help ]  [ Volunteer ]  [■ Give ■]  ✕│  ← Tabs: switch doors
├────────────────────────────────────────────┤
│  (door landing content)                    │
└────────────────────────────────────────────┘
```

**Later steps:**

```
┌────────────────────────────────────────────┐
│ ←  Volunteer · Step 2 of 4               ✕ │  ← Back, title, close
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░                       │  ← Steps progress
├────────────────────────────────────────────┤
│  (scrolling content)                       │
├────────────────────────────────────────────┤
│                        [ Back ] [Continue] │  ← fixed action bar
└────────────────────────────────────────────┘
```

- Tabs appear **only** on a door's first step, so switching doors never wipes progress mid-flow.
- The action bar holds at most one primary and one secondary action. The primary label names the result ("Continue", "Give $50", "Submit sign-up").
- Errors appear at the field and in a summary at the top of the step, which receives focus on a failed submit.
- Event details use the same shell without tabs.

### 9.3 Layout and behavior

| | Desktop (≥ md) | Mobile (< md) |
|---|---|---|
| Container | Centered dialog, 640px wide, max height 85vh, `rounded-lg`, `--shadow-overlay` | Full-screen takeover (`100dvh`), respects safe areas |
| Enter | Fade + slight scale (`--duration-slow`) | Slide up (`--duration-slow`) |
| Page behind | Dimmed, inert, scroll locked | Covered |
| Scrolling | Content scrolls; header and action bar stay fixed | Same |
| Dismiss | ✕, Escape, backdrop click on door landings only | ✕ only. **No swipe-to-dismiss** |

**Rules:**

- **History:** opening from a page pushes a history entry, so Back closes the Hub. Each step is its own history entry, so Back returns to the previous step. After a submit or payment, the completion step **replaces** history, so Back closes the Hub instead of returning into a finished form.
- **Drafts:** form state is kept in `sessionStorage` per flow while the tab is open. Closing and reopening resumes where the person left off. Drafts are cleared on completion, and never kept for payment details. There is no "are you sure?" prompt, except after a payment has started.
- **Deep-link normalization:** a link to a later step without the data it needs opens the first incomplete step.
- **Focus:** on open, focus goes to the dialog title. On close, it returns to the element that opened the Hub. When the Hub was opened by a URL, focus goes to `#main`.
- **Closing** removes only Hub parameters and keeps UTMs and anything else in the query string.
- **Without JavaScript:** Hub links resolve to the homepage. Accepted: the payment and signing integrations need JavaScript anyway.

### 9.4 Event details (two-sided)

```
[ Hero image ]
Serving Hope Meal Service                [Open to the public] [Volunteers needed]
Fri, Dec 25 · 9:00–11:30 a.m. CT · Cornerstone Kitchen, Dallas   Get directions ↗
[ For guests | For volunteers ]          ← Tabs; opens on the side you came from
```

- **For guests:** who it's for, what to bring, cost ("Free"), accessibility, languages spoken, and "Just come" or how to start.
- **For volunteers:** shifts with spots left (or "Full"), minimum age and accompaniment rule, the agreement required, what to wear, and what to expect. CTA: **Volunteer at this event** → `?action=volunteer&event=<slug>&step=shift`.
- **Partner event:** "Partner event" badge, the partner's name and **Sign up on {partner} ↗**. No internal sign-up.
- **Always:** Add to calendar (.ics) and Copy link.
- The guest side is shown only if the event has guest info, and the volunteer side only if it has shifts. The toggle appears only when both exist.
- **Opening side:** from Get Help, the guest side; from Volunteer or a volunteer link, the volunteer side; otherwise the volunteer side if both exist. Override with `&view=guest|volunteer`.

### 9.5 Get Help

The audience may be stressed, on a phone, on slow data and reading in a second language. Copy targets a 6th–8th grade reading level. Images are small and few. There are no forms, no ad or tracking pixels, and nothing personal is collected.

1. **What do you need?** Radio tiles: **Food** · **Health care** · **Tutoring & school** · **Outdoor programs** · **Something else**.
   - "Something else" shows an inline panel: "Dial 211 or visit 211texas.org for help with housing, bills, food and more."
2. **Matching services and events.** Services for that need come from Sanity. Upcoming events with guest info come from the database, each showing its next date ("Next meal service: Fri, Dec 25"). Each item has a **Details** link.
3. **Detail.** Who it's for · When · Where (address + Get directions ↗) · What to bring · Cost · How to start · Languages offered · Questions? (phone).
   - How to start is one primary action: **Call (469) 969-0244**, **Apply online ↗** (external form), or **Just come**.
   - An event's detail is its guest side (§9.4).

A persistent footer sits in the Hub on every Get Help step:
> In an emergency, call **911**. In a mental-health crisis, call or text **988**. For other needs, dial **211**.

Deep links for flyers and QR codes: `?action=help&need=food`, `&service=<slug>`, `&event=<slug>`.

Known services today, to be confirmed and completed as content in Sanity:

| Need | Service | How to start |
|---|---|---|
| Food | Meal service at TSOH events (food is only given out at our events) | Just come; see event dates |
| Health care | Wellness of Hope clinic | Apply online (external form) |
| Tutoring & school | Education for Hope tutoring | Apply online (external form) |
| Tutoring & school | Education for Hope scholarships | *Content task: confirm the process* |
| Outdoor programs | Hope for the Outdoors | Email or call |

### 9.6 Volunteer

**Steps:** `event` → `shift` → `people` → `review` → `sign` → `done`. `event` is skipped when the link includes `&event=`.

1. **Choose an event.** Upcoming events that have shifts, as cards showing date, place and spots left. A "How volunteering works" disclosure covers what to expect, the agreement, age rules and the FAQ.
2. **Choose shift(s).** Checkbox cards with time and spots left. Full shifts are disabled and labelled "Full". No waitlist at launch.
3. **Who's coming?**

    ```
    Who's coming?   (●) Just me   ( ) Me and others

    You     First name · Last name · Email · Phone · Age [18 or older ▾]
            ☐ It's OK to include me in event photos

    + Add a person
      Alex Rivera   18 or older   alex@…                       → gets their own email to finish
      Mia Rivera    Under 18      ☑ I'm their parent or guardian → you sign for Mia
    ```

    - Age is a choice of "18 or older" or "Under 18" plus birth year for minors (to apply the event's minimum age and accompaniment rule). No full birth date.
    - **Adults** added to a party need an email. They get their own email to confirm details and sign.
    - **Minors:** if the registrant is their parent or guardian, the registrant signs for them now. If not, a guardian email is required and the guardian gets the form.
    - **The registrant is a minor:** a guardian email is required, and the guardian signs.
    - Each person has a photo-consent checkbox; a guardian's consent covers their minor.
    - **Party limit: 10 people.** Larger groups see "Planning a group of more than 10? Contact us" (opens contact).
    - Inline validation explains the event rules ("Mia is under 16, so an adult in your party must also attend").
4. **Review.** One summary: event, shifts, each person. It spells out who signs what:
   > You'll sign for: You, Mia. We'll email Alex to finish their own form.

   Submit = **Sign up**.
5. **Sign.** If the registrant (and the minors they sign for) already hold valid agreements, this step is skipped. Otherwise it offers:
   - **Sign now:** DocuSign embedded signing inside the Hub. One session covers the registrant's agreement plus one per minor they sign for, plus the Serving Hope addendum where required.
   - **Email me the link instead.**
6. **Done.**
   - Confirmation showing what happens next: who still needs to finish, the cutoff time ("Agreements must be signed by Thu, Dec 24 at 9:00 a.m. CT"), what to bring and where to go.
   - Add to calendar.
   - A note that the confirmation email has a **Manage your sign-up** link.

**Emailed-link steps** (each link is exchanged for a short session, then removed from the URL; see [02 §5.5](02_SYSTEM_DESIGN.md#55-emailed-links-no-accounts)):

| Step | Who | What they do |
|---|---|---|
| `complete` | An adult added to a party | Confirm name and phone, check age, photo consent, sign |
| `guardian` | A guardian not in the party | Review the minor's details, sign for them, photo consent |
| `manage` | The registrant | See each person's status, add or remove people, change shifts, cancel |
| `finish` | Someone imported from an Eventbrite RSVP | Add party details and sign: the normal flow, prefilled |

**Reminder and cutoff copy** follows the policy in [02 §5.4](02_SYSTEM_DESIGN.md#54-agreement-policy-and-cutoff): plain, dated, one action ("Sign your agreement").

### 9.7 Give

**Door landing:** four type cards (radio cards, 2×2): **One-time** · **Monthly** · **Planned giving** · **As a business**. The `type` parameter pre-selects one.

**One-time and Monthly:** steps `amount` → `details` → `payment` → `done`.

1. **Amount.**
   - Presets: one-time **$25 / $50 / $100 / $250**, default $100; monthly **$15 / $25 / $50 / $100**, default $25. A custom amount field (minimum $5 *(mockup)*).
   - Impact line under the selection: "About {n} meals". The ratio is staff-editable in Sanity *(content task)*.
   - Optional **Direct my gift to:** select with "Where it's needed most" (default) and the five programs. Program pages pre-select their program.
   - Optional disclosure **Give in honor or memory of someone:** honor or memory, plus a name. No honoree notification at launch.
   - **☐ Add 3% to cover card processing fees**, unchecked by default. The added amount is shown.
2. **Details.** First name, last name, email. Address only if the payment method requires it.
3. **Payment.**
   - A summary line ("$100 one-time gift to Where it's needed most").
   - Stripe Payment Element (cards, Apple Pay, Google Pay, bank transfer as enabled) and a PayPal button.
   - The primary button shows the amount ("Give $100", "Give $25 monthly").
   - Amounts are calculated on the server only.
4. **Done.**
   - Thank-you with the amount, and "A receipt is on its way to {email}".
   - Monthly: "Manage or cancel any time from the link in your receipt." This is the single cancellation message site-wide; the link opens Stripe's customer portal.
   - Share link.

**Planned giving:** steps `learn` → `inquiry` → `done`.
- **Learn:** a short explanation from Sanity (gifts in a will, beneficiary designations, and so on) plus "What happens next". It states clearly that the form is a request for a conversation, not a legal document.
- **Inquiry:** name, email, phone (optional), preferred contact method, message (optional). Never estate documents, account numbers or asset details.
- **Done:** "We'll contact you within {n} business days" *(content task: n)*.

**As a business (Community Sponsors):** steps `tiers` → `details` → `payment` → `done`, or `tiers` → `inquiry` → `done`.
- **Tiers:** tier cards from Sanity (name, price per month, benefits, about {n} meals a year). A "Talk to us first" link goes to the inquiry.
- **Details:** business name, contact name, email, phone, and "OK to list our logo in the partner directory" (checkbox).
- **Payment:** a Stripe subscription, as for monthly giving.

**Receipts** come from TSOH (Resend), not Stripe's default receipts. They include the IRS acknowledgment statements ([02 §6](02_SYSTEM_DESIGN.md#6-integrations)).

### 9.8 Hub states

| State | Treatment |
|---|---|
| Loading data for a step | Skeleton of the step layout. The action bar is disabled with "Loading…" |
| Network or server error | Inline `Alert` with "Try again". Form input is kept |
| Payment declined | Field-level message from Stripe in plain words, and the payment form stays open |
| Nothing to show (no upcoming volunteer events) | `EmptyState`: "No volunteer shifts are open right now." plus a newsletter sign-up and a link to programs |
| Event full | Shift disabled, "Full", with a link to other events |
| Past cutoff | "Sign-ups for this event have closed." |

### 9.9 Small actions outside the Hub

- **Newsletter sign-up** (footer and News & Media):
  - One email field plus **Sign up**, with a honeypot and rate limiting.
  - Adds the address to the Constant Contact list. Constant Contact handles confirmation and unsubscribe.
  - Success: "You're on the list."
  - Copy never promises anything Constant Contact doesn't do.
- **Contact form** (`/contact`): name, email, phone (optional), topic, message (textarea). Same standards as §11.

## 10. Page specs

### 10.1 Home

1. **Hero:**
   - The full-bleed background video, which shrinks on scroll (§5.8).
   - Today's copy, unchanged: the eyebrow "The Source of Hope", the tagline "Empowering and providing hope through education, health, and wellness", and the intro paragraph (desktop only, as today).
   - Actions: **Give · Volunteer · Get Help**.
2. **Sponsor strip:** "Our sponsors", with logos in a constant-speed loop (§5.8). Every sponsor is shown equally, with no tiers. The list is **static, in code** (`src/content/sponsors.ts`: name, logo path, optional link), not in Sanity. The logos are placeholders until the project lead supplies the files.
3. **Impact numbers:** 4–5 `Stat`s with real values and "as of {year}".
4. **Upcoming events:** the next three, each with Volunteer and Open-to-the-public badges and Details (opens the Hub).
5. **Programs:** five cards linking to program pages.
6. **Latest story:** the newest publication, plus "More news".
7. Footer.

Removed: the duplicate donate band, the "Get Involved" parallax card and the auto-advancing photo carousel. Section headings stay plain ("Upcoming events", "Our programs"), with no taglines.

### 10.2 Programs index

`Listing`: a one-paragraph intro, then five program cards (image, name, one line, "Learn more"). The "Serving Guidelines" accordions move to the Serving Hope page.

### 10.3 Program pages

`Program` template, with content from Sanity. Each page has:
- **Upcoming events**, filtered to that program.
- **How to help:** Volunteer opens the Hub filtered to the program's events. Give opens with the program pre-selected as designation.
- **For participants:** a link into Get Help for that need. Example: Wellness opens `?action=help&need=health`.

Dead links and buttons are fixed. Program-specific external forms open with `ExternalLink`.

### 10.4 Events

`Listing`:
- **Filter chips:** All · Volunteer · Open to the public · Partner events.
- **Upcoming:** events grouped by month, as cards. Details open in the Hub.
- **Every month:** recurring programs.
- **Recent:** the last six past events, collapsed.

Each event emits schema.org `Event` structured data for Google's event results. The old "Volunteer agreements" PDF section is removed; agreements are signed in the Hub.

### 10.5 About: Our Story

`Content`: mission, vision, history, founders (titles per glossary), Candid seal, and a short "How we work" section. The closing CTA uses the Hub actions.

### 10.6 Team and profiles

`Listing` grouped by team group, as a card grid; the carousel is removed. Profiles use `Detail` with one h1 (the name), title, bio and photo.

### 10.7 News & Media and Awards

**News & Media** (`Listing`), sections:
- Stories and updates
- Press (YouTube facades with real titles)
- Podcast (Spotify embed; Vietnamese text marked `lang="vi"`)
- Newsletter archive
- Newsletter sign-up

**Awards** keeps its current, newer structure, restyled.

### 10.8 Partners & Sponsors, Careers, Contact

- **Partners & Sponsors** (`Content`):
  - Sponsor logos from the same static list as the homepage strip (`src/content/sponsors.ts`), shown as a grid.
  - Community Sponsor tiers summary, with **Become a sponsor** (opens Give → Business).
  - Partner-event note.
- **Careers** (`Content`): open roles or a Handshake link.
- **Contact** (`Content`): the form, hours, a map (iframe with `title`, or a static map with a directions link), and phone and email in glossary format.

### 10.9 Store

Restyle and fixes only; no new features.
- Every page uses the tokens and templates.
- Product cards have no nested button-in-link. "Added to cart" is a `Toast`.
- The cart's size and quantity inputs have associated labels. Fee wording is store-specific ("Add 3% to cover card processing").
- Partner promo cards get real links.
- The product not-found page returns 404.
- The Add to Cart button is no longer emerald; it uses the primary button.
- Cart and checkout stay as pages (`Utility`) and do not use the Hub.

### 10.10 Legal pages

`/privacy` and `/terms` (`Content`). The developer drafts them from what the system actually collects ([02 §8](02_SYSTEM_DESIGN.md#8-security-privacy-and-retention)); TSOH has them reviewed. Both are linked in the footer and at every form that collects personal data.

### 10.11 System pages

- `not-found` (404): plain message, search-free, with links to Home, Events and Get Help.
- `error` (500): an apology, Try again, and contact details.
- `loading`: template skeletons, no spinner-only screens.

### 10.12 Styleguide

`/styleguide` exists on development and preview deployments only (404 in production, `noindex`). It shows every token, component, state and template. Accessibility tests run against it in CI.

## 11. Forms standard

- **Stack:** react-hook-form + zod. The same zod schema validates on the server.
- **Labels:** every field has a visible `<label>`. Placeholders are examples only, never the label.
- **Required fields:** mark the *optional* ones ("Phone (optional)"). Most fields are required.
- **Validation:**
  - Validate on blur, then on change once a field has an error.
  - Errors are specific ("Enter an email like name@example.com").
  - On submit with errors, focus the error summary.
- **Autocomplete:** use correct `autocomplete` and `inputmode` values (`email`, `tel`, `given-name`, `postal-code`) and `type` attributes.
- **Redundant entry:** never ask for the same information twice in a flow (WCAG 3.3.7). Prefill from earlier steps and emailed links.
- **Spam:** honeypot plus server-side rate limiting on every public form. No CAPTCHA unless abuse appears.
- **Status:** submit buttons show a loading state. Outcomes appear in a live region and stay on screen.
- **Personal data** never goes into URLs, analytics events or client logs.

## 12. Accessibility standard

WCAG 2.2 AA is an acceptance criterion for every PR. In practice:

- **Structure:**
  - One `h1` per page, logical heading order, landmarks (`header`, `nav`, `main#main`, `footer`).
  - Skip link first.
  - `lang` set on `<html>` and on any foreign-language passage (WCAG 3.1.1, 3.1.2).
- **Keyboard:**
  - Everything works by keyboard.
  - Visible focus that is never obscured by the sticky header or the action bar (2.4.11). The header's height is reserved with `scroll-padding-top`.
- **Targets:** at least 24×24 CSS px (2.5.8); our standard is 44×44 for primary controls.
- **Dialogs and menus:** behave as specified in §6. No hover-only content.
- **Motion:** §5.8. Nothing auto-plays with movement except the muted hero video, which can be paused (2.2.2).
- **Consistency:**
  - Navigation, the Hub actions and help (phone and contact) appear in the same place on every page (3.2.3, 3.2.6).
  - The same function has the same name everywhere (3.2.4). "Give" is always "Give".
- **Authentication:** staff magic links and emailed volunteer links need no memorization or puzzle (3.3.8).
- **Media:** YouTube embeds have titles. The press videos need captions; YouTube's auto-captions are checked and corrected where possible.
- **Zoom and reflow:** usable at 400% zoom and 320px width without horizontal scrolling (1.4.10). Text spacing overrides don't break layouts (1.4.12).
- **Testing:**
  - axe in Playwright on every route and Hub step.
  - A manual keyboard pass on every PR that touches UI.
  - Manual VoiceOver (iOS, macOS) and NVDA (Windows) passes on the key journeys at Phase 8.

## 13. Content and voice

### 13.1 Voice

From [BRAND_CONTENT_RULES](../organizers/BRAND_CONTENT_RULES.md): professional, community-focused, hopeful and service-oriented, clear and respectful. Combined with the never-rules (§3), that means short sentences, concrete facts, active voice and plain words.

### 13.2 Conventions

| Item | Convention |
|---|---|
| Dates | "Fri, Dec 25" · with year when not this year: "Fri, Jan 8, 2027" |
| Times | "9:00–11:30 a.m. CT". Always Central time, always labelled CT |
| Money | "$1,234.50", or "$50" when whole |
| Phone | `(469) 969-0244` |
| CTA labels | Verb first, specific: "Give $50", "Sign up", "Sign your agreement", "Get directions" |
| Program names | Exactly as in the glossary, every time |
| "Volunteer agreement" | The term in all UI copy (not "waiver" or "form") |
| Get Help copy | 6th–8th grade reading level; second person; one idea per sentence |

### 13.3 Glossary (official names)

| Thing | Official form | Status |
|---|---|---|
| Organization | The Source of Hope (TSOH after first use) | Confirmed |
| Programs | Serving and Sharing Hope · Education for Hope · Wellness of Hope · Hope for the Outdoors · Hope Beyond Borders | Confirm whether "Clinic" is part of Wellness of Hope's name |
| Retired names | "International Partner Serving", "Hope For The Great Outdoors" | Do not use |
| Founders' titles | — | *Content task* |
| Instagram | — | *Content task* (`sourceofhope` vs `thesourceofhope`) |
| Phone | (469) 969-0244 | Confirmed |
| Giving products | One-time gift · Monthly giving (recognition only, no perks) · Planned giving · Community Sponsors (business tiers) | Tier names *content task* |
| Hub actions | Get Help · Volunteer · Give | Confirmed |

### 13.4 Copy fixes carried into the rebuild

- **Membership:**
  - Individuals: "monthly giving", with no perks or pins.
  - Business sponsor benefits live only on the tiers.
  - No mention of nonexistent tiers.
- **Cancellation:** one message (§9.7).
- **Fees:** donation wording for gifts; store wording for purchases.
- **Volunteer agreement instructions:** replaced by the Hub flow; no PDFs or email instructions.
- **Newsletter:** promises only what Constant Contact does.
- **Founders, programs, phone and social:** per the glossary.

## 14. Localization readiness (design side)

English is the only visible language at launch ([ADR-0004](adr/0004-localization-ready-english-first.md)). Every design is built so another language can be switched on without a redesign:

- **Text in code:** all UI text comes from message files or Sanity. No hard-coded strings in components; lint enforces this.
- **Room to grow:** buttons, tabs, nav and cards fit labels about 1.5× longer. Text wraps and never truncates actions. Avoid fixed-width pills.
- **No text in images.**
- **Direction-neutral styles:** logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) in new components.
- **Formatting:** dates, money and numbers through locale-aware formatters (`es-US` for Spanish, not `es`).
- **Third-party widgets** (Stripe, PayPal, DocuSign) receive the page locale.
- **Font coverage:** Urbanist lacks Vietnamese glyphs. When Vietnamese is added, `:lang(vi)` headings fall back to a font with Vietnamese support (e.g. Be Vietnam Pro). Chinese uses a system font stack.

## 15. Staff Portal UX

- **Look:** same tokens and components as the public site; denser (`sm` buttons, tables). Light only, English only.
- **Layout:**
  - Left sidebar showing only the sections the person has access to, and a top bar (name, sign out).
  - Content is list → detail pages; drawers only for quick views.
- **Overview:** today's and upcoming events with sign-up and agreement counts, items needing attention (pending agreements, intake matches to review, new inquiries), and quick actions (**Create event**, **Copy link**, **Create QR**, **Print roster**, **Review pending agreements**).
- **Event editor:**
  - A guided form in sections: Basics · Guest info · Volunteer info (shifts) · Images · Publishing.
  - A preview pane with tabs: **Website · Eventbrite · Facebook packet**.
  - Required fields are checked per selected platform.
  - **Publish selected platforms** shows a per-platform status chip (Published · Failed — Retry · Manual post needed).
- **Volunteers:** filter by event, shift and status, then the roster table. Shows each person's agreement status with resend. Exceptions need a reason and are logged.
- **Print roster:** a print-optimized page and PDF showing name, shift, agreement indicator and a check-in box. Contact details appear only with the contact permission.
- **Check-in mode** (phone or tablet):
  - A large search field and a list with one-tap **Check in** (44px+ targets).
  - Counts at the top (checked in / expected).
  - Undo for five seconds.
  - No offline mode at launch; the printed roster is the fallback.
- **People & Access:** invite by email, a switch per permission grouped by area, an Admin switch with a clear warning, deactivate, and an audit log view.
- **Destructive actions** (cancel, remove, revoke) use a confirmation `Dialog` that names the target.

## 16. Analytics and privacy UX

- **Tools:** Vercel Analytics and the existing GTM container stay. No ad or retargeting pixels load inside the Hub or on Get Help content.
- **Funnel events (no personal data, no amounts):**
  - `hub_open {door, source_path}`
  - `hub_step {door, type?, step}`
  - `hub_complete {door, type?}`
  - `hub_close {door, step}`
- **Attribution:** UTM parameters are captured server-side onto registrations, gifts and inquiries ([02 §3](02_SYSTEM_DESIGN.md#3-action-hub-url-contract)).
- **Cookies:** no cookie banner while there are no ad pixels. Adding ad pixels later requires revisiting consent first.

## 17. Design QA checklist (every UI PR)

- [ ] Uses templates and `ui/` wrappers only. No direct library imports, no default palette, no banned radius.
- [ ] Never-rules (§3) respected in visuals and copy.
- [ ] One `h1`, correct heading order, landmarks present.
- [ ] Keyboard pass: everything reachable, visible focus not obscured, Escape closes overlays, focus returns.
- [ ] axe clean in Playwright for the touched routes and steps.
- [ ] Works at 360px wide and at 400% zoom without horizontal scroll.
- [ ] Reduced motion: no transforms; nothing auto-moves.
- [ ] Images have real alt text or are marked decorative; photos are consent-cleared where required.
- [ ] Copy follows §13. Names match the glossary. No hard-coded strings outside message files and Sanity.
- [ ] Labels fit at 1.5× length (pseudo-localized screenshot in the PR for new components).
- [ ] No personal data in URLs, analytics events or logs.
- [ ] Screenshots (mobile and desktop) attached to the PR for review on the `refresh` preview.

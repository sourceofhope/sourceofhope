# 00 · Overview

**Status:** Approved baseline, 2026-11-21. **Owner:** project lead (reviews every phase).

## In one paragraph

We are rebuilding thesourceofhope.org on its current stack (Next.js 16, Tailwind v4, Sanity, Stripe, PayPal, Resend, Vercel) with a consistent design system and a reworked information architecture. Every page gets three actions in the header: **Get Help**, **Volunteer** and **Give**. Each opens one shared overlay, the **Action Hub**, from any page. Behind it we add a **Staff Portal** at `/staff` and a PostgreSQL database (Supabase), so staff enter each event once, publish it, take volunteer sign-ups with agreements, run rosters and check-in, and follow up on giving. The site launches in English, built ready for more languages. All of this reaches the public in **one cutover**, after a staff soft launch and a full dress rehearsal.

## Goals

1. **One clear way to act.** A visitor on any page can get help, volunteer or give in a focused flow without hunting through pages.
2. **One record per event.** Staff create an event once. The website, Eventbrite and a Facebook post packet come from that one record, and our system holds the only roster.
3. **Consistency that lasts.** One set of tokens, components and page templates, enforced by lint rules and CI, so new pages cannot drift.
4. **Accessible to everyone.** WCAG 2.2 AA on every page and flow, mobile first, reduced motion honored.
5. **Clean and professional, never "vibecoded".** Real photos, restraint, plain words. No AI-template tells (see the never-rules in the design spec).
6. **Ready to grow.** Localization-ready from day one (Spanish first when we switch it on), and an operational backend we can extend.

## Non-goals (for this release)

- A full rebrand. The logo, navy and blue palette, and Urbanist and Inter type stay.
- Dark mode, on the public site or in the portal.
- Spanish or any second language *required* at launch. It is an optional pass that goes live only if it passes checks.
- Registration or data collection for people seeking services. Get Help is read-only.
- Inventory management for the store.
- A volunteer or donor account system. People use secure emailed links instead.
- Replacing QuickBooks (accounting) or Constant Contact (newsletters).
- A free-form page builder in Sanity.

## Audiences, in priority order

| Priority | Audience | Primary door | What they need |
|---|---|---|---|
| 1 (tied) | Prospective volunteers: individuals, families, school and corporate groups | Volunteer | Find an event and shift, bring their party, sign the agreement, know what to expect |
| 1 (tied) | Donors: one-time, monthly, planned, business | Give | Give in under a minute on a phone, with a trustworthy receipt |
| 2 | Community members seeking services | Get Help | Where and when food is served, how to join programs, who to call, in plain language |
| 3 | Partners, sponsors, press, grantmakers | About → Partners & Sponsors, News & Media | Credibility, impact, contact |
| 4 | Store shoppers | Store | Browse, buy, see the impact |
| — | Staff | Staff Portal | Enter once, publish, track, print, check in, close out |

## Scope of the single release

| Area | In the release |
|---|---|
| Design system | Tokens, typography, component wrappers, page templates, `/styleguide`, lint guardrails |
| Shell | New header (desktop and mobile), full-screen mobile menu, footer with newsletter sign-up, skip link, error, loading and 404 states |
| Public pages | Home, Programs (index + 5 program pages), Events, About (Our Story, Team and profiles, Awards, Careers, Contact), Partners & Sponsors, News & Media, Store (restyle + fixes), Privacy Policy, Terms |
| Action Hub | Event details (two-sided), Get Help, Volunteer (with parties and in-Hub signing), Give (one-time, monthly, planned, business) |
| Staff Portal | Overview, Events & Publishing, Volunteers & Agreements, Campaign Links, Giving & Memberships, Planned Giving, Sponsors, Store Orders, Reports, People & Access, Integrations |
| Data | PostgreSQL (Supabase) schema with migrations, staff auth, permissions, audit log, webhook ledger |
| Integrations | Stripe, PayPal, DocuSign (embedded signing + Connect), Eventbrite (publish + RSVP intake), Constant Contact (list sign-up), Resend (all transactional email), Facebook (manual post packet) |
| Content | Structured Sanity types, migration to a new `production-v2` dataset, content glossary |
| Localization | Infrastructure for multiple languages (English only shown). Optional Spanish pass, translated once |
| Quality | CI (lint, types, unit, e2e, accessibility), security hardening, performance budgets |

## How the release works

- All work lands on a long-lived **`refresh`** branch with its own preview domain, a **staging** Sanity dataset, a staging Supabase project and sandbox credentials ([ADR-0001](adr/0001-single-release-on-v2-branch.md)).
- The current site keeps running from `development` → `production` as it does today. `development` is merged into `refresh` weekly so fixes carry forward.
- The project lead reviews each phase on the `refresh` preview before the next phase starts.
- Before the public switch, staff use the portal on the **production** database (staff soft launch), then run one real event end to end (dress rehearsal).
- The public cutover moves the domain to the v2 deployment. Rollback points it back to the old deployment, whose Sanity dataset is never touched.
- There are no hard dates. Phases are ordered by dependency.

## Decision log

Every settled decision, with where it is specified. "Spec" = [01_UI_UX_DESIGN_SPEC.md](01_UI_UX_DESIGN_SPEC.md), "System" = [02_SYSTEM_DESIGN.md](02_SYSTEM_DESIGN.md).

### Process and release

| Decision | Where |
|---|---|
| Plan lives in `docs/plan/`, plus a shared staff and board summary doc | This folder |
| Refresh depth: **evolve**. Keep brand marks; rebuild design system, IA and key journeys | Spec §1 |
| One visual direction ("refined current"), approved as a mockup in Phase 0, then designed in code | [ADR-0008](adr/0008-refined-current-visual-direction.md) |
| Everything ships as one public release; no year-end change freeze (current site continues independently) | [ADR-0001](adr/0001-single-release-on-v2-branch.md) |
| `refresh` branch, preview domain, staging dataset and database, sandbox keys; in-flight branches `feature/membership-launch` and `sid-development` are ignored | [ADR-0001](adr/0001-single-release-on-v2-branch.md) |
| Project lead reviews every phase on the preview; no deadlines | Implementation plan |
| Staff soft launch on the production database before the public switch | [04_LAUNCH_AND_CUTOVER.md](04_LAUNCH_AND_CUTOVER.md) |
| Launch gate: exit criteria, dress rehearsal, payment matrix, accessibility audit, performance budgets, runbook with rehearsed rollback | [04_LAUNCH_AND_CUTOVER.md](04_LAUNCH_AND_CUTOVER.md) |
| Build order: phases 0–9 as listed | [03_IMPLEMENTATION_PLAN.md](03_IMPLEMENTATION_PLAN.md) |

### Design and UX

| Decision | Where |
|---|---|
| WCAG 2.2 AA, mobile first, last two versions of evergreen browsers + iOS Safari 16+, reduced motion honored | Spec §12 |
| Light only, public site and portal | Spec §5 |
| Written never-rules for visuals and copy (no decorative gradients, glass, glows, sparkles, slogan taglines…) | Spec §3 |
| Retire parallax, highlighter sweep, scroll-animated panels, auto-advancing carousels, hover font growth, squashed eyebrows; counters render real values server-side; hero video keeps a pause control | Spec §5.8 |
| Components: Vercel UI SDK preferred, React Aria Components fallback, chosen by Phase 0 spike; pages import only our `ui/` wrappers | [ADR-0003](adr/0003-component-foundation-wrappers.md) |
| Action Hub = one query-param overlay openable from any page; no page fallback; steps are history entries; payment redirects return to the overlay | [ADR-0002](adr/0002-query-param-action-hub.md), Spec §9, System §3 |
| Hub shell: tabs Get Help · Volunteer · Give on a flow's first step only; step header, progress and fixed action bar after that; event details use the same shell | Spec §9.2 |
| Hub layout: centered ~640px dialog on desktop; full-screen takeover on mobile; no swipe-to-dismiss; session drafts; deep-link normalization; focus return | Spec §9.3 |
| Retired pages redirect to the homepage with the right Hub state open: `/donate`, `/members`, `/sponsor`, `/planned-giving` | Spec §8.5 |
| Navigation: Programs · Events · About ▾ · Store, language dropdown (hidden while English only), Get Help (quiet), Volunteer (outline), Give (filled). Mobile: Logo · Get Help · Give · ☰ | Spec §8 |
| Label stays "Get Help" | Spec §8.2 |
| Get Help is a Hub flow, not a page: need → services and events → detail; emergency footer; deep links; no forms; no ad pixels | Spec §9.5 |
| Volunteer flow with parties and in-Hub DocuSign signing | Spec §9.6 |
| Give flow: one-time, monthly, planned, business; presets, impact line, designation, tribute, opt-in fee coverage; Stripe + PayPal | Spec §9.7 |
| Giving products: individual monthly = recognition only; business = Community Sponsors via Give → Business; partner logos on About → Partners & Sponsors | Spec §9.7, §10 |
| Events are two-sided: guest information and volunteer information | Spec §9.4, System §4 |
| Homepage content and order | Spec §10.1 |
| Staff Portal UX: same tokens, denser layout, desktop first, mobile check-in mode, no offline at launch | Spec §15 |
| Photography: audit, photo-consent checkbox, no identifiable guests without consent; find more photos as needed | Spec §5.6 |
| Newsletter sign-up: email only, added to the Constant Contact list | Spec §9.9, System §6 |
| Store: restyle, accessibility and bug fixes only; cart and checkout stay as pages | Spec §10.9 |
| Add Privacy Policy and Terms pages | Spec §10.10 |
| Analytics: Vercel Analytics + GTM; no ad pixels in the Hub; funnel events without personal data; no cookie banner unless ad pixels are added | Spec §16 |

### Data, integrations and engineering

| Decision | Where |
|---|---|
| PostgreSQL on Supabase for operational data; Supabase Auth magic links for staff; server checks + RLS | [ADR-0005](adr/0005-postgres-supabase-operational-data.md) |
| Our system is the source of truth for every TSOH event registration. Eventbrite is an **intake door** (free RSVP listing, imported, finish on our site). Facebook is a manual post linking to our sign-up. Partner events show on our site and link out | [ADR-0006](adr/0006-internal-registration-source-of-truth.md) |
| Volunteer parties (rules in System §5.3) | System §5.3 |
| Agreement policy: general agreement valid 12 months, Serving Hope addendum, guardians sign for minors, cutoff 24 h before start (Central), audited staff exceptions | System §5.4 |
| Permissions: every toggle from the original plan on day one; Admin override; second factor for Admin and Integrations | System §7 |
| Planned-giving inquiries handled in a portal queue; store tracks orders and fulfillment only | System §4 |
| Retention: registrations 3 years after last activity; inquiries 2 years; roster exports 30 days; signed agreements 7 years, longer for minors (confirm with insurer) | System §8.3 |
| Editorial copy in structured Sanity types; UI chrome in message files | [ADR-0007](adr/0007-structured-sanity-content.md) |
| Engineering defaults: CI from day one (lint, typecheck, Vitest, Playwright + axe, build); react-hook-form + zod; lint guardrails; `/styleguide`; page templates; next/image; loading, error and not-found routes; generated sitemap; fewer font weights | [03_IMPLEMENTATION_PLAN.md](03_IMPLEMENTATION_PLAN.md) |

### Localization

| Decision | Where |
|---|---|
| English at launch; everything built localization-ready; Spanish is an optional pass that ships only if it passes checks | [ADR-0004](adr/0004-localization-ready-english-first.md) |
| Translate once: content-hash cache, never at request time; CMS translation only runs while a second language is on | System §9 |
| Engine: an LLM behind our own translation module, DeepL as a drop-in alternative | System §9 |
| next-intl; English URLs unchanged; other languages under `/es/…`; no automatic redirects; remembered explicit choice | System §9 |
| Sanity field-level localized shape; v2 launches on a new `production-v2` dataset; apply for Sanity's non-profit plan | [ADR-0004](adr/0004-localization-ready-english-first.md) |
| Spanish style when enabled: *usted*, neutral Latin American, Stripe `es-419`, `es-US` number formatting | System §9 |
| Legal text gets a professional translation, only if Spanish is enabled | System §9 |
| No federal funding or USDA distribution, so no federal language-access review is needed | — |
| Later languages: Vietnamese and Chinese, for Get Help content first | [Research](research/LOCALIZATION_RESEARCH.md) |

## Open items to verify (developer-owned, Phase 0 unless noted)

| Item | Why it matters | Resolve by |
|---|---|---|
| Vercel UI SDK vs React Aria Components scorecard | Picks the component foundation | Spike 0.5 |
| Supabase Auth + RLS with Next.js 16 server actions and route handlers | Confirms ADR-0005 | Spike 0.6 |
| Eventbrite: free RSVP listing that feeds our sign-up is allowed; attendee webhook vs polling; API create/publish for free events | Confirms ADR-0006 | Spike 0.9 + Eventbrite support |
| DocuSign embedded ("focused view") signing inside our dialog; one session covering a guardian and their minors; Connect webhooks | Shapes the Volunteer flow | Spike 0.8 |
| Constant Contact API v3 OAuth setup and list add | Newsletter sign-up | Phase 4 |
| Rich text inside Sanity field-level localized arrays | Shapes the content model | Spike 0.7 |
| PayPal locale code (`es_US` vs `es_XC`) | Only if Spanish is enabled | Phase 8 |
| Scheduler choice for reminders, cutoff and retention jobs (Vercel Cron vs Supabase cron) | Phase 6 | Spike 0.6 |

## Parked content tasks (TSOH-owned, needed before launch)

- [ ] Founders' official titles (the site currently says co-founder, founder and president in different places)
- [ ] Official Instagram handle (`sourceofhope` vs `thesourceofhope`)
- [ ] Confirm program names: Serving and Sharing Hope · Education for Hope · Wellness of Hope (is "Clinic" part of it?) · Hope for the Outdoors · Hope Beyond Borders
- [ ] Community Sponsor tier names, prices and benefits
- [ ] Meals-per-dollar ratio for the Give impact line
- [ ] Get Help service details for each service, including how scholarships work
- [ ] Confirm the agreement policy and minimum ages, and agreement retention with the insurer
- [ ] Spanish versions of external Google Forms (only if Spanish is enabled)
- [ ] Photo gaps from the Phase 0 audit
- [ ] Review the Privacy Policy and Terms drafts
- [ ] Apply for the Sanity non-profit plan (needs an account owner)
- [ ] Pick staff for the soft launch and dress rehearsal

## Glossary

| Term | Meaning |
|---|---|
| Action Hub (Hub) | The one overlay that holds Get Help, Volunteer, Give and event details, opened by query parameters from any page |
| Door | One of the Hub's three entry tabs: Get Help, Volunteer, Give |
| Party | A group registered together for one event by a **registrant**: the registrant plus other adults and minors |
| Guest info / volunteer info | The two faces of an event record: what someone receiving a service needs to know, and what a volunteer needs to know |
| Intake door | Eventbrite's role: people RSVP there, we import them as incomplete sign-ups, and they finish on our site |
| Partner event | An event run by a partner. We list it; sign-up is the partner's link |
| Cutoff | The moment (default 24 h before start, Central time) when unsigned registrations leave the active roster |
| `refresh` | The long-lived branch and deployment for this release |
| `production-v2` | The new Sanity dataset the relaunched site reads; the old `production` dataset stays untouched for rollback |

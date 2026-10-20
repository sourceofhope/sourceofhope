# Update Community Partners and the Sponsor Launch

The `/members` page ("Community Sponsors") pairs monthly sponsorship with a network of local businesses, the **Community Partners**. Partners offer HOPE codes and donate gift cards that welcome new sponsors. This recipe covers the partner list, the welcome gift rule, and the Thanksgiving 2026 launch window.

Plan prices and names are a separate recipe: `/docs/recipes/tutorials/UPDATE_MEMBERSHIP_PLANS.md`.

---

## Where Each Value Lives

| What | File |
| ---- | ---- |
| Partner businesses (shown on `/members` and `/store`) | `/src/lib/community-partners.ts` → `COMMUNITY_PARTNERS` |
| Monthly amount that earns a welcome gift card | `/src/lib/community-partners.ts` → `WELCOME_GIFT_MIN_MONTHLY` |
| Founding Sponsor deadline and its wording | `/src/lib/sponsor-launch.ts` → `FOUNDING_SPONSOR_DEADLINE`, `FOUNDING_SPONSOR_DEADLINE_LABEL` |

---

## Add a Partner Business

Add an entry to `COMMUNITY_PARTNERS`:

```ts
{
  name: "12 Cuts Brazilian Steakhouse",
  action: "Reserve a Table",        // optional link text
  code: "SOURCEOFHOPE",             // optional HOPE code
  note: "Mention 'The Source of Hope' when booking", // optional, used when there is no code
  url: "https://example.com",       // optional; cards without a url are not links
  givesGiftCards: true,             // optional; shows a "Welcome gift partner" badge
  foundingSponsor: true,            // optional; shows a "Founding Sponsor" badge
},
```

- Only list a business after it has agreed to be listed
- Business sponsors who choose a website listing go here too (with or without a code)
- Set `givesGiftCards` only while you have that partner's gift cards on hand
- Set `foundingSponsor` for sponsors who joined before the launch deadline

The same list feeds the store's "Shop Beyond Our Store" section, so both pages stay in sync.

---

## Change the Welcome Gift Rule

`WELCOME_GIFT_MIN_MONTHLY` (default `25`) controls:

- The gift note under the individual amount picker
- The "How sponsorship works" step and the FAQ answer
- The welcome gift line on the checkout success screen

Business levels start at $50/month, so every business sponsor qualifies.

Gift cards are sent by staff, not by the site. Turn on Stripe email notifications for successful payments so the team sees each new sponsor.

---

## The Thanksgiving Launch Window

While `FOUNDING_SPONSOR_DEADLINE` is in the future, `/members` shows the "Become a Founding Sponsor" callout and the Thanksgiving closing banner. Afterward both switch to year-round wording on their own: the page revalidates hourly (`export const revalidate = 3600` in `/src/app/members/page.tsx`).

To extend or reuse the launch, change the deadline (UTC; Central time is UTC−6 in winter, UTC−5 in summer) and its label together.

---

## Short Link

`/sponsor` redirects to `/members` (see `next.config.ts`). Use `thesourceofhope.org/sponsor` on flyers and QR codes.

---

## Validation Checklist

- New partner cards look right on both `/members#community-partners` and `/store`
- Badges appear only for partners with `givesGiftCards` or `foundingSponsor`
- Launch wording shows before the deadline and is gone after it
- `npm run lint` and `npm run build` pass

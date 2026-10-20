# Update Membership Plans

The `/members` page ("Community Sponsors") sells monthly recurring sponsorships through Stripe subscriptions. Plan names and prices live in **two places that must agree**:

1. **What visitors see**: `/src/components/members/MembersPlansSection.tsx`
2. **What is charged**: `membershipProducts` in `/src/app/api/checkout/create-membership-payment-intent/route.tsx`

The server never trusts the price sent by the browser for fixed plans, so if the two files disagree, customers are charged the server's price while the page shows a different one.

---

## Current Plans

| Plan id      | Name                       | Type       | Price                       |
| ------------ | -------------------------- | ---------- | --------------------------- |
| `individual` | Monthly Individual Support | individual | Member chooses $1–$10,000/mo |
| `partner`    | Neighborhood Sponsor       | company    | $50/mo                      |
| `sponsor`    | Program Sponsor            | company    | $100/mo                     |
| `champion`   | Impact Champion            | company    | $500/mo                     |

`bronze`, `silver`, and `gold` remain in `membershipProducts` as retired plans: they have no `priceCents`, so the API rejects them.

The route only sets a Stripe product's name when it first creates the product. After renaming a plan, also rename the product in the Stripe Dashboard (Product catalog → `prod_membership_<id>`) so receipts show the new name. `partner` was renamed from "Company Partner" to "Neighborhood Sponsor" in October 2026.

Partner businesses, welcome gift cards, and the Thanksgiving launch window are covered in `/docs/recipes/tutorials/UPDATE_COMMUNITY_PARTNERS.md`.

---

## Where Each Value Lives

In `MembersPlansSection.tsx`:

- `COMPANIES` array: `id`, `name`, `priceMonthly` (dollars), `note`, `makesPossible`
- Individual plan: preset buttons `[25, 50, 75, 100]`, default amount `75` (`useState(75)`), plan id `"individual"` and name in `handleJoinIndividual`

In the API route:

- `membershipProducts[<id>]`: `id` (Stripe product id `prod_membership_<id>`), `name`, `description`, `priceCents`
  - a number = fixed monthly price in cents
  - `null` = member chooses the amount (individual plan)
  - omitted = retired, cannot be purchased
- `INDIVIDUAL_MIN_CENTS` (`100`) and `INDIVIDUAL_MAX_CENTS` (`1_000_000`) bound the individual amount
- `MembershipPlanId` type lists the allowed ids

---

## Change a Price

Example: raise Program Sponsor to $150/month.

1. `MembersPlansSection.tsx`: set the `sponsor` entry's `priceMonthly: 150`
2. Route: set `sponsor.priceCents: 15_000`
3. Update any copy on the page that mentions the old amount

What happens in Stripe:

- The product `prod_membership_sponsor` is reused.
- The route looks for an active monthly price with the new amount and creates one if it does not exist. The old price is left alone.
- **Existing subscribers keep paying their original price.** Only new sign-ups get the new price. Moving existing subscribers is done manually in the Stripe Dashboard.

---

## Add a Plan

1. Add an entry to `COMPANIES` (company plan) with a new `id`
2. Add the same id to the `MembershipPlanId` type and to `membershipProducts` with `id: "prod_membership_<id>"`, a `name`, a `description`, and `priceCents`
3. The Stripe product and price are created automatically on the first purchase (no Dashboard setup needed)

Company plans require `companyName` and `contactName`; the individual plan requires first and last name. Both require a valid email.

---

## Retire a Plan

1. Remove it from `COMPANIES` (or the individual UI) so it is no longer offered
2. In `membershipProducts`, **keep the entry but remove `priceCents`** (as with `bronze`/`silver`/`gold`). The id stays known for reference, and new purchases are rejected with `400 Invalid membership type`.

Existing subscriptions are not cancelled by this. Cancel or migrate them in the Stripe Dashboard if needed.

---

## Change the Individual Range or Presets

- Presets and default: `MembersPlansSection.tsx` (`[25, 50, 75, 100]`, `useState(75)`)
- Allowed range: `INDIVIDUAL_MIN_CENTS` / `INDIVIDUAL_MAX_CENTS` in the route

Each distinct individual amount becomes its own monthly price on the `prod_membership_individual` product.

---

## Test

With Stripe test keys in `.env.local` (`npm run dev`):

1. Choose each changed plan on `/members` and complete checkout with card `4242 4242 4242 4242`, any future expiry, any CVC
2. In the Stripe Dashboard (test mode), confirm the subscription, its monthly amount, and the metadata (`membership_name`, contact fields)
3. Try a declined card (`4000 0000 0000 0002`) and confirm the page shows an error

The membership endpoint allows 5 attempts per IP per 10 minutes; restart the dev server to reset it while testing.

---

## Validation checklist

- Prices shown on `/members` match `priceCents` in the route for every plan
- New subscriptions in Stripe have the expected amount and `month` interval
- Retired plans no longer appear and are rejected by the API
- `npm run lint` and `npm run build` pass
- `/docs/developers/10_PAYMENTS_AND_CHECKOUT.md` still describes the plans correctly

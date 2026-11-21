# 04 · Launch and Cutover

**Status:** Approved baseline, 2026-11-21. Owner: the release owner named at the start of Phase 9 (default: the project lead).

The relaunch reaches the public in one switch. This document says what must be true first, how staff start early, how we rehearse, how we switch, and how we switch back.

## 1. Launch gate

All items must be checked before the public cutover is scheduled.

- [ ] Phases 0–8 marked Done in the [phase table](03_IMPLEMENTATION_PLAN.md#phase-status), each with a project-lead review.
- [ ] Staff soft launch has run for at least one full event cycle (§3).
- [ ] Dress rehearsal passed and signed off (§4).
- [ ] Payment test matrix passed in test mode on preview, **and** a live smoke gift (then refunded) passed on the hidden v2 production deployment.
- [ ] Accessibility audit (slice 8.2): all WCAG 2.2 AA failures fixed.
- [ ] Performance budgets (slice 8.3) met on mobile.
- [ ] Security (slice 8.1): CSP enforced, zero critical or high advisories, retention job live, permission-denial coverage complete.
- [ ] Content: parked content tasks done; Privacy Policy and Terms approved by TSOH; photos consent-cleared.
- [ ] Spanish decision recorded: enabled (all 8.5 checks passed) or deferred.
- [ ] This runbook reviewed, and **rollback rehearsed** once on preview domains.
- [ ] One-page staff guide published; a named on-call person for launch week.

## 2. Production provisioning (Phase 9.1)

1. Create the Supabase **production** project: run migrations, enable RLS checks, back up, and confirm point-in-time recovery.
2. Create the `production-v2` Sanity dataset and run the content migration in **dry run**, then for real. Review the diff report.
3. Set the v2 Vercel project's production environment variables (live keys, production database, `production-v2`, `ENABLED_LOCALES`).
4. Attach `staff.thesourceofhope.org` to the v2 production deployment. Public routes there are password-protected and `noindex`. `/staff` is open to invited staff.
5. Register **v2 webhook endpoints** with Stripe, PayPal, DocuSign Connect and Eventbrite. Until cutover, v2 handlers process only objects tagged `app=v2`.
6. **Audit the current site's Stripe webhook handler** and decide, in writing, which app handles **existing** monthly memberships after cutover (renewal invoices, cancellations, receipts). No subscriber may get two receipts or none.
7. **Import existing Stripe customers and active subscriptions** (current memberships) into the `subscriptions` mirror, mapped to `monthly_gift` or `business_sponsor` by price or product. Reconcile counts against the Stripe dashboard.
8. Verify the Resend sending domain (SPF, DKIM, DMARC) and send test emails of every template.
9. Run the live smoke gift ($1, then refund) on the hidden deployment. Confirm the mirror record, the receipt and the refund status.

## 3. Staff soft launch (Phase 9.2)

Visitors see nothing new. Staff work on production data.

1. Bootstrap the first Admin, then invite staff in a small first wave. Set permissions per person. Admins enroll a second factor.
2. Staff enter **all upcoming events** in the portal (images, shifts, guest and volunteer info). Partner events are entered as partner listings.
3. Publish upcoming TSOH events to Eventbrite from the portal. Retire any manually created Eventbrite listings for the same events.
4. Watch the Eventbrite intake: RSVPs import, `finish` emails go out, and matches appear for review.
5. Generate campaign links and QR codes for the next print and social pieces. Until cutover these point to Hub states that only resolve after the public switch, so date the print run accordingly, or use links to the current site until then.
6. Collect staff feedback. Fixes go through normal PRs into `v2`.

## 4. Dress rehearsal (Phase 9.3)

One **real** upcoming event, run end to end in the new system by staff, with a developer observing. Pass criteria are in brackets.

1. Create the event with shifts, guest info and the required agreements. [Previews correct]
2. Publish to the website (hidden domain) and Eventbrite; generate a Facebook packet and QR. [Statuses accurate]
3. Sign-ups through the Hub on the hidden domain:
   - an individual;
   - a party with another adult and a minor signed by the registrant;
   - a minor with an outside guardian;
   - an Eventbrite RSVP that finishes on our site.

   [All reach the expected states]
4. Agreements: one signed in the Hub, one from an emailed link, one left unsigned on purpose. [Reminders sent; status updates arrive by webhook]
5. Cutoff passes. [The unsigned person is removed, the cascade applies, notices are sent, history is kept]
6. A staff exception restores one person. [Audited]
7. Print the roster. Check people in on a phone at the venue. [Fields match permissions; check-in works on venue connectivity, with paper as backup]
8. Closeout: no-shows and totals; export the summary. [Numbers match the roster]
9. A gift made during the event week shows in Giving with its receipt. [Mirror matches Stripe]

Sign-off: project lead and the staff member who ran it. Issues found are fixed and the affected steps re-run.

## 5. Cutover runbook (Phase 9.4)

Pick a low-traffic weekday morning (Central time), outside any event's sign-up cutoff window.

| When | Step |
|---|---|
| T-7 days | Announce the switch to staff. Freeze structural changes on the old site |
| T-2 days | **Content freeze** on the old `production` dataset. Run the final content migration dry run; review the diff |
| T-1 day | Apply the final migration to `production-v2`. Confirm the webhook plan (§2.6). Confirm on-call coverage |
| T-0 | 1. Run the final smoke on the hidden deployment |
| | 2. Remove the password protection and `noindex` from v2 public routes (keep `noindex` on `/staff` and `/styleguide`) |
| | 3. Switch v2 webhook handlers from `app=v2`-only to the post-cutover rule decided in §2.6 |
| | 4. **Move `thesourceofhope.org` and `www` from the old Vercel project to the v2 project** |
| | 5. Smoke tests on the live domain: <ul><li>home</li><li>every Hub door</li><li>an event deep link</li><li>a live $1 gift (refund after)</li><li>a test volunteer sign-up on an unlisted test event</li><li>contact form</li><li>newsletter sign-up</li><li>store checkout to the payment step</li><li>every redirect in spec §8.5</li><li>sitemap and robots</li><li>staff sign-in</li></ul> |
| | 6. Submit the new sitemap in Google Search Console |
| T+1 h | Check the webhook ledger, job runs, email delivery and error logs |
| T+1 day | Review analytics funnels, error rates and staff feedback |
| T+14 days | Rollback window ends: archive the old Vercel project (keep it restorable), merge `v2` into `production`, reset the branch model, rewrite `docs/developers/` and the README |

## 6. Rollback

**Roll back when** any of these can't be fixed forward within about an hour:
- payments failing;
- the Hub not opening;
- volunteer sign-up broken for an upcoming event;
- a WCAG blocker on a primary journey;
- data being written incorrectly.

**Steps:**

1. Move `thesourceofhope.org` and `www` back to the old Vercel project. The old site reads the untouched `production` dataset.
2. Return v2 webhook handlers to `app=v2`-only, and restore the old site's handling of legacy subscriptions per the §2.6 plan.
3. Keep `staff.thesourceofhope.org` running, so staff keep the portal and the data created since cutover.
4. Reconcile anything created in v2 during the window (gifts, sign-ups) from the portal, and contact affected people if needed.
5. Write a short incident note, fix, re-rehearse the failed step, and reschedule.

## 7. After launch

- **Stabilization (two weeks):**
  - Daily check of the webhook ledger, `job_runs`, Resend bounces and the error logs.
  - Hotfixes go through PRs into `production` (after the merge) or `v2` (before it).
- **First month:** review Core Web Vitals field data, Hub funnel drop-offs and staff pain points. Feed them into a post-launch backlog.
- **Next candidates** (not committed):
  - Spanish, if deferred.
  - Vietnamese and Chinese for Get Help.
  - Monthly giving through PayPal.
  - Offline check-in.
  - A waitlist for full shifts.
  - Honoree notifications for tribute gifts.

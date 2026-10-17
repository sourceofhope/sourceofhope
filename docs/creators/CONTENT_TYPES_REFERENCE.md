# Content Types Reference

This page lists every type of content in Sanity Studio, where it appears on the website, and what each field does.

Fields marked **(required)** must be filled in before you can publish.

Two fields appear on several types:

- **External ID** — a number carried over from the old website. Leave it blank for anything new.
- **Image → Alt Text** — a short description of the image for people using screen readers. Always fill it in.

Prepare every image before uploading; see `/docs/creators/MEDIA_FORMAT_RULES.md`.

---

## Team Member

Where it appears:

- Team page (thesourceofhope.org/about/team), inside its team group
- Its own profile page (thesourceofhope.org/about/team/slug)

Fields:

- **Team Group** (required) — the group this person belongs to.
- **Name** (required) — full name. Also used as the profile page heading.
- **Slug** (required) — the end of the profile page's web address. Click **Generate** to build it from the name. Changing it later breaks any links people have saved.
- **Title** — their role. Shown under their name.
- **Short Bio** — one or two sentences, shown in bold above the full bio.
- **Bio** — the full biography. Line breaks are kept as you type them.
- **Image** — a square headshot.

Good to know:

- Members with a photo are listed first in their group.

---

## Team Group

Where it appears: as a section heading on the Team page.

Fields:

- **Name** (required) — the group name, for example "Executive Board".
- **Slug** (required) — click **Generate**.
- **Description** — a short description of the group, for your reference. Not currently shown on the website.

Good to know:

- Groups with no published members are hidden.
- The order of groups is set by a developer. A new group appears after the groups on that list until a developer adds it.

---

## Featured Event

Where it appears: the **Featured Events** carousel on the Events page (thesourceofhope.org/events). Up to **6** featured events are shown, latest date first.

Fields:

- **Title** (required) — event name.
- **Date** (required) — the event's date and start time.
- **Location** — where it takes place.
- **Summary** — a few sentences describing the event. Long text is cut off on the card.
- **Event Page → URL** — the registration or details link (for example an Eventbrite page). Used by the **Register Now** button. Always fill this in for upcoming events.
- **Image** — the event's card image. A placeholder is shown if left empty.

Good to know:

- Times on the website are always shown in **Central time**.
- The date picker for featured events uses the time zone of the computer you are editing on. If you are not in Central time, double-check the time after publishing.
- Once the event's date has passed, the button changes to **Event Completed** automatically. Unpublish old events when they are no longer useful.

---

## Recurring Event

Where it appears: the **Recurring Programs** carousel on the Events page. Up to **12** recurring events are shown, latest date first.

Fields: the same as **Featured Event**.

Good to know:

- The date picker for recurring events is locked to **Central time**, so the time you enter is the time shown on the website.
- Use the date of the **next** occurrence. When that date passes the card shows **Event Completed**, so update the date after each occurrence.

---

## Product

Where it appears:

- The store (thesourceofhope.org/store), newest first
- Its own product page (thesourceofhope.org/store/product/slug)
- Checkout, where the price is read again to charge the customer

Fields:

- **Title** (required) — product name.
- **Slug** (required) — the end of the product page's web address. Click **Generate**.
- **Price** — the price in US dollars, for example `25` or `24.99`. **This is the amount customers are charged.** A product without a price (or with a price of 0) cannot be bought; checkout will say the item is no longer available.
- **Short Description** — a one-line summary for the store listing.
- **Long Description** — the full description on the product page.
- **Impact** — how the purchase supports the mission.
- **Size** — the size for this product, for example `M` or `One size`. It is not shown on the product page; it is attached to the item when a customer adds it to the cart and appears in the cart, at checkout ("Size: M"), and on the payment record.
- **Image** — a square product photo.

Good to know:

- Price changes apply to new checkouts within about 30 seconds, even for customers who added the item to their cart earlier. In the card checkout form, a customer whose cart still shows the old price is asked to remove and re-add the item.
- Shipping, tax, and the optional processing fee are set by a developer, not in the Studio.

---

## Publication

Where it appears:

- **Latest Updates** carousel on the home page (newest **5**)
- The Media page (thesourceofhope.org/media, newest **10**)

Fields:

- **Title** (required).
- **Date** (required) — the publication date. Controls the order.
- **Summary** — a short description shown on the card.
- **URL** — link to the full article, video, or press piece. Opens in a new tab on another website. If empty, **Read more** goes to the Media page instead.
- **Image** — the card image. A placeholder is shown if left empty.

---

## Newsletter

Where it appears: the newsletter section of the Media page (newest **5**, by when they were created).

Fields:

- **Title** (required) — for example "Spring 2026 Newsletter".
- **Newsletter URL** (required) — link to the newsletter issue. Opens on another website.
- **Image** — the cover image.

---

## Checkout Provider

Where it appears: the **Express** checkout buttons on the store checkout page (thesourceofhope.org/store/checkout).

Fields:

- **Provider ID** (required) — a short lowercase label, for example `stripe` or `paypal`.
- **Name** (required) — must be **exactly** `Stripe` or `PayPal` (same spelling and capitals). Any other name shows a button that does nothing.
- **Description** — for your reference; not currently shown on the website.
- **Enabled** (required) — turn off to hide this button from checkout.
- **Icon** — which logo the button shows. Use one of: `stripe`, `paypal`, `googlepay`, `applepay`. Any other value shows an empty button.

Good to know:

- Google Pay and Apple Pay buttons can be displayed but **do not work yet**. Keep them disabled.
- Turning **Enabled** off is the quickest way to hide a payment option that is having problems. See `/docs/organizers/EMERGENCY_PLAYBOOK.md`.
- Customers can still pay by card in the regular checkout form even when all express buttons are off.

---

## Banner Event

Where it appears: **nowhere at the moment.** This type exists in the Studio, but the website does not currently read it. Editing or publishing a Banner Event has no visible effect.

Fields (for when it is connected):

- **Enabled** — whether the banner should show.
- **Text** — the banner message.
- **Link → URL** — where the banner links to.
- **Expires** — when the banner should stop showing.

Turning on a site banner requires a developer; see `/docs/organizers/WHAT_NEEDS_DEVELOPER.md`.

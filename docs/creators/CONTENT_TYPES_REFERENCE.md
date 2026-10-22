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

Where it appears: the **Featured Events** timeline on the Events page (thesourceofhope.org/events). Upcoming events are listed soonest first under **Coming up**; the four most recent past events stay under **Recently completed** for a year. Clicking an event opens a details window with the description on the left and the image on the right.

Fields:

- **Title** (required) — event name.
- **Start Date and Time** (required) — when the event begins, in Central time.
- **End Date and Time** — optional. Shown as a time range (for example "9:00 AM – 1:00 PM Central"). Must be after the start.
- **Location Name** — a short place name shown on the card, such as "Cornerstone Kitchen".
- **Street Address** — optional. Adds a **Get directions** link (Google Maps) in the details window.
- **Summary** — one or two sentences shown on the timeline card. Long text is cut off on the card.
- **Full Description** — shown in the details window: what volunteers will do, who it serves, what to bring. Line breaks are kept. If empty, the summary is shown instead.
- **Program** — optional tag linking to the matching program page.
- **Volunteer Waiver** — which volunteer agreement the details window asks volunteers to sign before registering (see below). Defaults to **General Volunteer Agreement**.
- **Registration Page → URL** — the registration link (for example an Eventbrite page). Used by the register button in the details window. Always fill this in for upcoming events; without it, the window says registration opens soon.
- **Image** — the event's image. Landscape works best; the details window shows the whole image without cropping. A placeholder is shown if left empty.

Choosing the Volunteer Waiver:

- **General Volunteer Agreement** — most volunteer events.
- **Serving Hope Volunteer Agreement (Cornerstone Kitchen)** — meal service and other Serving & Sharing Hope events at Cornerstone Kitchen.
- **None** — events without volunteers, such as galas or fundraisers. The waiver request is hidden.

Volunteers sign each agreement once; it covers every event after that. The register button is always shown, even before someone signs.

Good to know:

- Times are entered and shown in **Central time**; the date picker is locked to it.
- An event is marked **Completed** once its end time has passed (or its start time, if there is no end). The waiver request and register button are then hidden. Events older than a year drop off the page automatically, but you can unpublish them sooner.

---

## Recurring Event

Where it appears: the **Monthly Programs** grid on the Events page, up to **12** programs. Programs with an upcoming date are listed first, soonest first, then the rest alphabetically. Clicking a card opens the same details window as featured events.

Fields: the same as **Featured Event**, plus:

- **Schedule** — how often it happens, for example "Second Saturday of every month, 10 AM to 1 PM". Shown on the card and in the details window. Recommended, because it stays correct between dates.

Good to know:

- Set **Start Date and Time** to the **next** occurrence. While that date is in the future, the card shows it (when there is no Schedule) and the details window shows "Next date".
- Recurring programs are never marked Completed. Once the date passes, the date is simply hidden until you update it, so the Schedule keeps the card useful in the meantime.

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

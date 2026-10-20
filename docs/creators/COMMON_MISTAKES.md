# Common Mistakes and How to Fix Them

---

## My Change Is Not on the Website

Cause: The change was saved as a draft but not published.

Fix: Open the document and click **Publish**. Drafts are never shown on the website.

---

## I Published, but the Website Still Shows the Old Version

Cause: The website checks for new content about every 30 seconds.

Fix: Wait about 30 seconds, then refresh the page. If it still hasn't changed after a few minutes, contact a developer.

---

## A Profile or Product Link Stopped Working

Cause: The **Slug** was changed after the item was published. The slug is part of the web address, so old links no longer match.

Fix: Change the slug back if possible. Avoid editing slugs on live content.

---

## A Team Member Is Missing From the Team Page

Cause: The team member is unpublished, or is in the wrong team group.

Fix: Check that the team member is published and that **Team Group** is set to the correct group. A group with no published members is hidden entirely.

---

## A New Team Group Shows Up in the Wrong Place

Cause: Team group order is set by a developer. New groups appear after the groups on that list.

Fix: Ask a developer to add the group to the team order.

---

## Page or Image Loads Slowly, or Looks Too Large

Cause: The image was uploaded without resizing or compressing. The website shows images exactly as uploaded.

Fix: Resize and compress the image (see `/docs/creators/MEDIA_FORMAT_RULES.md`), upload the new version in place of the old one, and publish.

---

## A Product Can't Be Bought

Cause: The product has no **Price**, or the price is 0. Checkout reports that the item is no longer available.

Fix: Enter the price in US dollars and publish.

---

## Text Looks Odd After Pasting

Cause: The Studio's text fields are plain text. Formatting such as bold, bullets, or links from Word or Google Docs is not carried over, but line breaks are kept exactly as typed.

Fix: Paste into a plain text editor first, tidy the line breaks, then paste into the Studio.

---

## An Event Shows the Wrong Time

Cause: Events created before the date picker was locked to Central time may have been entered in the editor's own time zone.

Fix: Open the event, re-enter the start (and end) time as Central time, and publish. Both event date pickers are now locked to Central time.

---

## An Event Says "Completed" Too Early

Cause: The featured event's end time (or start time, if there is no end) is in the past, often because the wrong year was entered.

Fix: Correct the dates and publish. Recurring programs are never marked Completed; if a recurring program's date disappears, set it to the next occurrence.

---

## The Wrong Waiver Is Requested for an Event

Cause: The event's **Volunteer Waiver** field was left on its default, **General Volunteer Agreement**.

Fix: Choose **Serving Hope Volunteer Agreement (Cornerstone Kitchen)** for Cornerstone Kitchen meal service, or **None** for events without volunteers, then publish.

---

## An Express Checkout Button Does Nothing or Is Blank

Cause: The **Checkout Provider**'s **Name** is not exactly `Stripe` or `PayPal`, or its **Icon** is not one of `stripe`, `paypal`, `googlepay`, `applepay`. Google Pay and Apple Pay do not work yet.

Fix: Correct the spelling and publish, or turn **Enabled** off to hide the button.

---

## Wrong Item Updated

Always double-check the title at the top of the document before editing. If you changed the wrong item, use its history to restore the earlier version (see `/docs/creators/CREATE_EDIT_DELETE_CONTENT.md`).

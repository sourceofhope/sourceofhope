# Emergency Playbook

This guide helps you handle urgent situations even if no developer or volunteer is available.

Content in Sanity Studio is yours to fix. Anything else (page wording, layout, forms, checkout, donations, the website being down) needs a developer.

---

## Wrong Content Was Published

1. Log into Sanity Studio (see `/docs/creators/LOGIN_AND_OVERVIEW.md`).
2. Open the item.
3. Do one of the following:
   - Correct the mistake and click **Publish**, or
   - Open its history, select the last good version, choose **Restore**, then **Publish**, or
   - Open the menu next to **Publish** and choose **Unpublish** to take it off the website.

Changes take effect within about 30 seconds.

---

## An Image Is Breaking or Slowing Down a Page

1. Open the item in the Studio.
2. Remove the image (or replace it with a properly sized one; see `/docs/creators/MEDIA_FORMAT_RULES.md`).
3. Click **Publish**.

---

## A Store Payment Option Is Broken

If Stripe or PayPal express checkout is failing for customers:

1. In the Studio, open **Checkout Provider**.
2. Open the broken provider.
3. Turn **Enabled** off.
4. Click **Publish**.

The button disappears from checkout within about 30 seconds. Customers can still pay by card in the regular checkout form. Then contact a developer.

---

## A Product Is Listed at the Wrong Price

1. Open the product in the Studio.
2. Fix the **Price**, or **Unpublish** the product.
3. Click **Publish**.

Checkout always reads the current price, so new orders use the corrected price right away.

---

## A Page Looks Broken

Do not attempt to fix layout.

- If the broken section shows Studio content (events, team, products, publications), unpublish or restore the most recently changed item.
- Otherwise, contact a developer.

---

## The Website Is Down or a Recent Update Broke It

This is a deployment problem, not a content problem. Contact a developer immediately.

A developer can restore the previous working version in minutes, either with the hosting provider's (Vercel) instant rollback or by reverting the change in version control.

---

## A Form Is Not Working

The contact and planned giving forms are not controlled by the Studio.

Contact a developer.

---

## Checkout, Donations, or Memberships Not Working

These are handled by the website's payment code and our payment providers (Stripe and PayPal).

Contact a developer immediately.

---

## If All Else Fails

While less than ideal, AI assistants such as Claude, ChatGPT, or Gemini can help with an emergency fix when no developer is available. Give the assistant access to this repository and its `/docs` folder, and ask it to follow the developer documentation, make the smallest possible change on a branch, and explain how to undo it.

Do not paste passwords, API keys, or other secrets into an AI assistant.

Remember that this is an absolute last resort, which should not occur unless there is an emergency and no developer is available.

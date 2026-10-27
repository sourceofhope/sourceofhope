# Creating, Editing, and Deleting Content

This is the core of your work. Every type of content in Sanity Studio follows the same pattern: create a document, fill in its fields, and **Publish**.

---

## How Publishing Works

- While you type, Sanity saves your work automatically as a **draft**.
- Drafts are **never** shown on the website. Visitors only see published content.
- Click **Publish** (bottom right of the document) to make your changes live.
- After publishing, changes appear on the website within about **30 seconds**. Refresh the page if you do not see them yet.

Only the fields in the form appear on the website. There is no free-form page editor; the website decides the layout.

---

## Example: Add a Team Member

1. In the left sidebar, click **Team Member**.
2. Click the **create** button (pencil or "+" icon) at the top of the list.
3. **Team Group**: choose the group this person belongs to (required). If the group does not exist yet, create it first under **Team Group**.
4. **Name**: the person's full name (required).
5. **Slug**: click **Generate** to create it from the name (required). The slug becomes the web address of their profile.
6. **Title**: their role, for example "Program Director".
7. **Short Bio**: one or two sentences. Shown in bold above the full bio.
8. **Bio**: the full biography.
9. **Image**: upload a prepared headshot (see `/docs/creators/MEDIA_FORMAT_RULES.md`), then fill in **Alt Text** with a short description such as "Portrait of Jane Doe".
10. Click **Publish**.

Within about 30 seconds the person appears:

- in their group on the Team page: thesourceofhope.org/about/team
- on their own profile page: thesourceofhope.org/about/team/your-slug-here

Notes about the Team page:

- Team members with a photo are listed before team members without one.
- A team group with no published members is hidden.
- Team groups appear in an order set by a developer. A **new** team group shows up after all the groups on that list until a developer adds it. Ask a developer if the new group needs a specific position.

---

## Example: Add Other Content

The same steps work for every other content type:

1. Click the content type in the sidebar (for example **Featured Event** or **Product**).
2. Create a new document.
3. Fill in the fields. Required fields are marked, and Sanity will not let you publish without them.
4. Upload and describe an image if the type has one.
5. Click **Publish**.

Field-by-field details are in `/docs/creators/CONTENT_TYPES_REFERENCE.md`.

---

## Editing Existing Content

1. Click the content type in the sidebar.
2. Find the document in the list (use the search box at the top of the list if it is long).
3. Make your changes. They are saved as a draft.
4. Click **Publish**.

Until you publish, the website keeps showing the previous version.

To throw away unpublished changes, open the menu next to the **Publish** button and choose **Discard changes**.

---

## Removing Content

Open the document, then open the menu next to the **Publish** button (the small arrow or "..." menu).

- **Unpublish** removes the item from the website but keeps it in the Studio as a draft. You can publish it again later. **Prefer this.**
- **Delete** removes the item completely. Only delete when you are sure it will never be needed again, or when instructed.

---

## Restoring an Earlier Version

Sanity keeps a history of every published change.

1. Open the document.
2. Open its history (the clock icon or **Review changes** at the top of the document).
3. Select the earlier version you want.
4. Choose **Restore**.
5. Click **Publish** to put the restored version back on the website.

This is the fastest way to undo a mistake. See also `/docs/organizers/EMERGENCY_PLAYBOOK.md`.

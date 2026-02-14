# Build a Form That Sends Email

This recipe covers creating a frontend form that sends email through the backend API.

There are two form patterns supported in this codebase:

1. `react-hook-form` + `HookInput`
2. Local React state + `LocalInput`

Choose one pattern per form. Do not mix unless required.

Email submission is sent via:

- `sendEmail(emailData)` in `/src/lib/api/email.js`

---

## Option A: react-hook-form + HookInput

Use this when you want:

- schema-style validation
- clean error handling
- minimal local state

### 1) Build the form

- Use `useForm()`
- Register inputs
- Pass errors into HookInput

### 2) Submit using sendEmail

`sendEmail` expects a JSON object that includes:

- `name`
- `email`
- `message`

Those fields are validated server-side.

---

## Option B: Local state + LocalInput

Use this when you want:

- simple forms
- minimal dependencies
- custom validity logic inline

`LocalInput` supports:

- writing into a shared `formData` object via `setFormData`
- calling an `onChange` validator that returns boolean validity

---

## API Behavior

`sendEmail` selects API URL based on `import.meta.env.DEV`:

- DEV: `http://localhost:3001/api/email/send`
- PROD: `https://thesourceofhope.org/api/email/send`

If email works locally but not in production, validate that production domain is expected (see `/docs/developers/10_TROUBLESHOOTING.md`).

---

## Server Behavior (for debugging)

The server route is:

- `POST /api/email/send` (and also mounted under `/dev/api` and `/app/api`)

It uses Resend to send an email to:

- `treasurer@thesourceofhope.org`

If required fields are missing, it returns 400 with:

- `"Missing required fields: name, email, message"`

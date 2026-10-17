# Build a Form That Sends Email

This recipe covers creating a form that sends an email through the site's own API route, `POST /api/email/send`, which uses Resend.

Existing examples:

- `/src/components/connect/ConnectMapSection.tsx` (contact form on `/connect`) — react-hook-form + `HookInput`
- `/src/components/planned-giving/FormSection.tsx` (interest form on `/planned-giving`) — local React state + plain inputs

Both include the honeypot spam trap. Copy the pattern of whichever is closer to what you need.

---

## What the API Expects

`POST /api/email/send` with a JSON body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Free-form text",
  "businessName": ""
}
```

Server-side rules (`/src/app/api/email/send/route.ts`):

- The request must have `Content-Type: application/json`
- `name` and `message` must be non-empty strings; `email` must look like an email address
- Limits: name ≤ 120 characters, email ≤ 254, message ≤ 5,000
- `businessName` is the honeypot. If it has any value, the route returns success but sends nothing
- Rate limit: 3 messages per IP per 10 minutes (then `429` with a `Retry-After` header)
- All input is HTML-escaped; newlines are stripped from the subject

Responses: `200 { success: true }`, `400` invalid input, `429` too many requests, `500` email not configured, `502` Resend rejected the message.

There are only three fields, so put anything else (phone, checkboxes, form name) into `message`.

---

## Build the Form (react-hook-form)

The form is interactive, so the file must start with `"use client"`.

```tsx
"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import HookInput from "@/components/ui/HookInput";
import HoneypotField, { readHoneypot } from "@/components/ui/HoneypotField";

type Status = "IDLE" | "SUBMITTING" | "SUCCESS" | "ERROR";

interface VolunteerForm {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  msg: string;
}

export default function ConnectVolunteerInterestSection() {
  const [status, setStatus] = useState<Status>("IDLE");
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VolunteerForm>({ mode: "onBlur" });

  async function onSubmit(data: VolunteerForm) {
    setStatus("SUBMITTING");

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${data.fname} ${data.lname}`.trim(),
          email: data.email,
          message: `Volunteer Interest Form\nPhone: ${data.phone || "Not provided"}\n\n${data.msg}`,
          businessName: readHoneypot(formRef.current),
        }),
      });

      if (!response.ok) throw new Error(`Email failed: ${response.status}`);

      setStatus("SUCCESS");
      reset();
    } catch (error) {
      console.error(error);
      setStatus("ERROR");
    }
  }

  return (
    <PageSection>
      <SectionHeading eyebrow="Get involved" title="Volunteer With Us" />
      <form ref={formRef} className="relative grid" onSubmit={handleSubmit(onSubmit)}>
        <HoneypotField />
        <HookInput
          title="First name"
          error={errors.fname}
          {...register("fname", { required: "First name is required", maxLength: 50 })}
        />
        <HookInput
          title="Last name"
          error={errors.lname}
          {...register("lname", { required: "Last name is required", maxLength: 50 })}
        />
        <HookInput
          title="Email address"
          type="email"
          error={errors.email}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address",
            },
          })}
        />
        <HookInput title="Phone (optional)" type="tel" {...register("phone")} />
        <HookInput
          title="Message"
          error={errors.msg}
          {...register("msg", { required: "Message is required", maxLength: 2000 })}
        />

        <p aria-live="polite" className="h-5 text-sm">
          {status === "SUCCESS" && "Message sent."}
          {status === "ERROR" && "Something went wrong. Please try again."}
        </p>

        <button
          type="submit"
          disabled={status === "SUBMITTING"}
          className="w-full px-5 py-4 rounded-xl font-bold text-neutral-50 bg-accent-500 hover:bg-accent-600 disabled:bg-neutral-400">
          {status === "SUBMITTING" ? "Sending" : "Submit"}
        </button>
      </form>
    </PageSection>
  );
}
```

Key points:

- Render `<HoneypotField />` inside the form and send `readHoneypot(formRef.current)` as `businessName`. It reads the value from the DOM (not React state) so bots that set `.value` directly are still caught. With a plain `onSubmit` handler you can pass `e.currentTarget` instead, as `FormSection` does.
- Keep client-side limits at or below the server limits so visitors see a friendly message instead of a `400`.
- Show status with an `aria-live="polite"` region; avoid `alert()`.
- Use a relative URL (`/api/email/send`). The API is part of the same Next.js app in every environment.

---

## Where the Email Goes

The route sends every message:

- from `The Source of Hope <onboarding@resend.dev>`
- to `treasurer@thesourceofhope.org`
- with the visitor's address as `replyTo`
- with the subject `New Contact Form Submission from <name>`

Start `message` with the form's name (e.g. `Planned Giving Interest Form`) so recipients can tell forms apart.

`onboarding@resend.dev` is Resend's shared test sender. To send from an `@thesourceofhope.org` address, verify the domain in Resend and change `from` in the route. Changing the recipient or subject is also a code change in `/src/app/api/email/send/route.ts`. If a form needs a different recipient, add a new route rather than accepting a recipient from the browser (see `/docs/recipes/tutorials/ADD_AN_API_ROUTE.md`).

---

## Testing Locally

- `RESEND_API_KEY` must be set in `.env.local`, otherwise the route returns `500 Email service not configured`
- Each test counts toward the 3-per-10-minutes limit; restart `npm run dev` to reset the in-memory limiter
- To test the honeypot, fill the hidden input from devtools and confirm the form reports success but no email arrives

See `/docs/recipes/fixes/FIX_API_REQUEST_ERRORS.md` if requests fail.

---

## Validation checklist

- Required-field and format errors show inline before submitting
- A valid submission shows "sent" and the email arrives at the recipient with the right reply-to
- A filled honeypot results in no email
- The submit button is disabled while sending
- The fourth submission within 10 minutes is rejected with a friendly error, not a crash
- `npm run lint` passes

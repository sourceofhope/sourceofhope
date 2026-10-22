# Add an API Route

Backend endpoints are Next.js Route Handlers in `/src/app/api/**/route.ts`. They run on the server (as Vercel functions in production) and are called by the browser with relative URLs, because the site and its API are the same app.

This recipe shows the house pattern every new route should follow. The example adds `POST /api/volunteer/interest`, which emails a volunteer coordinator.

---

## 1) Create the File

The folder path is the URL:

- `/src/app/api/volunteer/interest/route.ts` → `/api/volunteer/interest`

Export one function per HTTP method (`GET`, `POST`, `OPTIONS`, ...).

---

## 2) Use the Standard Building Blocks

From `/src/lib/`:

- `rateLimit(request, scope, limit, windowMs)` (`rate-limit.ts`) — returns a `429` response to send back, or `null` to continue. Limits are per IP and per server instance.
- `readJsonObject(request)` (`validation.ts`) — returns the parsed body, or `null` unless the request is `application/json` and the body is a JSON object. Requiring JSON also blocks cross-site HTML form posts.
- `getEnvironment()` (`environment.server.ts`) — the only place secrets are read. It is `server-only`, so it can never end up in browser code.

---

## 3) Template

```ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getEnvironment } from "@/lib/environment.server";
import { rateLimit } from "@/lib/rate-limit";
import { readJsonObject } from "@/lib/validation";

// 5 submissions per IP per 10 minutes.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const EMAIL_PATTERN = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,255}\.[^\s@<>"]+$/;

/** Trim a string field and cap its length; anything else becomes undefined. */
function asString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

/**
 * Send a volunteer interest email
 * POST /api/volunteer/interest
 */
export async function POST(request: Request) {
  try {
    const limited = rateLimit(request, "volunteer-interest", RATE_LIMIT, RATE_WINDOW_MS);
    if (limited) return limited;

    const body = await readJsonObject(request);
    if (!body) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const name = asString(body.name, 120);
    const email = asString(body.email, 254);
    const program = asString(body.program, 100);

    if (!name || !email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: "Name and a valid email are required" }, { status: 400 });
    }

    const { resendKey } = getEnvironment();
    if (!resendKey) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json({ error: "Service not configured" }, { status: 500 });
    }

    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      from: "The Source of Hope <onboarding@resend.dev>",
      to: ["info@thesourceofhope.org"], // fixed server-side, never from the request
      replyTo: email,
      subject: `Volunteer interest from ${name.replace(/[\r\n]+/g, " ")}`,
      text: `Name: ${name}\nEmail: ${email}\nProgram: ${program ?? "Not specified"}`,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: "Failed to send" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Volunteer interest error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

If you build HTML email bodies, escape every user value first (see `escapeHtml` in `/src/app/api/email/send/route.ts`).

---

## 4) Rules

- **Rate-limit** anything that writes, sends, or costs money. Give the route its own `scope` name unless it should share a budget with related routes (the store checkout routes share `store-checkout`).
- **Validate every field**: check the type, trim, cap the length, and test formats with a pattern or allow-list. Ignore fields you do not expect.
- **Never trust prices, totals, recipients, or redirect URLs from the browser.** Compute amounts on the server (see `quoteStoreOrder` in `/src/lib/store-pricing.ts`) and build redirect URLs from the request origin (`getSiteOrigin`).
- **Validate ids before using them in another API's URL path** (e.g. the PayPal token check `^[A-Z0-9]{8,32}$`).
- **Guard missing configuration** with a `500` "not configured" response instead of crashing.
- **Keep errors generic** in responses; log details with `console.error` (visible in Vercel function logs).
- **Secrets** come only from `getEnvironment()`. Only `NEXT_PUBLIC_*` variables may reach the browser.
- If the route needs the raw request body (e.g. a signed webhook), read it with `await request.text()` before anything else and set `export const runtime = "nodejs"`, as `/src/app/api/checkout/stripe-webhook/route.ts` does.

Optional, matching the checkout routes:

```ts
export async function GET() {
  return NextResponse.json({ message: "Endpoint is available. Use POST." });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { Allow: "GET,POST,OPTIONS" } });
}
```

---

## 5) Call It From the Browser

From a client component, use a relative URL and a JSON content type:

```ts
const response = await fetch("/api/volunteer/interest", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, program }),
});

if (!response.ok) {
  // show a friendly error; 429 means "try again later"
}
```

Server Components should not call your own API routes over HTTP. Import the underlying function (e.g. a fetcher from `/src/lib/sanity-content.ts`) directly instead.

---

## 6) Document It

Add the route, its method, body, responses, and rate limit to `/docs/developers/06_API_ROUTES.md`.

---

## Validation checklist

- `curl -X POST http://localhost:3000/api/volunteer/interest -H "Content-Type: application/json" -d '{"name":"Test","email":"test@example.com"}'` succeeds
- The same request without the JSON content type returns `400`
- Missing or oversized fields return `400` with a generic message
- Exceeding the limit returns `429` with a `Retry-After` header
- With the secret unset, the route returns `500` "not configured" instead of crashing
- No secret or stack trace appears in any response
- `npm run lint` and `npm run build` pass

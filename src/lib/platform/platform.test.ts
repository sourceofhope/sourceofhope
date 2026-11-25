import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { assertEnv, envProblems } from "../env";
import { createLogger, REDACTED, scrub, scrubUrl } from "./log";
import { callerIdFrom, checkRateLimit, memoryRateLimitStore, RATE_LIMITS, rateLimitKey, windowStart } from "./rate-limit";
import { memoryLedger, processOnce, verifyHmac, verifyStandardWebhook } from "./webhooks";

describe("log scrubbing", () => {
  it("removes emails, phone numbers, tokens and bearer credentials from text", () => {
    const out = scrub("Contact ana@example.com or (469) 969-0244, token sk_live_51HxQwErTyUiOpAsDfGhJkL, Bearer abc.def.ghi") as string;
    expect(out).not.toMatch(/ana@example|969-0244|sk_live|abc\.def/);
    expect(out.split(REDACTED).length - 1).toBe(4);
  });

  it("redacts sensitive fields by name, whatever they hold", () => {
    expect(scrub({ email: "x", firstName: "Ana", password: "p", amount_cents: 500, nested: { authorization: "y", ok: true } })).toEqual({
      email: REDACTED,
      firstName: REDACTED,
      password: REDACTED,
      amount_cents: 500,
      nested: { authorization: REDACTED, ok: true },
    });
  });

  it("keeps only Hub and UTM keys in URLs and drops the fragment", () => {
    expect(scrubUrl("https://thesourceofhope.org/events?action=give&type=monthly&email=a%40b.com&utm_source=fb&session_id=cs_123#t=secret")).toBe(
      "https://thesourceofhope.org/events?action=give&type=monthly&utm_source=fb",
    );
    expect(scrubUrl("/link?token=abc&utm_campaign=spring")).toBe("/link?utm_campaign=spring");
  });

  it("writes one JSON line per call, scrubbed", () => {
    const lines: string[] = [];
    const log = createLogger("test", (line) => lines.push(line));
    log.info("signed up ana@example.com", { event: "e1", phone: "4699690244", error: new Error("for bob@example.com") });
    const row = JSON.parse(lines[0]);
    expect(row).toMatchObject({ level: "info", scope: "test", message: `signed up ${REDACTED}`, event: "e1", phone: REDACTED });
    expect(row.error.message).toBe(`for ${REDACTED}`);
  });
});

describe("rate limiting", () => {
  it("allows up to the limit in a window, then refuses with a retry time", async () => {
    const store = memoryRateLimitStore();
    const rule = { name: "t", limit: 2, windowSeconds: 60 };
    const now = new Date("2027-01-01T00:00:10Z");
    expect(await checkRateLimit(store, rule, "1.2.3.4", now)).toEqual({ allowed: true, remaining: 1, retryAfterSeconds: 0 });
    expect(await checkRateLimit(store, rule, "1.2.3.4", now)).toEqual({ allowed: true, remaining: 0, retryAfterSeconds: 0 });
    expect(await checkRateLimit(store, rule, "1.2.3.4", now)).toEqual({ allowed: false, remaining: 0, retryAfterSeconds: 50 });
    // Another caller, and the next window, start fresh.
    expect((await checkRateLimit(store, rule, "5.6.7.8", now)).allowed).toBe(true);
    expect((await checkRateLimit(store, rule, "1.2.3.4", new Date("2027-01-01T00:01:00Z"))).allowed).toBe(true);
  });

  it("never stores the caller id in the clear", () => {
    const key = rateLimitKey(RATE_LIMITS.newsletter, "203.0.113.9");
    expect(key).toMatch(/^newsletter:[0-9a-f]{32}$/);
    expect(key).not.toContain("203.0.113.9");
  });

  it("windows are aligned and the caller comes from the forwarded header", () => {
    expect(windowStart(new Date("2027-01-01T00:09:59Z"), 600).toISOString()).toBe("2027-01-01T00:00:00.000Z");
    expect(callerIdFrom(new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" }))).toBe("203.0.113.9");
    expect(callerIdFrom(new Headers())).toBe("unknown");
  });
});

describe("webhooks", () => {
  it("verifies a plain HMAC and rejects a wrong or missing one", () => {
    const payload = '{"envelopeId":"e1"}';
    const signature = createHmac("sha256", "s3cret").update(payload).digest("base64");
    expect(verifyHmac({ payload, signature, secret: "s3cret" })).toBe(true);
    expect(verifyHmac({ payload: `${payload} `, signature, secret: "s3cret" })).toBe(false);
    expect(verifyHmac({ payload, signature: null, secret: "s3cret" })).toBe(false);
  });

  it("verifies Standard Webhooks signatures and rejects replays", () => {
    const raw = Buffer.from("supabase-hook-secret").toString("base64");
    const secret = `v1,whsec_${raw}`;
    const payload = '{"user":{"id":"u1"}}';
    const now = new Date("2027-01-01T00:00:00Z");
    const ts = String(now.getTime() / 1000);
    const sig = createHmac("sha256", Buffer.from(raw, "base64")).update(`msg_1.${ts}.${payload}`).digest("base64");
    const headers = new Headers({ "webhook-id": "msg_1", "webhook-timestamp": ts, "webhook-signature": `v1,bogus v1,${sig}` });
    expect(verifyStandardWebhook({ payload, headers, secret, now })).toBe(true);
    expect(verifyStandardWebhook({ payload, headers, secret, now: new Date(now.getTime() + 10 * 60 * 1000) })).toBe(false);
    expect(verifyStandardWebhook({ payload: "{}", headers, secret, now })).toBe(false);
  });

  it("runs a handler once per provider event and retries failures", async () => {
    const ledger = memoryLedger();
    const event = { provider: "stripe", externalEventId: "evt_1", type: "payment_intent.succeeded" };
    const handler = vi.fn().mockResolvedValue(undefined);
    expect(await processOnce(ledger, event, handler)).toBe("processed");
    expect(await processOnce(ledger, event, handler)).toBe("duplicate");
    expect(handler).toHaveBeenCalledTimes(1);

    const failing = vi.fn().mockRejectedValueOnce(new Error("db down")).mockResolvedValueOnce(undefined);
    const second = { ...event, externalEventId: "evt_2" };
    await expect(processOnce(ledger, second, failing)).rejects.toThrow("db down");
    expect(ledger.entries.get("stripe:evt_2")).toMatchObject({ status: "failed", error: "db down" });
    expect(await processOnce(ledger, second, failing)).toBe("processed");
  });
});

describe("environment", () => {
  const deployed = {
    REQUIRE_ENV: "1",
    NEXT_PUBLIC_SANITY_PROJECT_ID: "abc",
    NEXT_PUBLIC_SANITY_DATASET: "staging",
    NEXT_PUBLIC_SITE_URL: "https://next.thesourceofhope.org",
    NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
    SUPABASE_SERVICE_ROLE_KEY: "service",
    SUPABASE_AUTH_HOOK_SECRET: "v1,whsec_x",
    RESEND_API_KEY: "re_x",
    EMAIL_FROM: "The Source of Hope <hello@thesourceofhope.org>",
    CRON_SECRET: "cron",
  };

  it("isn't checked for local and CI builds", () => {
    expect(envProblems({})).toEqual([]);
  });

  it("fails a deployed build that's missing a required variable, naming it but not values", () => {
    expect(envProblems(deployed)).toEqual([]);
    const missing = { ...deployed, RESEND_API_KEY: "", NEXT_PUBLIC_SITE_URL: "not a url" };
    const problems = envProblems(missing);
    expect(problems.some((p) => p.startsWith("RESEND_API_KEY"))).toBe(true);
    expect(problems.some((p) => p.startsWith("NEXT_PUBLIC_SITE_URL"))).toBe(true);
    expect(problems.join(" ")).not.toContain("not a url");
    expect(() => assertEnv(missing)).toThrow(/RESEND_API_KEY/);
  });
});

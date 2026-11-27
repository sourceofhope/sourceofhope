import { beforeEach, describe, expect, it, vi } from "vitest";

// A plain stub, not vi.fn(): Vitest reports errors thrown inside tracked mocks
// even when the code under test catches them.
const calls: unknown[] = [];
let sendImpl: () => Promise<string> = async () => "id";
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": "203.0.113.9" }) }));
vi.mock("@/lib/db/client", () => ({ isDatabaseConfigured: () => false }));
vi.mock("@/lib/email/send", () => ({
  sendEmail: (mail: unknown) => {
    calls.push(mail);
    return sendImpl();
  },
}));

const valid = { name: "Ana Diaz", email: "ana@example.com", phone: "", topic: "general" as const, message: "Hello, I have a question.", company: "" };

describe("sendContactMessage", () => {
  beforeEach(() => {
    calls.length = 0;
    sendImpl = async () => "id";
  });

  it("emails staff with reply-to set to the sender", async () => {
    const { sendContactMessage } = await import("./actions");
    expect(await sendContactMessage(valid)).toEqual({ status: "sent" });
    expect(calls).toEqual([expect.objectContaining({ to: "info@thesourceofhope.org", replyTo: "ana@example.com", tag: "contact-form" })]);
  });

  it("rejects bad input field by field, on the server too", async () => {
    const { sendContactMessage } = await import("./actions");
    expect(await sendContactMessage({ ...valid, email: "nope", message: "hi" })).toEqual({ status: "invalid", fields: { email: "email", message: "message" } });
    expect(calls).toHaveLength(0);
  });

  it("drops honeypot submissions without sending, and says sent", async () => {
    const { sendContactMessage } = await import("./actions");
    expect(await sendContactMessage({ ...valid, company: "Spam Inc" })).toEqual({ status: "sent" });
    expect(calls).toHaveLength(0);
  });

  it("reports a failure honestly when email can't be sent", async () => {
    const { sendContactMessage } = await import("./actions");
    sendImpl = () => Promise.reject(new Error("down"));
    expect(await sendContactMessage(valid)).toEqual({ status: "failed" });
  });
});

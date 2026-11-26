import { render } from "@react-email/render";
import { describe, expect, it } from "vitest";
import { SendEmailPayload, staffEmailFor } from "./send-email-hook";

const payload = (action: string) =>
  SendEmailPayload.parse({
    user: { id: "u1", email: "staff@example.org" },
    email_data: { token_hash: "pkce_abc123", redirect_to: "", email_action_type: action, site_url: "http://127.0.0.1:54321" },
  });

describe("Send Email hook", () => {
  it("builds a sign-in email linking to our confirm route, not Supabase", async () => {
    const email = staffEmailFor(payload("magiclink"), "https://next.thesourceofhope.org")!;
    expect(email).toMatchObject({ tag: "staff-sign-in", subject: "Your Staff Portal sign-in link" });
    const html = await render(email.body);
    expect(html).toContain("https://next.thesourceofhope.org/staff/auth/confirm?token_hash=pkce_abc123&amp;type=magiclink");
    expect(html).not.toContain("54321");
  });

  it("builds an invite email", () => {
    expect(staffEmailFor(payload("invite"), "https://x.org")).toMatchObject({ tag: "staff-invite" });
  });

  it("ignores actions staff never trigger", () => {
    expect(staffEmailFor(payload("recovery"), "https://x.org")).toBeNull();
    expect(staffEmailFor(payload("email_change"), "https://x.org")).toBeNull();
  });
});

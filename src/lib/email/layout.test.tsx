import { render } from "@react-email/render";
import { describe, expect, it } from "vitest";
import { EmailButton, EmailHeading, EmailLayout, EmailText } from "./layout";

describe("EmailLayout", () => {
  it("renders the preview, body, reason and contact footer in HTML and plain text", async () => {
    const email = (
      <EmailLayout lang="en-US" preview="Your sign-in link" reason="You asked to sign in to the TSOH staff portal.">
        <EmailHeading>Sign in</EmailHeading>
        <EmailText>This link works for one hour.</EmailText>
        <EmailButton href="https://example.org/link">Sign in</EmailButton>
      </EmailLayout>
    );
    const html = await render(email);
    expect(html).toContain('lang="en-US"');
    expect(html).toContain("Your sign-in link");
    expect(html).toContain("https://example.org/link");
    expect(html).toContain("(469) 969-0244");
    const text = await render(email, { plainText: true });
    expect(text).toContain("This link works for one hour.");
    expect(text).toContain("You asked to sign in to the TSOH staff portal.");
  });
});

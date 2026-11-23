import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { Alert } from "./alert";

describe("Alert", () => {
  it("errors interrupt (role=alert)", () => {
    renderWithIntl(
      <Alert tone="danger" title="Payment declined">
        Try another card.
      </Alert>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Payment declined");
  });

  it("other tones wait politely (role=status)", () => {
    renderWithIntl(<Alert tone="success">Signed up.</Alert>);
    expect(screen.getByRole("status")).toHaveTextContent("Signed up.");
  });

  it("urgency can be set explicitly", () => {
    renderWithIntl(
      <Alert tone="warning" urgency="assertive">
        Sign-ups close soon.
      </Alert>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

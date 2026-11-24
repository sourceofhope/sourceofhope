import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { Carousel } from "./carousel";

describe("Carousel", () => {
  // Indicators past the measured page count hide themselves, and jsdom has no
  // layout, so the dots are checked in e2e/styleguide.spec.ts instead.
  it("is named and has labelled controls", () => {
    renderWithIntl(
      <Carousel label="Event photos">
        <p>One</p>
        <p>Two</p>
        <p>Three</p>
      </Carousel>,
    );
    expect(screen.getAllByLabelText("Event photos").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "1 of 3" })).toHaveAttribute("aria-selected", "true");
  });
});

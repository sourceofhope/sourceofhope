import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { Steps } from "./steps";

describe("Steps", () => {
  it("says where you are and marks the current step", () => {
    renderWithIntl(<Steps steps={["Who's coming", "Details", "Confirm"]} current={2} />);
    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[0]).not.toHaveAttribute("aria-current");
  });
});

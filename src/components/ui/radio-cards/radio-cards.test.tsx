import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { RadioCards } from "./radio-cards";

describe("RadioCards", () => {
  it("is a named group whose cards choose with a click or the arrow keys", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderWithIntl(
      <RadioCards
        label="Sign up as"
        description="You can change this later."
        options={[
          { value: "guest", label: "Guest", description: "Come to the event." },
          { value: "volunteer", label: "Volunteer", description: "Help run it." },
        ]}
        onValueChange={onValueChange}
      />,
    );
    const group = screen.getByRole("radiogroup", { name: "Sign up as" });
    expect(group).toHaveAccessibleDescription("You can change this later.");

    await user.click(screen.getByText("Help run it."));
    const volunteer = screen.getByRole("radio", { name: /Volunteer/ });
    expect(volunteer).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith("volunteer");

    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("radio", { name: /Guest/ })).toBeChecked();
  });

  it("shows an error and marks the group invalid", () => {
    renderWithIntl(<RadioCards label="Amount" error="Choose an amount." options={[{ value: "25", label: "$25" }]} />);
    const group = screen.getByRole("radiogroup", { name: "Amount" });
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAccessibleDescription("Choose an amount.");
  });
});

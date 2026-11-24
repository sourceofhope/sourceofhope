import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { Select } from "./select";

const sizes = [
  { value: "s", label: "Small" },
  { value: "m", label: "Medium" },
  { value: "l", label: "Large" },
] as const;

describe("Select", () => {
  it("is labelled, shows the placeholder, and picks an option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderWithIntl(<Select label="Shirt size" placeholder="Choose a size" options={sizes} onValueChange={onValueChange} />);

    const trigger = screen.getByRole("combobox", { name: "Shirt size" });
    expect(trigger).toHaveTextContent("Choose a size");

    await user.click(trigger);
    await user.click(await screen.findByRole("option", { name: "Medium" }));
    expect(onValueChange).toHaveBeenCalledWith("m");
    expect(trigger).toHaveTextContent("Medium");
  });

  it("can hide its label (the language dropdown)", () => {
    renderWithIntl(<Select label="Language" hideLabel options={sizes} defaultValue="s" />);
    expect(screen.getByRole("combobox", { name: "Language" })).toHaveTextContent("Small");
  });
});

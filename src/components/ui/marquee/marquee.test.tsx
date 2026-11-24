import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { Marquee } from "./marquee";

describe("Marquee", () => {
  it("exposes one list of items and hides the looping copy", () => {
    renderWithIntl(
      <Marquee label="Our sponsors">
        <span>Sponsor A</span>
        <span>Sponsor B</span>
      </Marquee>,
    );
    const region = screen.getByRole("region", { name: "Our sponsors" });
    expect(region).toBeInTheDocument();
    // The copy is aria-hidden, so the accessible tree has one list of two.
    expect(screen.getAllByRole("list")).toHaveLength(1);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    const lists = region.querySelectorAll("ul");
    expect(lists).toHaveLength(2);
    expect(lists[1]).toHaveAttribute("aria-hidden", "true");
    expect(lists[1]).toHaveAttribute("inert");
  });

  it("sets a constant speed from the item count and can pause", async () => {
    const user = userEvent.setup();
    const { container } = renderWithIntl(
      <Marquee label="Our sponsors" secondsPerItem={5}>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </Marquee>,
    );
    const track = container.querySelector<HTMLElement>(".animate-marquee");
    expect(track?.style.getPropertyValue("--marquee-duration")).toBe("15s");

    const toggle = screen.getByRole("button", { name: "Pause moving content" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Play moving content" })).toHaveAttribute("aria-pressed", "true");
    expect(track?.className).toContain("animation-paused");
  });
});

import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { Accordion, AccordionItem, Disclosure } from "./accordion";

describe("Accordion", () => {
  it("puts each trigger in a heading and toggles its panel", async () => {
    const user = userEvent.setup();
    renderWithIntl(
      <Accordion>
        <AccordionItem value="food" title="Do I need to register for food?" level={3}>
          No. Come to any event.
        </AccordionItem>
        <AccordionItem value="age" title="Can teens volunteer?" level={3}>
          Yes, from 14 with a guardian.
        </AccordionItem>
      </Accordion>,
    );
    const heading = screen.getByRole("heading", { level: 3, name: "Do I need to register for food?" });
    const trigger = screen.getByRole("button", { name: "Do I need to register for food?" });
    expect(heading).toContainElement(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("No. Come to any event.")).toBeVisible();
  });
});

describe("Disclosure", () => {
  it("shows and hides its content", async () => {
    const user = userEvent.setup();
    renderWithIntl(<Disclosure label="How volunteering works">Pick a shift.</Disclosure>);
    const trigger = screen.getByRole("button", { name: "How volunteering works" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Pick a shift.")).toBeVisible();
  });
});

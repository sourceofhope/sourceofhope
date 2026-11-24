import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { Tab, Tabs, TabsList, TabsPanel } from "./tabs";

describe("Tabs", () => {
  it("switches panels with the arrow keys", async () => {
    const user = userEvent.setup();
    renderWithIntl(
      <Tabs defaultValue="guest">
        <TabsList aria-label="Sign up as">
          <Tab value="guest">Guest</Tab>
          <Tab value="volunteer">Volunteer</Tab>
        </TabsList>
        <TabsPanel value="guest">Guest form</TabsPanel>
        <TabsPanel value="volunteer">Volunteer form</TabsPanel>
      </Tabs>,
    );
    expect(screen.getByRole("tablist")).toHaveAccessibleName("Sign up as");
    const guest = screen.getByRole("tab", { name: "Guest" });
    expect(guest).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Guest form");

    guest.focus();
    await user.keyboard("{ArrowRight}");
    const volunteer = screen.getByRole("tab", { name: "Volunteer" });
    expect(volunteer).toHaveFocus();
    expect(volunteer).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Volunteer form");
  });
});

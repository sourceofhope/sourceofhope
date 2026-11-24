import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { Menu, MenuLink } from "./menu";

describe("Menu", () => {
  it("opens a menu of links from the keyboard", async () => {
    const user = userEvent.setup();
    renderWithIntl(
      <Menu label="About">
        <MenuLink href="/about">Our story</MenuLink>
        <MenuLink href="/team">Our team</MenuLink>
      </Menu>,
    );
    const trigger = screen.getByRole("button", { name: "About" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");

    trigger.focus();
    await user.keyboard("{Enter}");
    const menu = await screen.findByRole("menu");
    expect(menu).toBeInTheDocument();
    const items = screen.getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual(["Our story", "Our team"]);
    expect(items[1]).toHaveAttribute("href", "/team");
  });
});

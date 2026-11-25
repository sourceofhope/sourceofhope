import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithIntl, screen, waitFor, within } from "../../../../test/render";
import { currentHref } from "./nav";
import { SiteHeader } from "./site-header";

let pathname = "/events";
vi.mock("@/i18n/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/i18n/navigation")>()),
  usePathname: () => pathname,
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

beforeEach(() => {
  pathname = "/events";
});

describe("currentHref", () => {
  it("picks the most specific matching section", () => {
    const hrefs = ["/media", "/media/awards", "/programs", "/programs/servingHope"];
    expect(currentHref("/media/awards", hrefs)).toBe("/media/awards");
    expect(currentHref("/media/press-2024", hrefs)).toBe("/media");
    expect(currentHref("/mediakit", hrefs)).toBeUndefined();
    expect(currentHref("/media", hrefs)).toBe("/media");
    expect(currentHref("/programs/servingHope/faq", hrefs)).toBe("/programs/servingHope");
    expect(currentHref("/", hrefs)).toBeUndefined();
  });
});

describe("SiteHeader", () => {
  it("has the main nav, marks the current section, and links home", () => {
    renderWithIntl(<SiteHeader />);
    expect(screen.getByRole("link", { name: "The Source of Hope" })).toHaveAttribute("href", "/");
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "Events" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Programs" })).not.toHaveAttribute("aria-current");
    expect(within(nav).getByRole("button", { name: "About" })).toBeInTheDocument();
  });

  it("Hub actions are real links that open the Hub on the current page", () => {
    renderWithIntl(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Give" })).toHaveAttribute("href", "/events?action=give");
    expect(screen.getByRole("link", { name: "Volunteer" })).toHaveAttribute("href", "/events?action=volunteer");
    expect(screen.getByRole("link", { name: "Get Help" })).toHaveAttribute("href", "/events?action=help");
  });

  it("is solid on inner pages and transparent over the homepage hero", () => {
    const { unmount } = renderWithIntl(<SiteHeader />);
    expect(screen.getByRole("banner")).not.toHaveAttribute("data-transparent");
    unmount();
    pathname = "/";
    renderWithIntl(<SiteHeader />);
    expect(screen.getByRole("banner")).toHaveAttribute("data-transparent");
  });

  it("the phone menu opens a sheet with the three actions and closes when a link is used", async () => {
    const user = userEvent.setup();
    renderWithIntl(<SiteHeader />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);
    const sheet = await screen.findByRole("dialog", { name: "Main" });
    for (const name of ["Get Help", "Volunteer", "Give"]) {
      expect(within(sheet).getByRole("link", { name })).toBeInTheDocument();
    }
    await user.click(within(sheet).getByRole("button", { name: "Programs" }));
    expect(within(sheet).getByRole("link", { name: "Serving and Sharing Hope" })).toHaveAttribute("href", "/programs/servingHope");

    await user.click(within(sheet).getByRole("link", { name: "Events" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});

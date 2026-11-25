import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithIntl, screen, within } from "../../../../test/render";
import { NewsletterForm } from "./newsletter-form";
import { SiteFooter } from "./site-footer";

vi.mock("@/i18n/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/i18n/navigation")>()),
  usePathname: () => "/about",
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

describe("SiteFooter", () => {
  it("has the footer nav, contact details and legal links", () => {
    renderWithIntl(<SiteFooter />);
    const nav = screen.getByRole("navigation", { name: "Footer" });
    expect(within(nav).getByRole("link", { name: "Community Sponsors" })).toHaveAttribute("href", "/about?action=give&type=business");
    expect(within(nav).getByRole("link", { name: "Our Story" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "(469) 969-0244" })).toHaveAttribute("href", "tel:+14699690244");
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute("href", expect.stringContaining("instagram.com"));
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByText(/EIN 46-2491772/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Candid/ })).toHaveAttribute("href", expect.stringContaining("candid.org"));
  });
});

describe("NewsletterForm", () => {
  it("checks the address, then says sign-up isn't connected until Phase 2", async () => {
    const user = userEvent.setup();
    renderWithIntl(<NewsletterForm />);
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    expect(await screen.findByText("Enter an email address like name@example.com.")).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: "Email address" }), "ada@example.com");
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    expect(await screen.findByText(/isn't connected yet/)).toBeInTheDocument();
  });

  it("calls subscribe with the address once wired", async () => {
    const user = userEvent.setup();
    const subscribe = vi.fn().mockResolvedValue(undefined);
    renderWithIntl(<NewsletterForm subscribe={subscribe} />);
    await user.type(screen.getByRole("textbox", { name: "Email address" }), "ada@example.com");
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    await vi.waitFor(() => expect(subscribe).toHaveBeenCalledWith("ada@example.com"));
  });
});

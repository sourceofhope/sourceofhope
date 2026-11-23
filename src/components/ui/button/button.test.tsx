import { describe, expect, it, vi } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { Button, IconButton, LinkButton } from "./button";
import { buttonStyles } from "./button.styles";

describe("Button", () => {
  it("renders a real button with its required type", () => {
    renderWithIntl(<Button type="submit">Give</Button>);
    const button = screen.getByRole("button", { name: "Give" });
    expect(button).toHaveAttribute("type", "submit");
  });

  it("loading: disables, marks busy and announces Working… from messages", () => {
    const onClick = vi.fn();
    renderWithIntl(
      <Button type="button" loading onClick={onClick}>
        Give $50
      </Button>,
    );
    const button = screen.getByRole("button", { name: /Give \$50/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveTextContent("Working…");
    button.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("maps variants to semantic tokens only", () => {
    expect(buttonStyles({ variant: "primary" })).toContain("bg-action");
    expect(buttonStyles({ variant: "secondary" })).toContain("border-action");
    expect(buttonStyles({ variant: "secondary", surface: "inverse" })).toContain("text-on-inverse");
    expect(buttonStyles({ variant: "secondary", surface: "inverse" })).not.toContain("text-action");
    expect(buttonStyles({ size: "lg" })).toContain("min-h-13");
  });

  it("uses the inverse focus ring on dark surfaces", () => {
    expect(buttonStyles({ surface: "inverse" })).toContain("focus-visible:ring-focus-inverse");
    expect(buttonStyles({})).toContain("focus-visible:ring-focus");
  });
});

describe("LinkButton", () => {
  it("renders a locale-aware link, not a button", () => {
    renderWithIntl(<LinkButton href="/events">See events</LinkButton>);
    const link = screen.getByRole("link", { name: "See events" });
    expect(link).toHaveAttribute("href", "/events");
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("IconButton", () => {
  it("uses the required label as its accessible name and defaults to type=button", () => {
    renderWithIntl(<IconButton label="Close" icon={<svg aria-hidden="true" />} />);
    const button = screen.getByRole("button", { name: "Close" });
    expect(button).toHaveAttribute("type", "button");
    expect(button.className).toContain("size-11");
  });
});

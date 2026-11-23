import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { ExternalLink, TextLink } from "./link";

describe("TextLink", () => {
  it("renders a locale-aware internal link", () => {
    renderWithIntl(<TextLink href="/about">Our story</TextLink>);
    expect(screen.getByRole("link", { name: "Our story" })).toHaveAttribute("href", "/about");
  });
});

describe("ExternalLink", () => {
  it("stays in the same tab by default", () => {
    renderWithIntl(<ExternalLink href="https://211texas.org">211 Texas</ExternalLink>);
    const link = screen.getByRole("link", { name: "211 Texas" });
    expect(link).not.toHaveAttribute("target");
  });

  it("announces a new tab and protects the opener", () => {
    renderWithIntl(
      <ExternalLink href="https://example.org/form" newTab>
        Apply online
      </ExternalLink>,
    );
    const link = screen.getByRole("link", { name: /Apply online.*opens in a new tab/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows no ↗ icon for phone and email links", () => {
    renderWithIntl(<ExternalLink href="tel:+14699690244">(469) 969-0244</ExternalLink>);
    expect(screen.getByRole("link").querySelector("svg")).toBeNull();
  });
});

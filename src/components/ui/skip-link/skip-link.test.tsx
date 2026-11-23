import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { SkipLink } from "./skip-link";

describe("SkipLink", () => {
  it("targets #main and takes its label from messages", () => {
    renderWithIntl(<SkipLink />);
    const link = screen.getByRole("link", { name: "Skip to content" });
    expect(link).toHaveAttribute("href", "#main");
    expect(link.className).toContain("sr-only");
    expect(link.className).toContain("focus:not-sr-only");
  });
});

import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { Badge, badgeStyles } from "./badge";

describe("Badge", () => {
  it("renders its word, which carries the meaning", () => {
    renderWithIntl(<Badge tone="public">Open to the public</Badge>);
    expect(screen.getByText("Open to the public").className).toContain("bg-tone-public");
  });

  it("every tone uses a token pair checked for contrast", () => {
    for (const tone of ["public", "volunteer", "neutral", "danger", "success", "warning", "info"] as const) {
      expect(badgeStyles({ tone })).toMatch(/bg-(tone-|success|warning|info)/);
    }
  });
});

import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { Card, CardLink } from "./card";

describe("Card", () => {
  it("has exactly one link, stretched over the card", () => {
    renderWithIntl(
      <Card interactive>
        <h3>
          <CardLink href="/programs/servingHope">Serving and Sharing Hope</CardLink>
        </h3>
        <p>Monthly meal service.</p>
      </Card>,
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName("Serving and Sharing Hope");
    expect(links[0].className).toContain("after:inset-0");
    expect(screen.getByRole("article").className).toContain("relative");
  });

  it("renders as a list item inside lists", () => {
    renderWithIntl(
      <ul>
        <Card as="li">x</Card>
      </ul>,
    );
    expect(screen.getByRole("listitem")).toBeInTheDocument();
  });
});

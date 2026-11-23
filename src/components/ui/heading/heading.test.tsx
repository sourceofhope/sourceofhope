import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { Eyebrow, Heading } from "./heading";

describe("Heading", () => {
  it("renders the semantic level with a default size per level", () => {
    renderWithIntl(<Heading level={2}>Upcoming events</Heading>);
    const h = screen.getByRole("heading", { level: 2, name: "Upcoming events" });
    expect(h.className).toContain("text-3xl");
    expect(h.className).toContain("font-heading");
  });

  it("keeps level and visual size independent", () => {
    renderWithIntl(
      <Heading level={1} size="5xl">
        Hero
      </Heading>,
    );
    expect(screen.getByRole("heading", { level: 1 }).className).toContain("text-5xl");
  });

  it("inverts on dark surfaces", () => {
    renderWithIntl(
      <Heading level={3} surface="inverse">
        On video
      </Heading>,
    );
    expect(screen.getByRole("heading", { level: 3 }).className).toContain("text-on-inverse");
  });
});

describe("Eyebrow", () => {
  it("is a paragraph, not a heading", () => {
    renderWithIntl(<Eyebrow>The Source of Hope</Eyebrow>);
    expect(screen.queryByRole("heading")).toBeNull();
    expect(screen.getByText("The Source of Hope").tagName).toBe("P");
  });
});

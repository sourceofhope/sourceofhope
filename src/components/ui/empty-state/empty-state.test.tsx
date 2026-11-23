import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { Skeleton } from "../skeleton";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("uses the given heading level and shows the next action", () => {
    renderWithIntl(
      <EmptyState title="No volunteer shifts are open right now." level={3} action={<a href="#news">Get updates</a>}>
        New dates are added every month.
      </EmptyState>,
    );
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("No volunteer shifts are open right now.");
    expect(screen.getByRole("link", { name: "Get updates" })).toBeInTheDocument();
  });
});

describe("Skeleton", () => {
  it("is decorative and holds still under reduced motion", () => {
    const { container } = renderWithIntl(<Skeleton className="h-6 w-40" />);
    const block = container.firstElementChild!;
    expect(block).toHaveAttribute("aria-hidden", "true");
    expect(block.className).toContain("motion-reduce:animate-none");
  });
});

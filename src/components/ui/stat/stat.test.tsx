import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { Stat, StatList } from "./stat";

describe("Stat", () => {
  it("renders the real value in the HTML as a term/definition pair (no count-up)", () => {
    const { container } = renderWithIntl(
      <StatList>
        <Stat value="353,000" label="meals served" />
      </StatList>,
    );
    expect(container.querySelector("dl dt")).toHaveTextContent("meals served");
    expect(container.querySelector("dl dd")).toHaveTextContent("353,000");
    expect(screen.queryByText("0")).toBeNull();
  });
});

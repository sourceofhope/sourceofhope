import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { YouTubeEmbed } from "./youtube-embed";

describe("YouTubeEmbed", () => {
  it("loads nothing from YouTube until the play button is pressed", async () => {
    const user = userEvent.setup();
    const { container } = renderWithIntl(<YouTubeEmbed id="abc123" title="Back to School Bash 2025" />);
    expect(container.querySelector("iframe")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Play video: Back to School Bash 2025" }));
    const frame = screen.getByTitle("Back to School Bash 2025");
    expect(frame.getAttribute("src")).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\/abc123\?/);
  });
});

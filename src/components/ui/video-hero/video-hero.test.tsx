import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { VideoHero } from "./video-hero";

function mockMedia(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: reduced && query.includes("reduce"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("VideoHero", () => {
  it("plays with a pause button when motion is allowed", async () => {
    mockMedia(false);
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    const user = userEvent.setup();
    const { container } = renderWithIntl(
      <VideoHero sources={[{ src: "/hero.webm", type: "video/webm" }, { src: "/hero.mp4", type: "video/mp4" }]} poster="/hero.jpg">
        <h1>Empowering and providing hope</h1>
      </VideoHero>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(container.querySelector("video")).toHaveAttribute("aria-hidden", "true");
    expect(play).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Pause background video" }));
    expect(pause).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Play background video" })).toBeInTheDocument();
  });

  it("shows only the poster for reduced motion", () => {
    mockMedia(true);
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const { container } = renderWithIntl(
      <VideoHero sources={[{ src: "/hero.webm", type: "video/webm" }, { src: "/hero.mp4", type: "video/mp4" }]} poster="/hero.jpg">
        <h1>Hope</h1>
      </VideoHero>,
    );
    expect(play).not.toHaveBeenCalled();
    expect(container.querySelector("source")).toBeNull();
    expect(container.querySelector("video")).toHaveAttribute("poster", "/hero.jpg");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

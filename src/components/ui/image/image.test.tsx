import { describe, expect, it } from "vitest";
import { renderWithIntl, screen } from "../../../../test/render";
import { Image } from "./image";

describe("Image", () => {
  it("passes a real description through as alt", () => {
    renderWithIntl(<Image src="/v2/core/TSOH-Service.webp" width={600} height={400} alt="Volunteers plating meals" />);
    expect(screen.getByRole("img", { name: "Volunteers plating meals" })).toBeInTheDocument();
  });

  it("decorative images get an empty alt and leave the accessibility tree", () => {
    const { container } = renderWithIntl(<Image src="/v2/core/TSOH-Logo.webp" width={40} height={40} decorative />);
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("requires alt or decorative at the type level", () => {
    // @ts-expect-error neither alt nor decorative
    const missing = <Image src="/x.webp" width={1} height={1} />;
    // @ts-expect-error both at once
    const both = <Image src="/x.webp" width={1} height={1} alt="x" decorative />;
    expect([missing, both]).toHaveLength(2);
  });
});

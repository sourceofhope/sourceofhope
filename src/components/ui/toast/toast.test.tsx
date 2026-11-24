import userEvent from "@testing-library/user-event";
import { act } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { renderWithIntl, screen, waitFor } from "../../../../test/render";
import { toast, ToastRegion } from "./toast";

afterEach(() => {
  act(() => toast.dismiss());
});

describe("Toast", () => {
  it("shows a message from anywhere and can be dismissed", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ToastRegion />);
    act(() => {
      toast.success("You're signed up", { description: "We emailed your confirmation." });
    });
    expect(await screen.findByText("You're signed up")).toBeInTheDocument();
    expect(screen.getByText("We emailed your confirmation.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    await waitFor(() => expect(screen.queryByText("You're signed up")).not.toBeInTheDocument());
  });
});

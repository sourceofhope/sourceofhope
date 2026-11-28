import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithIntl, screen, waitFor } from "../../../../test/render";
import { Dialog, DialogCloseButton, DialogHeading } from "./dialog";

describe("Dialog", () => {
  it("opens from its trigger, is named by its title and returns focus on Escape", async () => {
    const user = userEvent.setup();
    renderWithIntl(
      <Dialog title="Get help" description="Food, events and services." trigger={<button type="button">Open</button>}>
        <p>Body</p>
      </Dialog>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Get help");
    expect(dialog).toHaveAccessibleDescription("Food, events and services.");
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("keeps a hidden title for screen readers", () => {
    renderWithIntl(
      <Dialog title="Menu" hideTitle defaultOpen>
        <p>Links</p>
      </Dialog>,
    );
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Menu");
  });

  it("reports close presses to a controlled owner", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderWithIntl(
      <Dialog title="Give" open onOpenChange={onOpenChange} footer={<span>Footer</span>}>
        <p>Body</p>
      </Dialog>,
    );
    expect(screen.getByText("Footer")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false, "close");
  });

  it("bare: children compose the panel; the heading names the dialog", () => {
    renderWithIntl(
      <Dialog bare open>
        <DialogHeading id="t" focusable>
          Get Help
        </DialogHeading>
        <DialogCloseButton />
      </Dialog>,
    );
    expect(screen.getByRole("dialog", { name: "Get Help" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Get Help" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });
});

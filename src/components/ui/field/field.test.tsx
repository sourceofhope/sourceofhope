import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { renderWithIntl, screen, waitFor } from "../../../../test/render";
import { Button } from "../button";
import { Checkbox, ErrorSummary, Field, Input, Textarea, useZodForm } from "./index";

describe("Field", () => {
  it("labels and describes its control, and marks optional fields", () => {
    renderWithIntl(
      <Field label="Phone" description="Only for event-day changes." optional>
        <Input name="phone" type="tel" />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Phone (optional)" });
    expect(input).toHaveAccessibleDescription("Only for event-day changes.");
  });

  it("shows an error from the form and marks the control invalid", () => {
    renderWithIntl(
      <Field label="Email" error="Enter an email address like name@example.com.">
        <Input name="email" type="email" />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(expect.stringContaining("Enter an email address"));
  });

  it("hides the label visually but keeps the name", () => {
    renderWithIntl(
      <Field label="Search" hideLabel>
        <Input name="q" />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByText("Search").className).toContain("sr-only");
  });

  it("renders a textarea", () => {
    renderWithIntl(
      <Field label="Message">
        <Textarea name="message" />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Message" }).tagName).toBe("TEXTAREA");
  });
});

describe("Checkbox", () => {
  it("toggles from its label", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    renderWithIntl(<Checkbox label="Email me about future events" onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole("checkbox", { name: "Email me about future events" });
    expect(box).not.toBeChecked();
    await user.click(screen.getByText("Email me about future events"));
    expect(box).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });
});

const schema = z.object({
  name: z.string().min(1, "Enter your name."),
  email: z.email("Enter an email address like name@example.com."),
});

function ContactForm({ onValid }: { onValid: (values: z.output<typeof schema>) => void }) {
  const form = useZodForm(schema, { defaultValues: { name: "", email: "" } });
  const { errors, isSubmitted } = form.formState;
  const summary = [
    errors.name?.message ? { fieldId: "name", message: errors.name.message } : null,
    errors.email?.message ? { fieldId: "email", message: errors.email.message } : null,
  ].filter((item) => item !== null);
  return (
    <form noValidate onSubmit={form.handleSubmit(onValid)}>
      {isSubmitted ? <ErrorSummary errors={summary} /> : null}
      <Field label="Name" error={errors.name?.message}>
        <Input id="name" {...form.register("name")} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <Input id="email" type="email" {...form.register("email")} />
      </Field>
      <Button type="submit">Send</Button>
    </form>
  );
}

describe("useZodForm with ErrorSummary", () => {
  it("lists every problem, focuses the summary, and jumps to a field", async () => {
    const user = userEvent.setup();
    const onValid = vi.fn();
    renderWithIntl(<ContactForm onValid={onValid} />);

    await user.click(screen.getByRole("button", { name: "Send" }));
    const summary = await screen.findByRole("alert");
    expect(summary).toHaveTextContent("There are 2 problems with this form.");
    await waitFor(() => expect(summary).toHaveFocus());
    expect(onValid).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute("aria-invalid", "true");

    await user.click(screen.getByRole("link", { name: "Enter your name." }));
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus();
  });

  it("submits parsed values once the form is valid", async () => {
    const user = userEvent.setup();
    const onValid = vi.fn();
    renderWithIntl(<ContactForm onValid={onValid} />);
    await user.type(screen.getByRole("textbox", { name: "Name" }), "Ada");
    await user.type(screen.getByRole("textbox", { name: "Email" }), "ada@example.com");
    await user.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(onValid).toHaveBeenCalledWith({ name: "Ada", email: "ada@example.com" }, expect.anything()));
  });
});

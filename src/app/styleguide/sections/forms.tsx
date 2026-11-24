"use client";

import { Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox, ErrorSummary, Field, Input, Textarea, useZodForm } from "@/components/ui/field";
import { Heading } from "@/components/ui/heading";
import { RadioCards } from "@/components/ui/radio-cards";
import { Select } from "@/components/ui/select";
import { Steps } from "@/components/ui/steps";
import { toast } from "@/components/ui/toast";

const SHIRT_SIZES = [
  { value: "s", label: "Small" },
  { value: "m", label: "Medium" },
  { value: "l", label: "Large" },
  { value: "xl", label: "X-Large" },
] as const;

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email: z.email("Enter an email address like name@example.com."),
  phone: z.string().optional(),
  role: z.enum(["guest", "volunteer"], { error: "Choose how you're coming." }),
  shirt: z.enum(["s", "m", "l", "xl"], { error: "Choose a shirt size." }),
  notes: z.string().max(500, "Keep notes under 500 characters.").optional(),
  updates: z.boolean(),
});

const FIELD_ORDER = ["name", "email", "role", "shirt", "notes"] as const;

function DemoForm() {
  const form = useZodForm(schema, {
    defaultValues: { name: "", email: "", phone: "", notes: "", updates: false },
  });
  const { errors, isSubmitted } = form.formState;
  const summary = FIELD_ORDER.flatMap((name) => {
    const message = errors[name]?.message;
    return message ? [{ fieldId: `demo-${name}`, message }] : [];
  });

  return (
    <form
      noValidate
      className="flex max-w-xl flex-col gap-6"
      onSubmit={form.handleSubmit(() => {
        toast.success("Form is valid", { description: "Nothing was sent; this is the styleguide." });
      })}
    >
      {isSubmitted ? <ErrorSummary errors={summary} /> : null}
      <Field label="Full name" error={errors.name?.message}>
        <Input id="demo-name" autoComplete="name" {...form.register("name")} />
      </Field>
      <Field label="Email" description="We send your confirmation here." error={errors.email?.message}>
        <Input id="demo-email" type="email" autoComplete="email" {...form.register("email")} />
      </Field>
      <Field label="Phone" optional description="Only for event-day changes.">
        <Input id="demo-phone" type="tel" autoComplete="tel" {...form.register("phone")} />
      </Field>
      <Controller
        control={form.control}
        name="role"
        render={({ field, fieldState }) => (
          <RadioCards
            label="How are you coming?"
            options={[
              { value: "guest", label: "As a guest", description: "Come to the event and enjoy it." },
              { value: "volunteer", label: "As a volunteer", description: "Help us run it. You'll pick a shift next." },
            ]}
            value={field.value ?? null}
            onValueChange={field.onChange}
            name={field.name}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="shirt"
        render={({ field, fieldState }) => (
          <Select
            label="Volunteer shirt size"
            placeholder="Choose a size"
            options={SHIRT_SIZES}
            value={field.value ?? null}
            onValueChange={(value) => field.onChange(value ?? undefined)}
            name={field.name}
            error={fieldState.error?.message}
          />
        )}
      />
      <Field label="Anything we should know?" optional error={errors.notes?.message}>
        <Textarea id="demo-notes" {...form.register("notes")} />
      </Field>
      <Controller
        control={form.control}
        name="updates"
        render={({ field }) => (
          <Checkbox
            label="Email me about future events"
            description="About one email a month. Unsubscribe any time."
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked === true)}
            name={field.name}
          />
        )}
      />
      <div>
        <Button type="submit">Check the form</Button>
      </div>
    </form>
  );
}

export function FormsSection() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Heading level={3} size="xl">
          Steps
        </Heading>
        <div className="max-w-xl">
          <Steps steps={["Who's coming", "Details", "Agreement", "Confirm"]} current={2} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Heading level={3} size="xl">
          A whole form
        </Heading>
        <p className="max-w-prose text-muted">
          useZodForm + Field, Input, Textarea, Select, RadioCards, Checkbox and ErrorSummary. Press the button with the form
          empty to see every error state; errors then update as you fix them.
        </p>
        <DemoForm />
      </div>

      <div className="flex flex-col gap-3">
        <Heading level={3} size="xl">
          States
        </Heading>
        <div className="grid max-w-3xl gap-6 md:grid-cols-2">
          <Field label="Disabled" disabled>
            <Input defaultValue="Can't change this" />
          </Field>
          <Field label="With an error" error="Enter a date in the future.">
            <Input defaultValue="01/01/2020" />
          </Field>
          <Select label="Language" hideLabel options={[{ value: "en-US", label: "English" }, { value: "es-US", label: "Español" }]} defaultValue="en-US" />
          <RadioCards
            label="Gift amount"
            layout="grid"
            defaultValue="50"
            options={[
              { value: "25", label: "$25" },
              { value: "50", label: "$50" },
              { value: "100", label: "$100" },
              { value: "250", label: "$250" },
              { value: "500", label: "$500" },
              { value: "other", label: "Other" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

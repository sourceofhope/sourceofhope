"use client";

import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ErrorSummary, Field, Input, Textarea, useZodForm } from "@/components/ui/field";
import { TextLink } from "@/components/ui/link";
import { Select } from "@/components/ui/select";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { ORGANIZATION } from "@/content/organization";
import { sendContactMessage } from "./actions";
import { CONTACT_TOPICS, contactSchema, type ContactResult, type ContactValues } from "./schema";

const FIELD_ORDER = ["name", "email", "phone", "topic", "message"] as const;

/** ContactForm (spec §9.9): name, email, phone (optional), topic, message. */
export function ContactForm() {
  const t = useTranslations("Contact");
  const form = useZodForm(contactSchema, { defaultValues: { name: "", email: "", phone: "", message: "", company: "" } });
  const [result, setResult] = useState<ContactResult | null>(null);
  const { errors, isSubmitted, isSubmitting } = form.formState;
  const topics = useMemo(() => CONTACT_TOPICS.map((value) => ({ value, label: t(`topics.${value}`) })), [t]);

  // Server errors (if the browser check was bypassed) show on the same fields.
  const serverFields = result?.status === "invalid" ? result.fields : {};
  const errorFor = (name: keyof ContactValues) => {
    const key = errors[name]?.message ?? serverFields[name];
    return key ? t(`errors.${key}` as "errors.name") : undefined;
  };
  const summary = FIELD_ORDER.flatMap((name) => (errorFor(name) ? [{ fieldId: `contact-${name}`, message: errorFor(name)! }] : []));

  if (result?.status === "sent") {
    return <Alert tone="success">{t("sent")}</Alert>;
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(async (values) => setResult(await sendContactMessage(values)))}
    >
      {isSubmitted && summary.length ? <ErrorSummary errors={summary} /> : null}
      {result?.status === "failed" ? <Alert tone="danger">{t("failed", { email: ORGANIZATION.email.display })}</Alert> : null}
      {result?.status === "too_many" ? <Alert tone="warning">{t("tooMany")}</Alert> : null}

      <Field label={t("fields.name")} error={errorFor("name")}>
        <Input id="contact-name" autoComplete="name" {...form.register("name")} />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={t("fields.email")} error={errorFor("email")}>
          <Input id="contact-email" type="email" autoComplete="email" {...form.register("email")} />
        </Field>
        <Field label={t("fields.phone")} optional error={errorFor("phone")}>
          <Input id="contact-phone" type="tel" autoComplete="tel" {...form.register("phone")} />
        </Field>
      </div>
      <Controller
        control={form.control}
        name="topic"
        render={({ field }) => (
          <Select
            label={t("fields.topic")}
            placeholder={t("fields.topicPlaceholder")}
            options={topics}
            value={field.value ?? null}
            onValueChange={(v) => field.onChange(v ?? undefined)}
            name={field.name}
            error={errorFor("topic")}
          />
        )}
      />
      <Field label={t("fields.message")} error={errorFor("message")}>
        <Textarea id="contact-message" rows={6} maxLength={2000} {...form.register("message")} />
      </Field>

      {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
      <VisuallyHidden aria-hidden="true">
        <label>
          {t("fields.company")}
          <input type="text" tabIndex={-1} autoComplete="off" {...form.register("company")} />
        </label>
      </VisuallyHidden>

      <p className="text-sm text-muted">
        {t.rich("privacy", { link: (chunks) => <TextLink href="/privacy">{chunks}</TextLink> })}
      </p>
      <div>
        <Button type="submit" loading={isSubmitting}>
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}

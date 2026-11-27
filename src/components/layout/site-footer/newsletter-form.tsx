"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input, useZodForm } from "@/components/ui/field";
import { TextLink } from "@/components/ui/link";

export type NewsletterFormProps = {
  /**
   * Adds the address to the Constant Contact list (spec §9.9). Wired in
   * slice 4.7; until then the form validates and says sign-up isn't connected.
   */
  subscribe?: (email: string) => Promise<void>;
};

/** NewsletterForm: one email field and Sign up (footer, News & Media). */
export function NewsletterForm({ subscribe }: NewsletterFormProps) {
  const t = useTranslations("Shell.footer");
  const schema = useMemo(() => z.object({ email: z.email(t("emailInvalid")) }), [t]);
  const form = useZodForm(schema, { defaultValues: { email: "" } });
  const [notice, setNotice] = useState<string | null>(null);
  const error = form.formState.errors.email?.message;

  return (
    <form
      noValidate
      className="flex flex-col gap-3"
      onSubmit={form.handleSubmit(async ({ email }) => {
        if (subscribe) await subscribe(email);
        else setNotice(t("newsletterPending"));
      })}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <Field label={t("email")} error={error}>
            <Input type="email" autoComplete="email" {...form.register("email")} />
          </Field>
        </div>
        <div className="sm:pt-8">
          <Button type="submit" loading={form.formState.isSubmitting}>
            {t("signUp")}
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted">{t.rich("newsletterPrivacy", { link: (chunks) => <TextLink href="/privacy">{chunks}</TextLink> })}</p>
      {notice ? <Alert tone="info">{notice}</Alert> : null}
    </form>
  );
}

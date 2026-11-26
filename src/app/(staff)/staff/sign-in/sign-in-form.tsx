"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { requestSignInLink, type SignInState } from "./actions";

export function SignInForm({ linkProblem }: { linkProblem: boolean }) {
  const t = useTranslations("Staff.signIn");
  const [state, action, pending] = useActionState<SignInState, FormData>(requestSignInLink, { status: "idle" });

  return (
    <form action={action} className="flex flex-col gap-6">
      {linkProblem && state.status === "idle" ? <Alert tone="warning">{t("linkProblem")}</Alert> : null}
      {state.status === "sent" ? <Alert tone="success">{t("sent")}</Alert> : null}
      {state.status === "too_many" ? <Alert tone="danger">{t("tooMany")}</Alert> : null}
      <Field label={t("email")} error={state.status === "invalid" ? t("invalid") : undefined}>
        <Input name="email" type="email" autoComplete="email" required />
      </Field>
      <div>
        <Button type="submit" loading={pending}>
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}

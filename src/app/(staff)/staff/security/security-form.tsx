"use client";

import { useActionState, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button, LinkButton } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { startEnrollment, verifyCode, type SecurityState } from "./actions";

/** Two-step sign-in: set up an authenticator app, or enter a code to raise this session. */
export function SecurityForm({ verifiedFactorId, assurance }: { verifiedFactorId: string | null; assurance: "aal1" | "aal2" }) {
  const t = useTranslations("Staff.security");
  const [enrollment, setEnrollment] = useState<SecurityState>({ status: "idle" });
  const [starting, startTransition] = useTransition();
  const [state, verify, verifying] = useActionState<SecurityState, FormData>(verifyCode, enrollment);

  const current = state.status === "idle" ? enrollment : state;
  const factorId = current.status === "enrolling" || current.status === "wrong_code" ? current.factorId : verifiedFactorId;
  const qr = current.status === "enrolling" || current.status === "wrong_code" ? current.qrCode : undefined;
  const secret = current.status === "enrolling" || current.status === "wrong_code" ? current.secret : undefined;

  if (current.status === "verified" || (assurance === "aal2" && current.status === "idle")) {
    return (
      <div className="flex flex-col gap-6">
        <Alert tone="success">{t("verified")}</Alert>
        <div>
          <LinkButton href="/staff" variant="secondary">
            {t("back")}
          </LinkButton>
        </div>
      </div>
    );
  }

  if (!factorId) {
    return (
      <div>
        <Button type="button" loading={starting} onClick={() => startTransition(async () => setEnrollment(await startEnrollment()))}>
          {t("setUp")}
        </Button>
      </div>
    );
  }

  return (
    <form action={verify} className="flex flex-col gap-6">
      <input type="hidden" name="factorId" value={factorId} />
      {qr ? (
        <div className="flex flex-col gap-3">
          <p>{t("scan")}</p>
          {/* The QR code is an SVG data URL from Supabase; next/image can't optimize it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="" width={180} height={180} className="size-44 rounded-md border border-line bg-surface p-2" />
          {secret ? <p className="text-sm text-muted">{t("secret", { secret })}</p> : null}
        </div>
      ) : (
        <p>{t("needCode")}</p>
      )}
      <Field label={t("code")} error={current.status === "wrong_code" ? t("wrongCode") : undefined}>
        <Input name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={7} required />
      </Field>
      <div>
        <Button type="submit" loading={verifying}>
          {t("verify")}
        </Button>
      </div>
    </form>
  );
}

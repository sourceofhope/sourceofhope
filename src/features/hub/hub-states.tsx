"use client";

import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/** A network or server error (spec §9.8): say so plainly and offer Try again. Form input is kept by the caller. */
export function HubError({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("Hub");
  return (
    <Alert tone="danger" title={t("loadFailedTitle")}>
      <p className="m-0">{t("loadFailed")}</p>
      <div className="pt-3">
        <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
          {t("tryAgain")}
        </Button>
      </div>
    </Alert>
  );
}

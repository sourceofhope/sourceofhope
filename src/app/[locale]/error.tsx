"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { SiteShell } from "@/components/layout/site-shell";
import { UtilityTemplate } from "@/components/layout/templates";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/ui/link";
import { ORGANIZATION } from "@/content/organization";

/* 500 for every page (spec §10.11): an apology, Try again, and how to reach us. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("Shell.error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <SiteShell>
      <UtilityTemplate title={t("title")} lead={t("lead")}>
        <div>
          <Button type="button" onClick={reset}>
            {t("retry")}
          </Button>
        </div>
        <p className="text-ink-soft">
          {t.rich("contact", {
            phone: () => <ExternalLink href={ORGANIZATION.phone.href}>{ORGANIZATION.phone.display}</ExternalLink>,
            email: () => <ExternalLink href={ORGANIZATION.email.href}>{ORGANIZATION.email.display}</ExternalLink>,
          })}
        </p>
      </UtilityTemplate>
    </SiteShell>
  );
}

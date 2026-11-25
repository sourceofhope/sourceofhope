import { useTranslations } from "next-intl";
import { HubLinkButton } from "@/components/layout/hub-link";
import { SiteShell } from "@/components/layout/site-shell";
import { UtilityTemplate } from "@/components/layout/templates";
import { LinkButton } from "@/components/ui/button";

/* 404 for every page (spec §10.11): plain words and three ways forward, in the full site shell. */
export default function NotFound() {
  const t = useTranslations("Shell");
  return (
    <SiteShell>
      <UtilityTemplate title={t("notFound.title")} lead={t("notFound.lead")}>
        <div className="flex flex-wrap gap-3">
          <LinkButton href="/">{t("notFound.home")}</LinkButton>
          <LinkButton href="/events" variant="secondary">
            {t("notFound.events")}
          </LinkButton>
          <HubLinkButton hub={{ action: "help" }} variant="tertiary" withIcon>
            {t("actions.help")}
          </HubLinkButton>
        </div>
      </UtilityTemplate>
    </SiteShell>
  );
}

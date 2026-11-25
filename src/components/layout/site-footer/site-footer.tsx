import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Image } from "@/components/ui/image";
import { focusRing } from "@/components/ui/lib/tv";
import { ExternalLink, IconLink, TextLink } from "@/components/ui/link";
import { ORGANIZATION } from "@/content/organization";
import { Container } from "../container";
import { HubTextLink } from "../hub-link";
import { LanguageSelect, Logo } from "../site-header";
import { ABOUT_LINKS } from "../site-header/nav";
import { NewsletterForm, type NewsletterFormProps } from "./newsletter-form";
import { SocialIcon } from "./social-icons";

const ORGANIZATION_KEYS = ["story", "team", "awards", "media", "careers", "contact"] as const;

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading text-base font-bold text-on-inverse">{title}</h2>
      {children}
    </div>
  );
}

/**
 * SiteFooter: brand, Get involved, Organization, Contact, the newsletter
 * and the legal row (spec §8.4). Navy, on every page.
 */
export function SiteFooter({ subscribe }: NewsletterFormProps) {
  const t = useTranslations("Shell");
  const year = new Date().getFullYear();
  const aboutHref = (key: (typeof ORGANIZATION_KEYS)[number]) => ABOUT_LINKS.find((link) => link.key === key)!.href;

  return (
    <footer className="bg-surface-inverse text-on-inverse">
      <Container>
        <div className="grid gap-10 py-section md:grid-cols-2 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <Logo surface="inverse" />
            <p className="max-w-sm text-on-inverse-muted">{t("footer.about")}</p>
            {ORGANIZATION.candid.seal ? (
              <a href={ORGANIZATION.candid.profile} className={`w-fit rounded-sm ${focusRing.inverse}`}>
                <Image src={ORGANIZATION.candid.seal} alt={t("footer.candid")} width={80} height={80} unoptimized className="size-20" />
              </a>
            ) : (
              <ExternalLink href={ORGANIZATION.candid.profile} surface="inverse" className="w-fit">
                {t("footer.candidProfile")}
              </ExternalLink>
            )}
          </div>

          <nav aria-label={t("footerNav")} className="grid gap-10 sm:grid-cols-2 lg:col-span-5">
            <Column title={t("footer.getInvolved")}>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {(["help", "volunteer", "give"] as const).map((action) => (
                  <li key={action}>
                    <HubTextLink hub={{ action }} surface="inverse">
                      {t(`actions.${action}`)}
                    </HubTextLink>
                  </li>
                ))}
                <li>
                  <HubTextLink hub={{ action: "give", type: "business" }} surface="inverse">
                    {t("actions.sponsors")}
                  </HubTextLink>
                </li>
              </ul>
            </Column>
            <Column title={t("footer.organization")}>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {ORGANIZATION_KEYS.map((key) => (
                  <li key={key}>
                    <TextLink href={aboutHref(key)} surface="inverse" quiet>
                      {t(`about.${key}`)}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </Column>
          </nav>

          <div className="lg:col-span-3">
            <Column title={t("footer.contact")}>
              <address className="flex flex-col gap-3 not-italic">
                <span className="text-on-inverse-muted">
                  {ORGANIZATION.address.street}
                  <br />
                  {ORGANIZATION.address.city}
                </span>
                <ExternalLink href={ORGANIZATION.phone.href} surface="inverse" quiet>
                  {ORGANIZATION.phone.display}
                </ExternalLink>
                <ExternalLink href={ORGANIZATION.email.href} surface="inverse" quiet>
                  {ORGANIZATION.email.display}
                </ExternalLink>
              </address>
              <ul className="-ml-3 m-0 flex list-none flex-wrap gap-1 p-0" aria-label={t("footer.follow")}>
                {ORGANIZATION.social.map((s) => (
                  <li key={s.network}>
                    <IconLink href={s.href} label={s.label} icon={<SocialIcon network={s.network} />} surface="inverse" />
                  </li>
                ))}
              </ul>
            </Column>
          </div>
        </div>

        <div className="grid gap-6 rounded-lg bg-surface p-6 text-ink md:grid-cols-2 md:items-center md:p-8">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-xl font-bold">{t("footer.newsletter")}</h2>
            <p className="text-muted">{t("footer.newsletterText")}</p>
          </div>
          <NewsletterForm subscribe={subscribe} />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line-inverse py-6 text-sm text-on-inverse-muted md:flex-row md:items-center md:justify-between">
          <p className="m-0 flex flex-wrap gap-x-4 gap-y-1">
            <span>{t("footer.copyright", { year, name: ORGANIZATION.name })}</span>
            <span>{t("footer.ein", { ein: ORGANIZATION.ein })}</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <TextLink href="/privacy" surface="inverse" quiet>
              {t("footer.privacy")}
            </TextLink>
            <TextLink href="/terms" surface="inverse" quiet>
              {t("footer.terms")}
            </TextLink>
            <LanguageSelect />
          </div>
        </div>
      </Container>
    </footer>
  );
}

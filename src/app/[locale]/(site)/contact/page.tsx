import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { ContentTemplate } from "@/components/layout/templates";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { ExternalLink } from "@/components/ui/link";
import { ORGANIZATION } from "@/content/organization";
import { ContactForm } from "@/features/contact/contact-form";
import type { AppLocale } from "@/i18n/locales";
import { localeAlternates } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Contact");
  const locale = (await getLocale()) as AppLocale;
  return { title: t("title"), description: t("meta"), alternates: localeAlternates("/contact", locale) };
}

const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${ORGANIZATION.name}, ${ORGANIZATION.address.street}, ${ORGANIZATION.address.city}`)}` as const;

/* Contact (spec §10.8): the form, address with directions, phone and email. */
export default async function ContactPage() {
  const t = await getTranslations("Contact");
  return (
    <ContentTemplate header={{ title: t("title"), lead: t("lead") }}>
      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <section aria-labelledby="contact-form" className="flex flex-col gap-6 lg:col-span-7">
            <Heading level={2} size="2xl" id="contact-form">
              {t("formTitle")}
            </Heading>
            <ContactForm />
          </section>
          <aside aria-labelledby="contact-details" className="lg:col-span-5">
            <Card>
              <div className="flex flex-col gap-6 p-6">
                <Heading level={2} size="2xl" id="contact-details">
                  {t("detailsTitle")}
                </Heading>
                <dl className="m-0 flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <dt className="text-sm font-semibold text-muted">{t("address")}</dt>
                    <dd className="m-0 flex flex-col gap-1">
                      <address className="not-italic">
                        {ORGANIZATION.address.street}
                        <br />
                        {ORGANIZATION.address.city}
                      </address>
                      <ExternalLink href={DIRECTIONS} newTab>
                        {t("directions")}
                      </ExternalLink>
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-sm font-semibold text-muted">{t("phone")}</dt>
                    <dd className="m-0">
                      <ExternalLink href={ORGANIZATION.phone.href}>{ORGANIZATION.phone.display}</ExternalLink>
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-sm font-semibold text-muted">{t("email")}</dt>
                    <dd className="m-0">
                      <ExternalLink href={ORGANIZATION.email.href}>{ORGANIZATION.email.display}</ExternalLink>
                    </dd>
                  </div>
                </dl>
              </div>
            </Card>
          </aside>
        </div>
      </Section>
    </ContentTemplate>
  );
}

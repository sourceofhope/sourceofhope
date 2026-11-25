"use client";

import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { Disclosure } from "@/components/ui/accordion";
import { IconButton } from "@/components/ui/button";
import { Sheet } from "@/components/ui/dialog";
import { ExternalLink, NavLink } from "@/components/ui/link";
import { ORGANIZATION } from "@/content/organization";
import { HubTile } from "../hub-link";
import { LanguageSelect } from "./language-select";
import { ABOUT_LINKS, NAV_HREFS, PROGRAM_LINKS } from "./nav";

/**
 * MobileMenu: the ☰ button and the full-screen menu sheet (spec §8.3). The
 * Sheet traps focus, closes on Escape and returns focus to ☰; every link in
 * it closes the sheet as it navigates.
 */
export function MobileMenu({ surface, current }: { surface: "default" | "inverse"; current?: string }) {
  const t = useTranslations("Shell");
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const isCurrent = (href: string) => current === href;

  return (
    <>
      <IconButton label={t("openMenu")} icon={<Bars3Icon />} surface={surface} aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(true)} />
      <Sheet title={t("mainNav")} hideTitle open={open} onOpenChange={setOpen} header={<LanguageSelect />}>
        <div className="flex flex-col gap-8 pb-8">
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {(["help", "volunteer", "give"] as const).map((action) => (
              <HubTile key={action} hub={{ action }} label={t(`actions.${action}`)} hint={t(`actionHints.${action}`)} onNavigate={close} />
            ))}
          </ul>

          <nav aria-label={t("mainNav")}>
            <ul className="m-0 flex list-none flex-col divide-y divide-line border-y border-line p-0">
              <li className="py-1">
                <Disclosure look="row" label={t("nav.programs")}>
                  <ul className="m-0 flex list-none flex-col p-0 pl-4">
                    <li>
                      <NavLink href={NAV_HREFS.programs} size="lg" current={isCurrent(NAV_HREFS.programs)} onClick={close}>
                        {t("nav.allPrograms")}
                      </NavLink>
                    </li>
                    {PROGRAM_LINKS.map((link) => (
                      <li key={link.key}>
                        <NavLink href={link.href} size="lg" current={isCurrent(link.href)} onClick={close}>
                          {t(`programs.${link.key}`)}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </Disclosure>
              </li>
              <li className="py-1">
                <NavLink href={NAV_HREFS.events} size="lg" current={isCurrent(NAV_HREFS.events)} onClick={close}>
                  {t("nav.events")}
                </NavLink>
              </li>
              <li className="py-1">
                <Disclosure look="row" label={t("nav.about")}>
                  <ul className="m-0 flex list-none flex-col p-0 pl-4">
                    {ABOUT_LINKS.map((link) => (
                      <li key={link.key}>
                        <NavLink href={link.href} size="lg" current={isCurrent(link.href)} onClick={close}>
                          {t(`about.${link.key}`)}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </Disclosure>
              </li>
              <li className="py-1">
                <NavLink href={NAV_HREFS.store} size="lg" current={isCurrent(NAV_HREFS.store)} onClick={close}>
                  {t("nav.store")}
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col gap-1">
            <ExternalLink href={ORGANIZATION.phone.href} quiet>
              {ORGANIZATION.phone.display}
            </ExternalLink>
            <ExternalLink href={ORGANIZATION.email.href} quiet>
              {ORGANIZATION.email.display}
            </ExternalLink>
          </div>
        </div>
      </Sheet>
    </>
  );
}

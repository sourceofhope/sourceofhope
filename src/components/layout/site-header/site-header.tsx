"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, MenuLink } from "@/components/ui/menu";
import { NavLink } from "@/components/ui/link";
import { usePathname } from "@/i18n/navigation";
import { Container } from "../container";
import { HubLinkButton } from "../hub-link";
import { CartIndicator } from "./cart-indicator";
import { LanguageSelect } from "./language-select";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { ABOUT_LINKS, ALL_NAV_HREFS, currentHref, NAV_HREFS } from "./nav";

/** Where a page's hero ends (the homepage puts it where the video settles into its card). */
export const HEADER_SOLID_SENTINEL_ID = "header-solid-sentinel";

/**
 * In overlay mode the header is transparent until the hero is scrolled
 * past: until the sentinel element passes under the header, or (with no
 * sentinel) as soon as the page scrolls at all. The sentinel is looked up
 * on every check, because the page can stream in after the header hydrates.
 * One rAF-throttled passive listener; it never blocks scrolling.
 */
function useSolidAfterHero(enabled: boolean, header: React.RefObject<HTMLElement | null>) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const sentinel = document.getElementById(HEADER_SOLID_SENTINEL_ID);
      const height = header.current?.offsetHeight ?? 72;
      setSolid(sentinel ? sentinel.getBoundingClientRect().top < height : window.scrollY > 8);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [enabled, header]);
  return solid;
}

export type SiteHeaderProps = {
  /**
   * Transparent over a full-bleed hero until it's scrolled past (spec §8.2).
   * Defaults to on for the homepage only.
   */
  overlay?: boolean;
};

/**
 * SiteHeader: logo, main navigation and the three Hub actions. Sticky,
 * 72px (60px on phones). Below `lg` it collapses to Get Help, Give and ☰.
 */
export function SiteHeader({ overlay: overlayProp }: SiteHeaderProps) {
  const t = useTranslations("Shell");
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const overlay = overlayProp ?? pathname === "/";
  const solid = useSolidAfterHero(overlay, ref);
  const transparent = overlay && !solid;
  const surface = transparent ? "inverse" : "default";
  const current = currentHref(pathname, ALL_NAV_HREFS);
  const inAbout = ABOUT_LINKS.some((link) => link.href === current);

  return (
    <header
      ref={ref}
      data-transparent={transparent || undefined}
      className={[
        "sticky top-0 z-(--z-header) h-(--header-height) border-b",
        "transition-colors duration-(--duration-base) ease-standard motion-reduce:transition-none",
        transparent ? "border-transparent bg-transparent" : "border-line bg-surface",
        overlay ? "-mb-(--header-height)" : "",
      ].join(" ")}
    >
      <Container>
        <div className="flex h-(--header-height) items-center justify-between gap-4">
          <Logo surface={surface} compact />

          <nav aria-label={t("mainNav")} className="hidden lg:block">
            <ul className="m-0 flex list-none items-center gap-5 p-0">
              <li>
                <NavLink href={NAV_HREFS.programs} surface={surface} current={current?.startsWith(NAV_HREFS.programs)}>
                  {t("nav.programs")}
                </NavLink>
              </li>
              <li>
                <NavLink href={NAV_HREFS.events} surface={surface} current={current === NAV_HREFS.events}>
                  {t("nav.events")}
                </NavLink>
              </li>
              <li>
                <Menu label={t("nav.about")} surface={surface} current={inAbout}>
                  {ABOUT_LINKS.map((link) => (
                    <MenuLink key={link.key} href={link.href} current={current === link.href}>
                      {t(`about.${link.key}`)}
                    </MenuLink>
                  ))}
                </Menu>
              </li>
              <li>
                <NavLink href={NAV_HREFS.store} surface={surface} current={current === NAV_HREFS.store}>
                  {t("nav.store")}
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden lg:block">
              <LanguageSelect />
            </div>
            <CartIndicator surface={surface} />
            <HubLinkButton hub={{ action: "help" }} variant="tertiary" surface={surface} withIcon className="max-sm:px-2">
              {t("actions.help")}
            </HubLinkButton>
            <div className="hidden lg:block">
              <HubLinkButton hub={{ action: "volunteer" }} variant="secondary" surface={surface}>
                {t("actions.volunteer")}
              </HubLinkButton>
            </div>
            <HubLinkButton hub={{ action: "give" }} surface={surface}>
              {t("actions.give")}
            </HubLinkButton>
            <div className="lg:hidden">
              <MobileMenu surface={surface} current={current} />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}

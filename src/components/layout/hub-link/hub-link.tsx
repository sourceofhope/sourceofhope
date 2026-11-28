"use client";

import type { ReactNode } from "react";
import { GiftIcon, HandRaisedIcon, HeartIcon } from "@heroicons/react/24/outline";
import { LinkButton, type LinkButtonProps } from "@/components/ui/button";
import { Card, CardLink } from "@/components/ui/card";
import { TextLink } from "@/components/ui/link";
import { handleHubLinkClick } from "@/lib/hub-history";
import { hubQuery, type HubAction, type HubState } from "@/lib/hub-url";
import { usePathname } from "@/i18n/navigation";

/** A door of the Hub (spec §9.1); `type`, `need`, `event` and `designation` pre-select a step. */
export type HubParams = Extract<HubState, { action: HubAction }>;

/**
 * The Hub opens from a query string on the current page (`?action=give`),
 * so every Hub link is a real link: it works with modifier-click, copy link
 * and without JavaScript. A plain click opens the Hub in place
 * (`useHubLink`), keeping the page's UTMs and remembering the opener.
 */
export function useHubHref(state: HubState) {
  const pathname = usePathname();
  return { pathname, query: hubQuery(state) };
}

/** `href` and `onClick` for any link that opens the Hub. */
export function useHubLink(state: HubState) {
  const href = useHubHref(state);
  return { href, onClick: (event: React.MouseEvent<HTMLElement>) => handleHubLinkClick(event, state) };
}

/** An event's details in the Hub (`?event=slug`, spec §9.4); the Hub picks the side from context. */
export function useEventLink(slug: string, view?: "guest" | "volunteer") {
  return useHubLink({ action: "event", event: slug, view });
}

export const HUB_ICONS = { help: HeartIcon, volunteer: HandRaisedIcon, give: GiftIcon } as const;

type HubLinkButtonProps = Omit<LinkButtonProps, "href"> & { hub: HubParams; withIcon?: boolean };

/** HubLinkButton: Give, Volunteer and Get Help as buttons (header, CTA bands). */
export function HubLinkButton({ hub, withIcon, children, ...props }: HubLinkButtonProps) {
  const link = useHubLink(hub);
  const Icon = HUB_ICONS[hub.action];
  return (
    <LinkButton {...props} {...link}>
      {withIcon ? <Icon aria-hidden="true" /> : null}
      {children}
    </LinkButton>
  );
}

/** HubTextLink: a Hub action as a plain link (footer lists). */
export function HubTextLink({ hub, children, surface }: { hub: HubParams; children: ReactNode; surface?: "default" | "inverse" }) {
  const link = useHubLink(hub);
  return (
    <TextLink {...link} surface={surface} quiet>
      {children}
    </TextLink>
  );
}

/** HubTile: a large Hub action with an icon and a hint (the phone menu sheet). */
export function HubTile({ hub, label, hint, onNavigate }: { hub: HubParams; label: string; hint: string; onNavigate?: () => void }) {
  const link = useHubLink(hub);
  const Icon = HUB_ICONS[hub.action];
  return (
    <Card as="li" interactive>
      <div className="flex items-center gap-4 p-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-surface-muted text-action [&_svg]:size-6" aria-hidden="true">
          <Icon />
        </span>
        <span className="flex flex-col">
          <CardLink
            href={link.href}
            onClick={(event) => {
              link.onClick(event);
              onNavigate?.();
            }}
          >
            {label}
          </CardLink>
          <span className="text-sm text-muted">{hint}</span>
        </span>
      </div>
    </Card>
  );
}

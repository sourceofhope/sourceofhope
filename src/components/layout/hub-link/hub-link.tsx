"use client";

import type { ReactNode } from "react";
import { GiftIcon, HandRaisedIcon, HeartIcon } from "@heroicons/react/24/outline";
import { LinkButton, type LinkButtonProps } from "@/components/ui/button";
import { Card, CardLink } from "@/components/ui/card";
import { TextLink } from "@/components/ui/link";
import { usePathname } from "@/i18n/navigation";

export type HubAction = "help" | "volunteer" | "give";

/** What the Hub opens to (spec §9). `type`, `need`, `event` and `program` pre-select a step. */
export type HubParams = { action: HubAction; type?: string; need?: string; event?: string; program?: string };

/**
 * The Hub opens from a query string on the current page (`?action=give`),
 * so every Hub link is a real link: it works with modifier-click, copy link
 * and without JavaScript, and the Hub reads it on load (Phase 2).
 */
export function useHubHref(params: HubParams) {
  const pathname = usePathname();
  const query = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined)) as Record<string, string>;
  return { pathname, query };
}

export const HUB_ICONS = { help: HeartIcon, volunteer: HandRaisedIcon, give: GiftIcon } as const;

type HubLinkButtonProps = Omit<LinkButtonProps, "href"> & { hub: HubParams; withIcon?: boolean };

/** HubLinkButton: Give, Volunteer and Get Help as buttons (header, CTA bands). */
export function HubLinkButton({ hub, withIcon, children, ...props }: HubLinkButtonProps) {
  const href = useHubHref(hub);
  const Icon = HUB_ICONS[hub.action];
  return (
    <LinkButton {...props} href={href}>
      {withIcon ? <Icon aria-hidden="true" /> : null}
      {children}
    </LinkButton>
  );
}

/** HubTextLink: a Hub action as a plain link (footer lists). */
export function HubTextLink({ hub, children, surface }: { hub: HubParams; children: ReactNode; surface?: "default" | "inverse" }) {
  const href = useHubHref(hub);
  return (
    <TextLink href={href} surface={surface} quiet>
      {children}
    </TextLink>
  );
}

/** HubTile: a large Hub action with an icon and a hint (the phone menu sheet). */
export function HubTile({ hub, label, hint, onNavigate }: { hub: HubParams; label: string; hint: string; onNavigate?: () => void }) {
  const href = useHubHref(hub);
  const Icon = HUB_ICONS[hub.action];
  return (
    <Card as="li" interactive>
      <div className="flex items-center gap-4 p-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-surface-muted text-action [&_svg]:size-6" aria-hidden="true">
          <Icon />
        </span>
        <span className="flex flex-col">
          <CardLink href={href} onClick={onNavigate}>
            {label}
          </CardLink>
          <span className="text-sm text-muted">{hint}</span>
        </span>
      </div>
    </Card>
  );
}

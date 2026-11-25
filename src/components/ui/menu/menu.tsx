"use client";

import type { ComponentProps, ReactNode } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Menu as SdkMenu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/react/menu";
import { Link } from "@/i18n/navigation";
import { focusRing, tv } from "../lib/tv";

const menuStyles = tv({
  slots: {
    // Matches NavLink so "About" sits in the header nav as a peer.
    trigger: [
      "inline-flex min-h-11 items-center gap-1 border-b-2 border-transparent px-1 font-semibold",
      "transition-colors duration-(--duration-fast) motion-reduce:transition-none data-current:border-current",
      "[&_svg]:size-5 [&_svg]:transition-transform data-open:[&_svg]:rotate-180 motion-reduce:[&_svg]:transition-none",
    ],
    content: [
      "z-(--z-overlay) min-w-56 rounded-md border border-line bg-surface p-1 shadow-overlay outline-none",
      "transition duration-(--duration-base) ease-standard data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none",
    ],
    item: [
      "flex min-h-11 w-full items-center rounded-sm px-3 text-ink no-underline outline-none",
      "data-highlighted:bg-surface-muted data-highlighted:text-action aria-[current=page]:font-semibold",
    ],
  },
  variants: {
    surface: {
      default: { trigger: ["text-ink hover:text-action", focusRing.default] },
      inverse: { trigger: ["text-on-inverse hover:text-on-inverse-muted", focusRing.inverse] },
    },
  },
  defaultVariants: { surface: "default" },
});

export type MenuProps = {
  /** The visible trigger text, e.g. "About". */
  label: ReactNode;
  surface?: "default" | "inverse";
  /** You're on one of this menu's pages: underlines the trigger like a current NavLink. */
  current?: boolean;
  /** MenuLink items. */
  children: ReactNode;
};

/**
 * Menu: a dropdown of links (the desktop "About" menu, spec §8.2). Arrow
 * keys move between items, typing jumps, Escape closes and returns focus.
 */
export function Menu({ label, surface, current, children }: MenuProps) {
  const s = menuStyles({ surface });
  return (
    <SdkMenu>
      <MenuTrigger data-current={current || undefined} className={s.trigger()}>
        {label}
        <ChevronDownIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuContent side="bottom" align="start" sideOffset={8} className={s.content()}>
        {children}
      </MenuContent>
    </SdkMenu>
  );
}

/** MenuLink: a menu item that navigates (locale-aware). */
export function MenuLink({ href, current, children }: { href: ComponentProps<typeof Link>["href"]; current?: boolean; children: ReactNode }) {
  return (
    <MenuItem render={<Link href={href} aria-current={current ? "page" : undefined} />} className={menuStyles().item()}>
      {children}
    </MenuItem>
  );
}

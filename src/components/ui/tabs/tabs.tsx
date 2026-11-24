"use client";

import type { ComponentProps } from "react";
import { Tabs as SdkTabs, TabsList as SdkTabsList, TabsPanel as SdkTabsPanel, TabsTab } from "@ui-sdk/react/tabs";
import { focusRing, tv, type VariantProps } from "../lib/tv";

const tabsStyles = tv({
  slots: {
    list: "flex flex-wrap gap-1",
    tab: [
      "inline-flex min-h-11 items-center justify-center rounded-md px-4 text-center font-semibold",
      "transition-colors duration-(--duration-fast) motion-reduce:transition-none",
      focusRing.default,
    ],
    panel: "outline-none",
  },
  variants: {
    /**
     * `pill`: the Hub's door tabs (spec §9.2).
     * `underline`: event details' guest/volunteer toggle (spec §9.4).
     */
    look: {
      pill: {
        tab: "text-ink hover:bg-surface-muted data-selected:bg-action data-selected:text-on-inverse",
      },
      underline: {
        list: "gap-4 border-b border-line",
        tab: "-mb-px rounded-none border-b-4 border-transparent px-1 text-muted hover:text-ink data-selected:border-action data-selected:text-ink",
      },
    },
  },
  defaultVariants: { look: "underline" },
});

type TabsLook = VariantProps<typeof tabsStyles>;

/**
 * Tabs: switch between views of one thing. Arrow keys move between tabs.
 * Give TabsList an aria-label. Pair each Tab with a TabsPanel of the same value.
 */
export function Tabs(props: ComponentProps<typeof SdkTabs>) {
  return <SdkTabs {...props} />;
}

export function TabsList({ look, className, ...props }: ComponentProps<typeof SdkTabsList> & TabsLook & { "aria-label": string }) {
  return <SdkTabsList {...props} className={tabsStyles({ look }).list({ class: className as string })} />;
}

export function Tab({ look, ...props }: Omit<ComponentProps<typeof TabsTab>, "className"> & TabsLook) {
  return <TabsTab {...props} className={tabsStyles({ look }).tab()} />;
}

export function TabsPanel(props: Omit<ComponentProps<typeof SdkTabsPanel>, "className">) {
  return <SdkTabsPanel {...props} className={tabsStyles().panel()} />;
}

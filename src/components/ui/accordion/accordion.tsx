"use client";

import type { ReactNode } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  Accordion as SdkAccordion,
  AccordionHeader,
  AccordionItem as SdkAccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/react/accordion";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible";
import { focusRing, tv } from "../lib/tv";

const disclosureStyles = tv({
  slots: {
    list: "divide-y divide-line border-y border-line",
    trigger: [
      "flex min-h-12 w-full items-center justify-between gap-4 py-3 text-left font-semibold text-ink",
      "[&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:transition-transform data-open:[&_svg]:rotate-180 motion-reduce:[&_svg]:transition-none",
      focusRing.default,
    ],
    heading: "m-0 text-lg",
    panel: "pb-4 text-ink-soft",
    rowTrigger: [
      "flex min-h-12 w-full items-center justify-between gap-4 text-left text-lg font-semibold text-ink",
      "[&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:transition-transform data-open:[&_svg]:rotate-180 motion-reduce:[&_svg]:transition-none",
      focusRing.default,
    ],
    inlineTrigger: [
      "inline-flex min-h-11 items-center gap-1 font-semibold text-action underline underline-offset-4",
      "[&_svg]:size-5 [&_svg]:transition-transform data-open:[&_svg]:rotate-180 motion-reduce:[&_svg]:transition-none",
      focusRing.default,
    ],
  },
});

/** Accordion: FAQs and grouped details. Several items may be open at once. */
export function Accordion({ children, defaultOpen }: { children: ReactNode; defaultOpen?: string[] }) {
  return (
    <SdkAccordion multiple defaultValue={defaultOpen} className={disclosureStyles().list()}>
      {children}
    </SdkAccordion>
  );
}

export type AccordionItemProps = {
  value: string;
  title: ReactNode;
  /** Heading level for the trigger, to fit the page outline. */
  level: 2 | 3 | 4;
  children: ReactNode;
};

export function AccordionItem({ value, title, level, children }: AccordionItemProps) {
  const s = disclosureStyles();
  const Heading = `h${level}` as const;
  return (
    <SdkAccordionItem value={value}>
      <AccordionHeader render={<Heading className={s.heading()} />}>
        <AccordionTrigger className={s.trigger()}>
          {title}
          <ChevronDownIcon aria-hidden="true" />
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionPanel className={s.panel()}>{children}</AccordionPanel>
    </SdkAccordionItem>
  );
}

/**
 * Disclosure: one show/hide toggle in running content ("How volunteering
 * works", "Give in honor or memory of someone"). Replaces ExpressiveCard.
 */
export function Disclosure({
  label,
  children,
  defaultOpen,
  look = "inline",
}: {
  label: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  /** `inline` in running text; `row` for a full-width group in a menu (the phone menu's Programs). */
  look?: "inline" | "row";
}) {
  const s = disclosureStyles();
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className={look === "row" ? s.rowTrigger() : s.inlineTrigger()}>
        {label}
        <ChevronDownIcon aria-hidden="true" />
      </CollapsibleTrigger>
      <CollapsiblePanel className={s.panel({ class: "pt-2" })}>{children}</CollapsiblePanel>
    </Collapsible>
  );
}

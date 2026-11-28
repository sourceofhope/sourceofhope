"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@/components/ui/button";
import { DialogCloseButton, DialogHeading } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Steps } from "@/components/ui/steps";
import { Tab, Tabs, TabsList, TabsPanel } from "@/components/ui/tabs";
import { HUB_ICONS } from "@/components/layout/hub-link";
import { HUB_ACTIONS, type HubAction, type HubState } from "@/lib/hub-url";
import { useHub } from "./hub-context";

/*
 * The Hub's shell (spec §9.2): door tabs on a door's first step only, a
 * back / title / progress header on later steps, a scrolling body and a
 * fixed action bar. The panel itself is the takeover Dialog (spec §9.3).
 */

const HEADER = "flex shrink-0 items-center gap-2 border-b border-line-soft px-4 py-3 max-md:pt-safe md:px-6";
const BODY = "flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 md:px-6";
const FOOTER = "flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-line px-4 py-3 max-md:pb-safe md:px-6";

/** The step's heading: the dialog's accessible name, and where focus lands on open. */
export function HubTitle({ children, intro }: { children: ReactNode; intro?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <DialogHeading id="hub-title" focusable>
        {children}
      </DialogHeading>
      {intro ? <p className="text-ink-soft">{intro}</p> : null}
    </div>
  );
}

/** The fixed action bar: at most one primary and one secondary action (spec §9.2). */
export function HubActions({ children }: { children: ReactNode }) {
  return <div className={FOOTER}>{children}</div>;
}

/** A door's first step: tabs switch doors without adding history, so progress elsewhere is never wiped. */
export function HubLanding({ door, children, actions, after }: { door: HubAction; children: ReactNode; actions?: ReactNode; after?: ReactNode }) {
  const t = useTranslations("Hub");
  const hub = useHub();
  return (
    <Tabs
      value={door}
      onValueChange={(value) => {
        if (value && value !== door) hub.replace({ action: value as HubAction });
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className={HEADER}>
        <TabsList look="pill" aria-label={t("doors")} className="flex-1 flex-nowrap">
          {HUB_ACTIONS.map((action) => {
            const Icon = HUB_ICONS[action];
            return (
              <Tab key={action} value={action} look="pill">
                <Icon aria-hidden="true" className="mr-1.5 size-5 max-sm:hidden" />
                {t(`door.${action}`)}
              </Tab>
            );
          })}
        </TabsList>
        <DialogCloseButton />
      </div>
      <div className={BODY}>
        {HUB_ACTIONS.map((action) => (
          <TabsPanel key={action} value={action}>
            {action === door ? <div className="flex flex-col gap-6">{children}</div> : null}
          </TabsPanel>
        ))}
      </div>
      {after}
      {actions ? <HubActions>{actions}</HubActions> : null}
    </Tabs>
  );
}

/** A later step: Back, the flow's name and progress. */
export function HubStep({
  label,
  steps,
  current,
  children,
  actions,
  after,
  parent,
}: {
  label: string;
  /** Where Back goes when there's no earlier Hub entry (a deep link). */
  parent: HubState;
  steps?: readonly string[];
  current?: number;
  children: ReactNode;
  actions?: ReactNode;
  /** A persistent strip under the body (Get Help's emergency footer). */
  after?: ReactNode;
}) {
  const t = useTranslations("Hub");
  const hub = useHub();
  return (
    <>
      <div className={HEADER}>
        <IconButton label={t("back")} icon={<ArrowLeftIcon aria-hidden="true" />} onClick={() => hub.back(parent)} />
        <p className="m-0 min-w-0 flex-1 truncate font-semibold text-ink">{label}</p>
        <DialogCloseButton />
      </div>
      {steps && current ? (
        <div className="shrink-0 px-4 pt-4 md:px-6">
          <Steps steps={steps} current={current} />
        </div>
      ) : null}
      <div className={BODY}>{children}</div>
      {after}
      {actions ? <HubActions>{actions}</HubActions> : null}
    </>
  );
}

/** A view with no flow (event details opened directly): just close. */
export function HubSheet({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <>
      <div className={`${HEADER} justify-end border-b-0 pb-0`}>
        <DialogCloseButton />
      </div>
      <div className={`${BODY} pt-0`}>{children}</div>
      {actions ? <HubActions>{actions}</HubActions> : null}
    </>
  );
}

/** Loading a step's data: a skeleton of the layout, announced politely (spec §9.8). */
export function HubLoading() {
  const t = useTranslations("UI");
  return (
    <div role="status" className="flex flex-col gap-4">
      <span className="sr-only">{t("loading")}</span>
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
    </div>
  );
}

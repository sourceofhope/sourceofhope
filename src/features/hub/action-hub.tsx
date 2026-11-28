"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Dialog } from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";
import { captureFirstTouch } from "@/lib/attribution";
import { closeHub, completeHub, hubDepth, pushHub, replaceHub, takeOpener } from "@/lib/hub-history";
import { hubSearch, parseHub, type HubState } from "@/lib/hub-url";
import { EventDetails } from "./event-details";
import { GiveFlow } from "./give/give-flow";
import { HelpFlow } from "./help-flow";
import { HubContext, type HubApi } from "./hub-context";
import { VolunteerFlow } from "./volunteer-flow";

/*
 * The Action Hub (spec §9, ADR-0002): one overlay for every action, opened
 * by query parameters on any page. The URL is the state; this component
 * reads it, keeps it canonical, and renders the matching flow in the
 * takeover dialog. Rendered in the browser only: without JavaScript, Hub
 * links resolve to the page itself (spec §9.3).
 */

const subscribeNever = () => () => {};

/** Where the person is in the Hub, for analytics and close rules. */
function describe(state: HubState): { door: string; type?: string; step: string; landing: boolean } {
  switch (state.action) {
    case "event":
      return { door: "event", step: "details", landing: true };
    case "help":
      return { door: "help", step: state.service ? "service" : state.event ? "event" : state.need && state.need !== "other" ? "results" : "need", landing: !state.need && !state.service && !state.event };
    case "volunteer":
      return { door: "volunteer", step: state.step ?? (state.event ? "shift" : "event"), landing: !state.step && !state.event };
    case "give":
      return { door: "give", type: state.type, step: state.step ?? "type", landing: !state.step };
  }
}

function HubRouter({ state }: { state: HubState }) {
  switch (state.action) {
    case "event":
      return <EventDetails key={state.event} slug={state.event} view={state.view} />;
    case "help":
      return <HelpFlow need={state.need} service={state.service} event={state.event} />;
    case "volunteer":
      return <VolunteerFlow event={state.event} step={state.step} />;
    case "give":
      return <GiveFlow state={state} />;
  }
}

function HubController() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const state = useMemo(() => parseHub(searchParams), [searchParams]);
  // Keep the last state so the content stays put while the dialog animates closed.
  const [shown, setShown] = useState(state);
  if (state && state !== shown) setShown(state);
  const [busy, setBusy] = useState(false);
  // Opened by a URL (a link from outside, a QR code, a reload) rather than a click here.
  const [openedByUrl] = useState(() => state !== null && hubDepth() === 0);

  // Keep the URL canonical: invalid values dropped, Hub params in order (02 §3).
  const search = searchParams.toString();
  useEffect(() => {
    if (state && hubSearch(state, search) !== `?${search}`) replaceHub(state);
  }, [state, search]);

  useEffect(() => {
    captureFirstTouch();
  }, []);

  // Analytics: opens and steps; no personal data (spec §13).
  const where = state ? describe(state) : null;
  const key = where ? `${where.door}:${where.type ?? ""}:${where.step}` : null;
  const lastKey = useRef<string | null>(null);
  useEffect(() => {
    if (key === lastKey.current) return;
    const wasOpen = lastKey.current !== null;
    lastKey.current = key;
    if (!where) return;
    if (!wasOpen) trackEvent({ name: "hub_open", props: { door: where.door, type: where.type, via: openedByUrl ? "url" : "link" } });
    else trackEvent({ name: "hub_step", props: { door: where.door, type: where.type, step: where.step } });
  }, [key, where, openedByUrl]);

  const api = useMemo<HubApi | null>(() => {
    if (!shown) return null;
    return {
      state: shown,
      lang: locale.startsWith("es") ? "es" : "en",
      push: pushHub,
      replace: replaceHub,
      complete: async (next) => {
        await completeHub(next);
        const done = describe(next);
        trackEvent({ name: "hub_complete", props: { door: done.door, type: done.type } });
      },
      back: (parent) => {
        if (hubDepth() > 1) window.history.back();
        else replaceHub(parent);
      },
      close: closeHub,
      setBusy,
    };
  }, [shown, locale]);

  const close = useCallback(() => {
    if (where) trackEvent({ name: "hub_close", props: { door: where.door, step: where.step } });
    closeHub();
  }, [where]);

  return (
    <Dialog
      bare
      layout="takeover"
      open={state !== null}
      dismissible={!busy}
      closeOnOutsidePress={where?.landing ?? false}
      initialFocus="#hub-title"
      finalFocus={() => takeOpener() ?? document.getElementById("main")}
      onOpenChange={(open, reason) => {
        if (open) return;
        // Android's back gesture: one step back, like the browser's Back.
        if (reason === "back") window.history.back();
        else close();
      }}
    >
      {api && shown ? (
        <HubContext.Provider value={api}>
          <HubRouter state={shown} />
        </HubContext.Provider>
      ) : null}
    </Dialog>
  );
}

export function ActionHub() {
  const mounted = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <HubController />
    </Suspense>
  );
}

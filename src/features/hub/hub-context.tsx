"use client";

import { createContext, useContext } from "react";
import type { HubState } from "@/lib/hub-url";

export type HubApi = {
  state: HubState;
  /** The content language for Hub data requests. */
  lang: "en" | "es";
  /** A new step: a history entry, so Back returns here. */
  push: (next: HubState) => void;
  /** Same entry (door switches, corrections). */
  replace: (next: HubState) => void;
  /** Finish a flow: Back then closes the Hub instead of reopening the form. */
  complete: (next: HubState) => Promise<void>;
  /**
   * The header's Back: the browser's Back when the previous entry is this
   * flow's previous step, else (a deep link) go up to `parent` in place.
   */
  back: (parent: HubState) => void;
  close: () => void;
  /** Block Escape and outside presses while a payment runs (spec §9.2). */
  setBusy: (busy: boolean) => void;
};

export const HubContext = createContext<HubApi | null>(null);

export function useHub(): HubApi {
  const hub = useContext(HubContext);
  if (!hub) throw new Error("useHub must be used inside the Action Hub");
  return hub;
}

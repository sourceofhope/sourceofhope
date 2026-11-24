"use client";

import { useSyncExternalStore } from "react";

type NetworkInformation = { saveData?: boolean; effectiveType?: string; addEventListener?: (type: "change", fn: () => void) => void; removeEventListener?: (type: "change", fn: () => void) => void };

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function connection(): NetworkInformation | undefined {
  return (navigator as Navigator & { connection?: NetworkInformation }).connection;
}

/**
 * Whether background motion (the hero video) may play: not when the visitor
 * asks for reduced motion, turns on Data Saver, or is on a 2G-class link.
 * False on the server and the first render, so the poster always paints first.
 */
export function shouldPlayMotion(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.(REDUCED_MOTION).matches) return false;
  const net = connection();
  if (net?.saveData) return false;
  if (net?.effectiveType && /(^|-)2g$/.test(net.effectiveType)) return false;
  return true;
}

function subscribe(onChange: () => void) {
  const query = window.matchMedia?.(REDUCED_MOTION);
  query?.addEventListener("change", onChange);
  connection()?.addEventListener?.("change", onChange);
  return () => {
    query?.removeEventListener("change", onChange);
    connection()?.removeEventListener?.("change", onChange);
  };
}

export function useMotionAllowed(): boolean {
  return useSyncExternalStore(subscribe, shouldPlayMotion, () => false);
}

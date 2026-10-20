"use client";

import { useSyncExternalStore } from "react";
import {
  SIGNED_WAIVERS_COOKIE,
  parseSignedWaivers,
  type WaiverId,
} from "@/lib/waivers";

const subscribe = () => () => {};
const getSnapshot = () => document.cookie;
const getServerSnapshot = () => "";

function readCookie(cookies: string, name: string): string | undefined {
  const prefix = `${name}=`;
  const entry = cookies.split("; ").find((part) => part.startsWith(prefix));
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : undefined;
}

/**
 * Waivers signed online in this browser (set by /api/waiver/return). Renders
 * an empty list on the server and during hydration, then the real value.
 */
export function useSignedWaivers(): WaiverId[] {
  const cookies = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return parseSignedWaivers(readCookie(cookies, SIGNED_WAIVERS_COOKIE));
}

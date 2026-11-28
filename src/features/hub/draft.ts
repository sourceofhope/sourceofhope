"use client";

import { useCallback, useState } from "react";

/*
 * Hub drafts (spec §9.3): form state kept in sessionStorage per flow while
 * the tab is open, so closing and reopening resumes where the person left
 * off. Cleared on completion. Never holds payment details.
 */

const PREFIX = "tsoh:hub:";

function read<T>(key: string, initial: T): T {
  try {
    const raw = window.sessionStorage.getItem(PREFIX + key);
    return raw ? { ...initial, ...(JSON.parse(raw) as Partial<T>) } : initial;
  } catch {
    return initial;
  }
}

function write(key: string, value: unknown) {
  try {
    window.sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Private mode or full storage: the flow still works, it just won't resume.
  }
}

export function clearDraft(key: string) {
  try {
    window.sessionStorage.removeItem(PREFIX + key);
  } catch {
    // Nothing to clear.
  }
}

/** A flow's draft. `update` merges and saves; `clear` forgets it (on completion). */
export function useHubDraft<T extends Record<string, unknown>>(key: string, initial: T) {
  // The Hub renders only in the browser, so storage is readable on first render.
  const [draft, setDraft] = useState<T>(() => read(key, initial));

  const update = useCallback(
    (patch: Partial<T>) => {
      setDraft((current) => {
        const next = { ...current, ...patch };
        write(key, next);
        return next;
      });
    },
    [key],
  );

  const clear = useCallback(() => {
    clearDraft(key);
    setDraft(initial);
    // `initial` is a fresh object each render; the key identifies the draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { draft, update, clear };
}

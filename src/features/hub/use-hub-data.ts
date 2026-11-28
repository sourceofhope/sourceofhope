"use client";

import { useCallback, useEffect, useState } from "react";

export type HubData<T> =
  | { status: "loading"; data: null; retry: () => void }
  | { status: "error"; data: null; retry: () => void }
  | { status: "not-found"; data: null; retry: () => void }
  | { status: "ready"; data: T; retry: () => void };

type Loaded<T> = { url: string; status: "error" | "not-found" | "ready"; data: T | null };

/**
 * Fetch first-party Hub data (spec §9.8): loading → ready, or an error the
 * step shows with "Try again". Only our own API is called, so Get Help makes
 * no third-party requests. `url` null skips the request.
 */
export function useHubData<T>(url: string | null): HubData<T> {
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<Loaded<T> | null>(null);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (response.status === 404) return setLoaded({ url, status: "not-found", data: null });
        if (!response.ok) throw new Error(String(response.status));
        setLoaded({ url, status: "ready", data: (await response.json()) as T });
      })
      .catch((error: unknown) => {
        if ((error as Error).name !== "AbortError") setLoaded({ url, status: "error", data: null });
      });
    return () => controller.abort();
  }, [url, attempt]);

  const retry = useCallback(() => {
    setLoaded(null);
    setAttempt((n) => n + 1);
  }, []);

  if (!url || !loaded || loaded.url !== url) return { status: "loading", data: null, retry };
  if (loaded.status === "ready") return { status: "ready", data: loaded.data as T, retry };
  return { status: loaded.status, data: null, retry };
}

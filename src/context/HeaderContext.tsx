"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface Banner {
  text: string;
  link: string | null;
}

interface BannerEventResponse {
  enabled?: boolean;
  text?: string;
  link?: { url?: string | null } | null;
  expires?: string | null;
}

interface HeaderContextType {
  isBlocking?: boolean;
  bannerActive?: boolean;
  banner?: Banner | null;
  setBannerActive?: (active: boolean) => void;
  setIsBlocking?: (active: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [bannerActive, setBannerActive] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);

  // Show the newest enabled, unexpired banner event from Sanity.
  useEffect(() => {
    let cancelled = false;

    async function loadBanner() {
      try {
        const response = await fetch("/api/banner");
        if (!response.ok) return;
        const events: BannerEventResponse[] = await response.json();
        if (cancelled || !Array.isArray(events)) return;

        const now = Date.now();
        const active = events.find(
          (event) =>
            event.enabled &&
            event.text?.trim() &&
            (!event.expires || new Date(event.expires).getTime() > now),
        );

        if (active?.text) {
          setBanner({ text: active.text.trim(), link: active.link?.url ?? null });
          setBannerActive(true);
        }
      } catch {
        // The banner is optional; leave the header without one on failure.
      }
    }

    loadBanner();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <HeaderContext.Provider
      value={{
        isBlocking,
        bannerActive,
        banner,
        setBannerActive,
        setIsBlocking,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeaderContext() {
  const context = useContext(HeaderContext);
  return context;
}

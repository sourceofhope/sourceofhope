"use client";

import { createContext, useContext, useState } from "react";

interface Banner {
  text: string;
  link: string;
}

interface HeaderContextType {
  isBlocking?: boolean;
  bannerActive?: boolean;
  banner?: Banner | null;
  setBannerActive?: (active: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [banner] = useState<Banner | null>(null);
  const [bannerActive, setBannerActive] = useState(false);
  const [isBlocking] = useState(false);

  return (
    <HeaderContext.Provider
      value={{
        isBlocking,
        bannerActive,
        banner,
        setBannerActive,
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

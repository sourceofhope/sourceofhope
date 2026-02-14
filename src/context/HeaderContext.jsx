import { createContext, useContext, useMemo, useState } from "react";

export const HeaderContext = createContext({
  bannerActive: false,
  setBannerActive: () => {},
  isBlocking: false,
  setIsBlocking: () => {},
});

export const useHeaderContext = () => useContext(HeaderContext);

export function HeaderProvider({ children }) {
  const [isBlocking, setIsBlocking] = useState(false);
  const [bannerActive, setBannerActive] = useState(false);

  const value = useMemo(
    () => ({ bannerActive, setBannerActive, isBlocking, setIsBlocking }),
    [bannerActive, isBlocking],
  );

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
}

/** Optional convenience hooks (keep if you like your current API) */
export function useHeaderBlocking() {
  const { isBlocking } = useHeaderContext();
  return isBlocking;
}

export function useSetHeaderBlocking() {
  const { setIsBlocking } = useHeaderContext();
  return setIsBlocking;
}

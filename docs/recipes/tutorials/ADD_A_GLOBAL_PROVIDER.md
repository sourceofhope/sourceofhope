# Add a Global Provider

Use this recipe when you need state or context available on every page (a theme, a feature flag, a site-wide notice, etc.).

There is exactly one layout in this project:

- `/src/app/layout.tsx`

Every page, including Next.js's default 404 page, renders inside it. Global providers go here and nowhere else.

---

## Current Provider Tree

```tsx
<body>
  <Analytics />
  <SpeedInsights />
  <HeaderProvider>
    <StoreCartProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </StoreCartProvider>
  </HeaderProvider>
</body>
```

- `HeaderProvider` (`/src/context/HeaderContext.tsx`): `isBlocking`, `bannerActive`, and their setters
- `StoreCartProvider` (`/src/context/StoreCartContext.tsx`): cart, shipping method, processing-fee opt-in, persisted to `localStorage`

---

## Create the Provider

Providers use React context and state, so they must be Client Components. Put them in `/src/context/`.

```tsx
// /src/context/NoticeContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const NOTICE_STORAGE_KEY = "sourceofhope_notice_dismissed";

interface NoticeContextType {
  dismissed: boolean;
  dismiss: () => void;
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

export function NoticeProvider({ children }: { children: ReactNode }) {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(NOTICE_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(NOTICE_STORAGE_KEY, String(dismissed));
    } catch {
      // Storage can be unavailable (private mode); the notice still works per visit.
    }
  }, [dismissed]);

  return (
    <NoticeContext.Provider value={{ dismissed, dismiss: () => setDismissed(true) }}>
      {children}
    </NoticeContext.Provider>
  );
}

export function useNotice() {
  const context = useContext(NoticeContext);
  if (!context) {
    throw new Error("useNotice must be used within NoticeProvider");
  }
  return context;
}
```

Rules:

- Guard anything that touches `window`/`localStorage` with `typeof window === "undefined"` and `try/catch`, as `StoreCartContext` does. The layout is rendered on the server first.
- Values read from `localStorage` differ between the server render and the first client render. Components that display them should wait until after mount (see how `/src/components/store/Cart.tsx` uses an `isHydrated` flag) to avoid hydration warnings.
- Never import server-only modules (`/src/lib/environment.server.ts`, `/src/lib/sanity-client.ts`, `/src/lib/sanity-content.ts`, `/src/lib/store-pricing.ts`) into a provider. Pass server data in as props from the layout instead.

---

## Mount It in the Root Layout

Nest the new provider inside the existing ones so `Header`, `Footer`, and every page can use it, and so it can itself use the header and cart contexts if needed:

```tsx
// /src/app/layout.tsx
import { NoticeProvider } from "@/context/NoticeContext";

<HeaderProvider>
  <StoreCartProvider>
    <NoticeProvider>
      <Header />
      <main className="w-full min-h-screen text-sm md:text-md lg:text-lg">
        {children}
      </main>
      <Footer />
    </NoticeProvider>
  </StoreCartProvider>
</HeaderProvider>
```

`layout.tsx` stays a Server Component; it can render client providers as children.

---

## Validation checklist

- Normal routes render without regressions (home, a program page, `/store`)
- A non-existent URL (e.g. `/does-not-exist`) shows the 404 page with the header and footer intact
- The mobile header menu still opens, drills down, and closes
- Cart contents persist after a page reload (`localStorage` key `sourceofhope_cart`)
- No hydration warnings in the browser console
- `npm run build` passes (catches server-only imports in client code)

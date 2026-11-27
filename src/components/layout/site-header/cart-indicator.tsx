"use client";

import { useSyncExternalStore } from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { focusRing } from "@/components/ui/lib/tv";
import { Link } from "@/i18n/navigation";
import { CART_CHANGED_EVENT, CART_STORAGE_KEY, storedCartCount } from "@/lib/store/cart-keys";

function subscribe(onChange: () => void) {
  window.addEventListener(CART_CHANGED_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CART_CHANGED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readCount(): number {
  try {
    return storedCartCount(window.localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    return 0;
  }
}

/** The header cart (spec §8.2): shown only when the cart has items, with the count. */
export function CartIndicator({ surface }: { surface: "default" | "inverse" }) {
  const t = useTranslations("Shell");
  const count = useSyncExternalStore(subscribe, readCount, () => 0);
  if (count === 0) return null;
  return (
    <Link
      href="/store/cart"
      aria-label={t("cart", { count })}
      className={`relative inline-grid size-11 place-items-center rounded-md [&_svg]:size-6 ${surface === "inverse" ? `text-on-inverse ${focusRing.inverse}` : `text-ink hover:bg-surface-muted ${focusRing.default}`}`}
    >
      <ShoppingBagIcon aria-hidden="true" />
      <span aria-hidden="true" className="absolute top-1 right-1 grid min-w-5 place-items-center rounded-full bg-action px-1 text-xs font-bold text-on-inverse">
        {count}
      </span>
    </Link>
  );
}

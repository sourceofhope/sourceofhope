import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { UtilityTemplate } from "@/components/layout/templates";
import { CartView } from "@/features/store/cart-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Store");
  return { title: t("cartTitle"), robots: { index: false } };
}

/* Cart (spec §10.9): Utility template. */
export default async function CartPage() {
  const t = await getTranslations("Store");
  return (
    <UtilityTemplate title={t("cartTitle")}>
      <CartView />
    </UtilityTemplate>
  );
}

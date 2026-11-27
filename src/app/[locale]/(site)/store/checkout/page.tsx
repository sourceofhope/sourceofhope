import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { UtilityTemplate } from "@/components/layout/templates";
import { CheckoutView } from "@/features/store/checkout-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Store");
  return { title: t("checkoutTitle"), robots: { index: false } };
}

/* Checkout (spec §10.9): Utility template, page width for the payment columns. */
export default async function CheckoutPage() {
  const t = await getTranslations("Store");
  return (
    <UtilityTemplate title={t("checkoutTitle")} width="page">
      <CheckoutView />
    </UtilityTemplate>
  );
}

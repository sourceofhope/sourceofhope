import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { UtilityTemplate } from "@/components/layout/templates";
import { OrderStatus } from "@/features/store/order-status";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Store");
  return { title: t("successTitle"), robots: { index: false } };
}

/* Order result (spec §10.9): Utility template. */
export default async function SuccessPage() {
  const t = await getTranslations("Store");
  return (
    <UtilityTemplate title={t("checkoutTitle")}>
      <OrderStatus />
    </UtilityTemplate>
  );
}

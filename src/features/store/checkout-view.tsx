"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import CheckoutDetailsSection from "@/components/store/checkout/CheckoutDetailsSection";
import ExpressCheckoutSection from "@/components/store/checkout/ExpressCheckoutSection";
import SelfCheckoutSection from "@/components/store/checkout/SelfCheckoutSection";
import { useCartActions } from "@/context/StoreCartContext";

const noop = () => () => {};

/**
 * Checkout (slice 3.7): today's working Stripe and PayPal sections inside
 * the new shell, unchanged so existing checkout keeps working in test mode.
 * Phase 4 replaces payments with the Give flows' server-priced intents.
 */
export function CheckoutView() {
  const t = useTranslations("Store");
  const { cart, shippingMethod, getCartCost, getTaxCost, getProcessingFeeCost, getCartTotal, getCartItemCount, getShippingCost } = useCartActions();
  const hydrated = useSyncExternalStore(noop, () => true, () => false);

  if (!hydrated || cart.length === 0) {
    return (
      <EmptyState
        level={2}
        title={t("checkoutEmpty")}
        action={
          <LinkButton href="/store" variant="secondary">
            {t("continue")}
          </LinkButton>
        }
      />
    );
  }

  const money = { subtotal: getCartCost(), shippingCost: getShippingCost(), taxAmount: getTaxCost(), processingFee: getProcessingFeeCost(), total: getCartTotal() };
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="flex flex-col gap-6 lg:col-span-3">
        <ExpressCheckoutSection total={money.total} items={cart} processingFee={money.processingFee} shippingMethod={shippingMethod} shippingCost={money.shippingCost} taxAmount={money.taxAmount} />
      </div>
      <div className="flex flex-col gap-6 lg:col-span-6">
        <SelfCheckoutSection cart={cart} getCartItemCount={getCartItemCount} shippingMethod={shippingMethod} {...money} />
      </div>
      <div className="flex flex-col gap-6 lg:col-span-3">
        <CheckoutDetailsSection cart={cart} getCartItemCount={getCartItemCount} shippingMethod={shippingMethod} {...money} />
      </div>
    </div>
  );
}

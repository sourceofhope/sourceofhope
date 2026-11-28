"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useCartActions } from "@/context/StoreCartContext";
import { CheckoutSummary } from "./checkout/checkout-summary";
import { ExpressCheckout } from "./checkout/express-checkout";
import { SelfCheckout } from "./checkout/self-checkout";

const noop = () => () => {};

/**
 * Checkout (slice 3.7): express (Stripe Checkout, PayPal), card on this page
 * (Stripe Elements) and the summary, on the same endpoints as before so
 * existing checkout keeps working in test mode.
 */
export function CheckoutView() {
  const t = useTranslations("Store");
  const { cart, shippingMethod, getCartCost, getTaxCost, getProcessingFeeCost, getCartTotal, getShippingCost } = useCartActions();
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

  const totals = { subtotal: getCartCost(), shippingCost: getShippingCost(), taxAmount: getTaxCost(), processingFee: getProcessingFeeCost(), total: getCartTotal() };
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="flex flex-col gap-6 lg:col-span-7">
        <ExpressCheckout cart={cart} shippingMethod={shippingMethod} totals={totals} />
        <SelfCheckout cart={cart} shippingMethod={shippingMethod} totals={totals} />
      </div>
      <div className="lg:col-span-5">
        <CheckoutSummary cart={cart} totals={totals} />
      </div>
    </div>
  );
}

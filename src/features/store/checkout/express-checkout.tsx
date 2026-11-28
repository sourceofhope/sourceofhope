"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import type { CartItem } from "@/context/StoreCartContext";
import type { CheckoutTotals } from "./checkout-summary";

type Provider = { id: string; name: string; enabled: boolean };

/**
 * Express checkout with Stripe Checkout or PayPal (slice 3.7). Same endpoints
 * as before; Phase 4 moves pricing fully server-side for gifts.
 */
export function ExpressCheckout({ cart, shippingMethod, totals }: { cart: CartItem[]; shippingMethod: string; totals: CheckoutTotals }) {
  const t = useTranslations("Checkout");
  const [providers, setProviders] = useState<Provider[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/checkout-providers")
      .then((r) => r.json())
      .then((data: { data?: Provider[] }) => setProviders((data.data ?? []).filter((p) => p.enabled && ["Stripe", "PayPal"].includes(p.name))))
      .catch(() => setLoadFailed(true));
  }, []);

  async function start(provider: string) {
    setBusy(provider);
    setError(false);
    const origin = window.location.origin;
    const endpoint = provider === "Stripe" ? "/api/checkout/create-stripe-checkout" : "/api/checkout/create-paypal-order";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          shippingMethod,
          shippingCost: totals.shippingCost,
          taxAmount: totals.taxAmount,
          processingFee: totals.processingFee,
          successUrl: `${origin}/store/success`,
          cancelUrl: `${origin}/store/checkout`,
        }),
      });
      const data = (await response.json()) as { url?: string; approvalUrl?: string; error?: string };
      const next = data.url ?? data.approvalUrl;
      if (data.error || !next) throw new Error("no redirect");
      window.location.assign(next);
    } catch {
      setError(true);
      setBusy(null);
    }
  }

  return (
    <Card>
      <section aria-labelledby="express-checkout" className="flex flex-col gap-4 p-6">
        <Heading level={2} size="xl" id="express-checkout">
          {t("express")}
        </Heading>
        <p className="text-ink-soft">{t("expressText")}</p>
        {loadFailed ? <Alert tone="danger">{t("providersFailed")}</Alert> : null}
        {error ? <Alert tone="danger">{t("failed")}</Alert> : null}
        {providers === null && !loadFailed ? (
          <p role="status" className="flex items-center gap-2 text-muted">
            <Spinner />
            {t("loadingProviders")}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {(providers ?? []).map((p) => (
              <Button key={p.id} type="button" variant="secondary" fullWidth loading={busy === p.name} disabled={busy !== null} onClick={() => start(p.name)}>
                {t("payWith", { provider: p.name })}
              </Button>
            ))}
          </div>
        )}
        <p className="text-sm text-muted">{t("secure")}</p>
      </section>
    </Card>
  );
}

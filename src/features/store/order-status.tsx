"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { LinkButton } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCartActions } from "@/context/StoreCartContext";

type Status = "checking" | "none" | "complete" | "processing" | "open" | "error";

/**
 * The order result after checkout (slice 3.7). Same lookups as today's page
 * (Stripe session, Stripe payment intent, PayPal order); Phase 4 replaces
 * them with the opaque `public_ref` endpoint (02 §8.1).
 */
export function OrderStatus() {
  const t = useTranslations("Store");
  const [status, setStatus] = useState<Status>("checking");
  const [email, setEmail] = useState("");
  const done = useRef(false);
  const { cart, clearCart, updateProcessingFee, getCartTotal, getTaxCost, getShippingCost } = useCartActions();

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const token = params.get("token");
    const paymentIntent = params.get("payment_intent");
    const saved = sessionStorage.getItem("checkoutEmail") ?? "";
    sessionStorage.removeItem("checkoutEmail");

    const lookup = sessionId
      ? fetch(`/api/checkout/retrieve-stripe-session-status?session_id=${encodeURIComponent(sessionId)}`).then((r) => r.json()).then((r) => ({ ...r, status: ({ complete: "complete", open: "open", expired: "error" } as Record<string, Status>)[r.status] ?? "processing" }))
      : token
        ? fetch(`/api/checkout/retrieve-paypal-order-status?token=${encodeURIComponent(token)}`).then((r) => r.json())
        : paymentIntent
          ? fetch(`/api/checkout/retrieve-stripe-payment-intent-status?payment_intent=${encodeURIComponent(paymentIntent)}`).then((r) => r.json()).then((r) => ({ ...r, status: ({ succeeded: "complete", processing: "processing", requires_payment_method: "error" } as Record<string, Status>)[r.status] ?? "processing" }))
          : null;

    if (!lookup) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- no order in the URL: nothing to look up.
      setStatus("none");
      return;
    }
    lookup
      .then((r: { error?: unknown; status?: Status; customer_email?: string }) => {
        setStatus(r.error ? "error" : (r.status ?? "processing"));
        setEmail(r.customer_email || saved);
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    if (status !== "complete") return;
    const params = new URLSearchParams(window.location.search);
    const w = window as unknown as { dataLayer?: unknown[] };
    if (w.dataLayer) {
      w.dataLayer.push({ ecommerce: null });
      w.dataLayer.push({
        event: "purchase",
        ecommerce: {
          transaction_id: params.get("session_id") ?? params.get("token") ?? params.get("payment_intent") ?? "unknown",
          value: getCartTotal(),
          tax: getTaxCost(),
          shipping: getShippingCost(),
          currency: "USD",
          items: cart.map((item) => ({ item_id: String(item.id), item_name: item.title, price: item.price, quantity: item.quantity })),
        },
      });
    }
    clearCart();
    updateProcessingFee(false);
    // Runs once when the order completes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "checking") {
    return (
      <p role="status" className="flex items-center gap-3 text-ink-soft">
        <Spinner />
        {t("checking")}
      </p>
    );
  }

  const content = {
    complete: { tone: "success", title: t("successTitle"), text: email ? t("successText", { email }) : t("successNoEmail") },
    processing: { tone: "info", title: t("processingTitle"), text: t("processingText") },
    open: { tone: "warning", title: t("openTitle"), text: t("openText") },
    error: { tone: "danger", title: t("errorTitle"), text: t("errorText") },
    none: { tone: "info", title: t("noOrderTitle"), text: t("noOrderText") },
  } as const;
  const c = content[status];
  return (
    <div className="flex flex-col gap-6">
      <Alert tone={c.tone} title={c.title}>
        {c.text}
      </Alert>
      <div className="flex flex-wrap gap-3">
        <LinkButton href={status === "open" ? "/store/cart" : "/store"} variant="secondary">
          {status === "open" ? t("viewCart") : t("continue")}
        </LinkButton>
      </div>
    </div>
  );
}

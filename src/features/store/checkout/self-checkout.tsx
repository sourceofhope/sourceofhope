"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { z } from "zod";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, useZodForm } from "@/components/ui/field";
import { Heading } from "@/components/ui/heading";
import type { CartItem } from "@/context/StoreCartContext";
import { formatMoney } from "@/i18n/format";
import type { AppLocale } from "@/i18n/locales";
import { useRouter } from "@/i18n/navigation";
import type { CheckoutTotals } from "./checkout-summary";

const detailsSchema = z.object({
  email: z.email("email"),
  firstName: z.string().trim().min(1, "required"),
  lastName: z.string().trim().min(1, "required"),
  address: z.string().trim().min(1, "required"),
  city: z.string().trim().min(1, "required"),
  state: z.string().trim().min(1, "required"),
  zipCode: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "zip"),
});
type Details = z.output<typeof detailsSchema>;

function PayForm({ total }: { total: number }) {
  const t = useTranslations("Checkout");
  const locale = useLocale() as AppLocale;
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;
        setBusy(true);
        setError(false);
        const { error: submitError } = await elements.submit();
        if (submitError) {
          setError(true);
          setBusy(false);
          return;
        }
        const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: { return_url: `${window.location.origin}/store/success` },
          redirect: "if_required",
        });
        if (confirmError) {
          setError(true);
          setBusy(false);
        } else if (paymentIntent?.status === "succeeded") {
          router.push(`/store/success?payment_intent=${encodeURIComponent(paymentIntent.id)}`);
        }
      }}
    >
      <PaymentElement />
      {error ? <Alert tone="danger">{t("paymentFailed")}</Alert> : null}
      <Button type="submit" size="lg" fullWidth loading={busy} disabled={!stripe}>
        {t("pay", { total: formatMoney(total, locale, { cents: true }) })}
      </Button>
    </form>
  );
}

/** Pay by card on this page with Stripe Elements (slice 3.7; same endpoints as before). */
export function SelfCheckout({ cart, shippingMethod, totals }: { cart: CartItem[]; shippingMethod: string; totals: CheckoutTotals }) {
  const t = useTranslations("Checkout");
  const form = useZodForm(detailsSchema, { defaultValues: { email: "", firstName: "", lastName: "", address: "", city: "", state: "", zipCode: "" } });
  const [payment, setPayment] = useState<{ stripe: Promise<Stripe | null>; clientSecret: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const errors = form.formState.errors;
  const err = (name: keyof Details) => (errors[name]?.message ? t(`errors.${errors[name]!.message}` as "errors.required") : undefined);

  async function startPayment(details: Details) {
    setFailed(false);
    try {
      const key = (await (await fetch("/api/checkout/retrieve-stripe-publishable-key", { method: "POST", headers: { "Content-Type": "application/json" } })).json()) as { publishableKey?: string };
      if (!key.publishableKey) throw new Error("no key");
      const address = { firstName: details.firstName, lastName: details.lastName, address: details.address, city: details.city, state: details.state, zipCode: details.zipCode, country: "United States" };
      const data = (await (
        await fetch("/api/checkout/create-stripe-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart,
            shippingMethod,
            shippingCost: totals.shippingCost,
            taxAmount: totals.taxAmount,
            processingFee: totals.processingFee,
            subtotal: totals.subtotal,
            shippingAddress: address,
            billingAddress: address,
            totalAmount: totals.total.toFixed(2),
            email: details.email,
          }),
        })
      ).json()) as { clientSecret?: string; error?: string };
      if (data.error || !data.clientSecret) throw new Error("no intent");
      sessionStorage.setItem("checkoutEmail", details.email);
      setPayment({ stripe: loadStripe(key.publishableKey), clientSecret: data.clientSecret });
    } catch {
      setFailed(true);
    }
  }

  return (
    <Card>
      <section aria-labelledby="self-checkout" className="flex flex-col gap-6 p-6">
        <Heading level={2} size="xl" id="self-checkout">
          {payment ? t("payment") : t("details")}
        </Heading>
        {payment ? (
          <>
            <div>
              <Button type="button" variant="tertiary" onClick={() => setPayment(null)}>
                {t("edit")}
              </Button>
            </div>
            <Elements stripe={payment.stripe} options={{ clientSecret: payment.clientSecret }}>
              <PayForm total={totals.total} />
            </Elements>
          </>
        ) : (
          <form noValidate className="flex flex-col gap-5" onSubmit={form.handleSubmit(startPayment)}>
            <fieldset className="m-0 flex flex-col gap-4 border-0 p-0">
              <legend className="mb-2 p-0 font-semibold text-ink">{t("contact")}</legend>
              <Field label={t("fields.email")} error={err("email")}>
                <Input type="email" autoComplete="email" {...form.register("email")} />
              </Field>
            </fieldset>
            <fieldset className="m-0 flex flex-col gap-4 border-0 p-0">
              <legend className="mb-2 p-0 font-semibold text-ink">{t("shippingAddress")}</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("fields.firstName")} error={err("firstName")}>
                  <Input autoComplete="given-name" {...form.register("firstName")} />
                </Field>
                <Field label={t("fields.lastName")} error={err("lastName")}>
                  <Input autoComplete="family-name" {...form.register("lastName")} />
                </Field>
              </div>
              <Field label={t("fields.address")} error={err("address")}>
                <Input autoComplete="address-line1" {...form.register("address")} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label={t("fields.city")} error={err("city")}>
                  <Input autoComplete="address-level2" {...form.register("city")} />
                </Field>
                <Field label={t("fields.state")} error={err("state")}>
                  <Input autoComplete="address-level1" {...form.register("state")} />
                </Field>
                <Field label={t("fields.zip")} error={err("zipCode")}>
                  <Input autoComplete="postal-code" inputMode="numeric" {...form.register("zipCode")} />
                </Field>
              </div>
            </fieldset>
            {failed ? <Alert tone="danger">{t("failed")}</Alert> : null}
            <Button type="submit" size="lg" fullWidth loading={form.formState.isSubmitting}>
              {t("continue")}
            </Button>
          </form>
        )}
      </section>
    </Card>
  );
}

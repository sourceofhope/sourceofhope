"use client";

import { useSyncExternalStore } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useLocale, useTranslations } from "next-intl";
import { IconButton, LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { RadioCards } from "@/components/ui/radio-cards";
import { SHIPPING_OPTIONS, useCartActions } from "@/context/StoreCartContext";
import { formatMoney } from "@/i18n/format";
import type { AppLocale } from "@/i18n/locales";

const noop = () => () => {};

/** The cart (spec §10.9): labelled quantity inputs, shipping, the card-processing option and the summary. */
export function CartView() {
  const t = useTranslations("Store");
  const locale = useLocale() as AppLocale;
  const money = (n: number) => formatMoney(n, locale, { cents: true });
  const { cart, updateCartItem, removeFromCart, shippingMethod, updateShippingMethod, processingFee, updateProcessingFee, getCartCost, getShippingCost, getTaxCost, getProcessingFeeCost, getCartTotal } = useCartActions();
  // The cart is in localStorage: render the empty state on the server, the real cart after hydration.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);

  if (!hydrated || cart.length === 0) {
    return (
      <EmptyState
        level={2}
        title={t("cartEmpty")}
        action={
          <LinkButton href="/store" variant="secondary">
            {t("continue")}
          </LinkButton>
        }
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <section aria-labelledby="cart-items" className="flex flex-col gap-6 lg:col-span-7">
        <Heading level={2} size="2xl" id="cart-items" className="sr-only">
          {t("cartTitle")}
        </Heading>
        <ul className="m-0 flex list-none flex-col divide-y divide-line border-y border-line p-0">
          {cart.map((item) => (
            <li key={`${item.id}-${item.size ?? ""}`} className="flex gap-4 py-5">
              {item.image ? <Image src={item.image} alt="" width={96} height={96} radius="md" className="size-24 shrink-0 object-cover" /> : null}
              <div className="flex flex-1 flex-col gap-2">
                <p className="font-semibold text-ink">{item.title ?? item.name}</p>
                <p className="text-sm text-muted">
                  {item.size ? `${t("size")}: ${item.size} · ` : ""}
                  {t("each", { price: money(item.price) })}
                </p>
                <div className="flex items-end gap-3">
                  <div className="w-24">
                    <Field label={t("quantity")}>
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={20}
                        value={String(item.quantity)}
                        aria-description={item.title ?? item.name}
                        onChange={(e) => {
                          const quantity = Math.min(20, Math.max(1, Number.parseInt(e.currentTarget.value, 10) || 1));
                          updateCartItem(item.id, { quantity });
                        }}
                      />
                    </Field>
                  </div>
                  <IconButton label={t("remove", { title: item.title ?? item.name })} icon={<TrashIcon aria-hidden="true" />} onClick={() => removeFromCart(item.id, item.size)} />
                </div>
              </div>
              <p className="font-semibold text-ink">{money(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <RadioCards
          label={t("shipping")}
          value={shippingMethod}
          onValueChange={updateShippingMethod}
          options={SHIPPING_OPTIONS.map((o) => ({ value: o.id, label: `${o.name} · ${money(o.cost)}`, description: o.time }))}
        />
        <Checkbox label={t("fee")} description={t("feeHint")} checked={processingFee} onCheckedChange={(checked) => updateProcessingFee(checked === true)} />
      </section>

      <aside aria-labelledby="cart-summary" className="lg:col-span-5">
        <Card>
          <div className="flex flex-col gap-4 p-6">
            <Heading level={2} size="xl" id="cart-summary">
              {t("summary")}
            </Heading>
            <dl className="m-0 flex flex-col gap-2">
              {[
                [t("subtotal"), getCartCost()],
                [t("shipping"), getShippingCost()],
                [t("tax"), getTaxCost()],
                ...(processingFee ? [[t("processing"), getProcessingFeeCost()] as const] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 text-ink-soft">
                  <dt>{label}</dt>
                  <dd className="m-0">{money(value as number)}</dd>
                </div>
              ))}
              <div className="mt-2 flex justify-between gap-4 border-t border-line pt-3 text-lg font-bold text-ink">
                <dt>{t("total")}</dt>
                <dd className="m-0">{money(getCartTotal())}</dd>
              </div>
            </dl>
            <LinkButton href="/store/checkout" size="lg" fullWidth>
              {t("checkout")}
            </LinkButton>
          </div>
        </Card>
      </aside>
    </div>
  );
}

"use client";

import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { STANDARD_TAX_RATE, type CartItem } from "@/context/StoreCartContext";
import { formatMoney } from "@/i18n/format";
import type { AppLocale } from "@/i18n/locales";

export type CheckoutTotals = { subtotal: number; shippingCost: number; taxAmount: number; processingFee: number; total: number };

/** The order being paid for: items and totals (slice 3.7). */
export function CheckoutSummary({ cart, totals }: { cart: CartItem[]; totals: CheckoutTotals }) {
  const t = useTranslations("Checkout");
  const s = useTranslations("Store");
  const locale = useLocale() as AppLocale;
  const money = (n: number) => formatMoney(n, locale, { cents: true });
  const rows: [string, string][] = [
    [s("subtotal"), money(totals.subtotal)],
    [s("shipping"), totals.shippingCost > 0 ? money(totals.shippingCost) : t("freeShipping")],
    [t("taxLine", { rate: Math.round(STANDARD_TAX_RATE * 10000) / 100 }), money(totals.taxAmount)],
    ...(totals.processingFee > 0 ? [[t("feeLine"), money(totals.processingFee)] as [string, string]] : []),
  ];
  return (
    <Card>
      <section aria-labelledby="checkout-summary" className="flex flex-col gap-4 p-6">
        <Heading level={2} size="xl" id="checkout-summary">
          {s("summary")}
        </Heading>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {cart.map((item) => (
            <li key={`${item.id}-${item.size ?? ""}`} className="flex gap-3">
              {item.image ? <Image src={item.image} alt="" width={64} height={64} radius="md" className="size-16 shrink-0 object-cover" /> : null}
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate font-semibold text-ink">{item.title ?? item.name}</p>
                <p className="text-sm text-muted">
                  {item.size ? `${s("size")}: ${item.size} · ` : ""}
                  {t("qty", { quantity: item.quantity })}
                </p>
              </div>
              <p className="font-semibold text-ink">{money(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="m-0 flex flex-col gap-2 border-t border-line pt-4">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 text-ink-soft">
              <dt>{label}</dt>
              <dd className="m-0">{value}</dd>
            </div>
          ))}
          <div className="mt-2 flex justify-between gap-4 border-t border-line pt-3 text-lg font-bold text-ink">
            <dt>{s("total")}</dt>
            <dd className="m-0">{money(totals.total)}</dd>
          </div>
        </dl>
      </section>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useCartActions } from "@/context/StoreCartContext";
import type { Product } from "@/lib/content/loaders";

/**
 * Size, quantity and Add to cart (spec §10.9): labelled inputs, the primary
 * button, and a Toast instead of the old "Added To Cart" takeover.
 */
export function AddToCart({ product }: { product: Product }) {
  const t = useTranslations("Store");
  const { addToCart } = useCartActions();
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState("1");
  const [sizeError, setSizeError] = useState(false);
  const qty = Math.min(20, Math.max(1, Number.parseInt(quantity, 10) || 1));

  return (
    <form
      className="flex flex-col gap-5"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (product.sizes.length > 0 && !size) {
          setSizeError(true);
          return;
        }
        addToCart({ id: product.id, slug: product.slug, title: product.title, name: product.title, price: product.price, quantity: qty, image: product.images[0]?.src, size: size ?? undefined });
        toast.success(t("added"), { description: t("addedText", { title: product.title, quantity: qty }), action: { label: t("viewCart"), href: "/store/cart" } });
      }}
    >
      {product.sizes.length > 0 ? (
        <Select
          label={t("size")}
          placeholder={t("sizePlaceholder")}
          options={product.sizes.map((s) => ({ value: s, label: s }))}
          value={size}
          onValueChange={(v) => {
            setSize(v);
            setSizeError(false);
          }}
          error={sizeError ? t("sizeRequired") : undefined}
        />
      ) : null}
      <div className="max-w-32">
        <Field label={t("quantity")}>
          <Input type="number" inputMode="numeric" min={1} max={20} value={quantity} onChange={(e) => setQuantity(e.currentTarget.value)} />
        </Field>
      </div>
      <div>
        <Button type="submit" size="lg">
          {t("addToCart")}
        </Button>
      </div>
    </form>
  );
}

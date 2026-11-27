import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Prose } from "@/components/layout/prose";
import { DetailTemplate } from "@/components/layout/templates";
import { Image } from "@/components/ui/image";
import { AddToCart } from "@/features/store/add-to-cart";
import { formatMoney } from "@/i18n/format";
import type { AppLocale } from "@/i18n/locales";
import { localeAlternates } from "@/i18n/metadata";
import { getProduct } from "@/lib/content/loaders";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const locale = (await getLocale()) as AppLocale;
  const product = await getProduct(id, locale);
  // Before streaming starts, so an unknown product answers with a real 404 (spec §10.9).
  if (!product) notFound();
  return { title: product.title, description: product.shortDescription ?? undefined, alternates: localeAlternates(`/store/product/${product.slug}`, locale) };
}

/* A product (spec §10.9): Detail template. */
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Store");
  const product = await getProduct(id, locale);
  if (!product) notFound();
  const image = product.images[0];
  return (
    <DetailTemplate
      back={{ href: "/store", label: t("allProducts") }}
      title={product.title}
      meta={formatMoney(product.price, locale)}
      media={
        <Image
          src={image?.src ?? "/v2/core/placeholder.webp"}
          alt={image?.alt ?? ""}
          width={image?.width ?? 800}
          height={image?.height ?? 800}
          radius="lg"
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-square w-full object-cover"
        />
      }
    >
      {product.shortDescription ? <p className="text-lg text-ink-soft">{product.shortDescription}</p> : null}
      <AddToCart product={product} />
      {product.description.length ? (
        <Prose>
          {product.description.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </Prose>
      ) : null}
      {product.impact ? (
        <div className="rounded-md bg-surface-muted p-4">
          <p className="text-sm font-semibold text-muted">{t("impact")}</p>
          <p className="text-ink">{product.impact}</p>
        </div>
      ) : null}
    </DetailTemplate>
  );
}

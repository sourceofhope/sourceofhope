import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { HubLinkButton } from "@/components/layout/hub-link";
import { ListingTemplate } from "@/components/layout/templates";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/features/store/product-card";
import type { AppLocale } from "@/i18n/locales";
import { localeAlternates } from "@/i18n/metadata";
import { getProducts } from "@/lib/content/loaders";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Store");
  const locale = (await getLocale()) as AppLocale;
  return { title: t("title"), description: t("meta"), alternates: localeAlternates("/store", locale) };
}

/* Store (spec §10.9): the product grid on the Listing template. */
export default async function StorePage() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Store");
  const products = await getProducts(locale);
  return (
    <ListingTemplate header={{ title: t("title"), lead: t("lead") }}>
      {products.length ? (
        <ul className="m-0 grid list-none grid-cols-2 gap-6 p-0 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      ) : (
        <EmptyState
          level={2}
          title={t("emptyTitle")}
          action={
            <HubLinkButton hub={{ action: "give" }} variant="secondary">
              {t("give")}
            </HubLinkButton>
          }
        >
          {t("emptyText")}
        </EmptyState>
      )}
    </ListingTemplate>
  );
}

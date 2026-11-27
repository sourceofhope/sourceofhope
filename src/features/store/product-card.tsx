import { useLocale } from "next-intl";
import { Card, CardLink } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { formatMoney } from "@/i18n/format";
import type { AppLocale } from "@/i18n/locales";
import type { Product } from "@/lib/content/loaders";

/** ProductCard (spec §10.9): one link to the product, no button nested in it. */
export function ProductCard({ product, level = 2 }: { product: Product; level?: 2 | 3 }) {
  const locale = useLocale() as AppLocale;
  const image = product.images[0];
  return (
    <Card as="li" interactive>
      {image ? (
        <Image src={image.src} alt="" width={image.width} height={image.height} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="aspect-square w-full object-cover" />
      ) : (
        <Image src="/v2/core/placeholder.webp" alt="" width={600} height={600} className="aspect-square w-full object-cover" />
      )}
      <div className="flex flex-col gap-1 p-4">
        <Heading level={level} size="xl">
          <CardLink href={`/store/product/${product.slug}`}>{product.title}</CardLink>
        </Heading>
        <p className="font-semibold text-ink-soft">{formatMoney(product.price, locale)}</p>
      </div>
    </Card>
  );
}

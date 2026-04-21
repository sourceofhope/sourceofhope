import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";
import StorefrontProductCard from "@/components/store/StorefrontProductCard";
import { fetchProducts } from "@/lib/sanity-content";

export default async function StorefrontProductSection() {
  const products = await fetchProducts();

  return (
    <section className="w-full px-5 lg:px-35 pt-25 mb-10">
      <div className="mb-10 flex flex-col gap-5 max-w-2xl">
        <div className="grid gap-1">
          <Title>Storefront</Title>
          <Heading>Shop With Purpose</Heading>
        </div>
      </div>

      <div className="w-full min-h-80 flex items-center">
        {products.length === 0 && (
          <div className="w-full text-center text-neutral-400">
            No products available
          </div>
        )}

        {products.length > 0 && (
          <article className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <StorefrontProductCard key={product.id} product={product} />
            ))}
          </article>
        )}
      </div>
    </section>
  );
}

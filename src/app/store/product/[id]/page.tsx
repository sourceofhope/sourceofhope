import { HeartIcon } from "@heroicons/react/20/solid";
import Title from "@/components/ui/Title";
import { LinkButton } from "@/components/ui/Button";
import Cart from "@/components/store/Cart";
import Loader from "@/components/structure/Loader";
import HeaderBlocker from "@/components/layout/HeaderBlocker";
import StoreProductDetail from "@/components/store/StoreProductDetail";
import { fetchProductById } from "@/lib/sanity-content";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return (
      <>
        <HeaderBlocker />
        <Cart />
        <Loader />
      </>
    );
  }

  const product = await fetchProductById(id);

  if (!product) {
    return (
      <>
        <HeaderBlocker />
        <Cart />
        <section className="w-full min-h-screen flex flex-col py-5 items-center justify-center text-center px-5">
          <div className="max-w-xl">
            <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center shadow-sm">
              <HeartIcon className="w-10 h-10 text-accent-500" />
            </div>

            <Title>We Can&apos;t Find That Product</Title>
            <p className="text-gray-700 leading-relaxed mb-10">
              We couldn&apos;t find the product you were looking for, but every
              visit here still supports our mission.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <LinkButton href="/store" text="Browse our Store" full />
              <LinkButton href="/donate" text="Make a Donation" full />
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <HeaderBlocker />
      <Cart />
      <StoreProductDetail product={product} />
    </>
  );
}

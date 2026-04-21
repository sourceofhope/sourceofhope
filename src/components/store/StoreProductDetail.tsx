"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckIcon, PlusIcon } from "@heroicons/react/20/solid";
import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/Button";
import { useCartActions } from "@/context/StoreCartContext";
import Takeover from "@/components/ui/Takeover";
import { type SanityProduct } from "@/lib/sanity-content";

interface StoreProductDetailProps {
  product: SanityProduct;
}

export default function StoreProductDetail({
  product,
}: StoreProductDetailProps) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCartActions();

  const imageUrl = product.image?.sourceUrl;
  const imageAlt = product.image?.altText || product.title;
  const priceValue = Number(product.price || 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      name: product.title,
      price: priceValue,
      quantity: 1,
      image: imageUrl,
      size: product.size,
    };

    (window as { dataLayer?: unknown[] }).dataLayer ??= [];
    (window as { dataLayer: unknown[] }).dataLayer.push({ ecommerce: null });
    (window as { dataLayer: unknown[] }).dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        currency: "USD",
        value: priceValue,
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            price: priceValue,
            quantity: 1,
          },
        ],
      },
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
    addToCart(cartItem);
  };

  return (
    <>
      <Takeover
        className="bg-neutral-400 rounded-2xl px-5 py-3 w-fit h-fit text-neutral-600 flex justify-between gap-3 items-center"
        active={added}
        setActive={setAdded}>
        <p>Added To Cart</p>
        <CheckIcon className="size-5 shrink-0" />
      </Takeover>

      <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 p-5 lg:px-35 pt-25">
        <div className="w-full flex justify-center lg:justify-start">
          <div className="w-full max-w-2xl">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-neutral-200 flex items-center justify-center">
                  <span className="text-neutral-400">No image available</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 self-start">
          <Title>{product.title}</Title>
          <Heading>${priceValue.toFixed(2)}</Heading>
          <p className="text-gray-700 text-sm md:text-md">
            {product.shortDescription}
          </p>

          <div className="flex flex-col md:flex-row gap-5 mt-5">
            <button
              onClick={handleAddToCart}
              aria-label="Add To Cart"
              className="clsAddToCart group inline-flex items-center rounded-2xl px-10 py-5 bg-emerald-500 hover:bg-emerald-600 transition-all duration-700 w-full font-semibold text-neutral-50">
              <span className="flex w-full gap-3 items-center justify-between text-sm md:text-md">
                <span>Add To Cart</span>
                <PlusIcon className="w-[1em] h-[1em] transition-transform duration-500" />
              </span>
            </button>
            <LinkButton href="/donate" text="Make a Donation" full />
          </div>

          <div className="mt-5 text-gray-800 leading-relaxed text-sm md:text-md">
            {product.longDescription}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="p-5 bg-primary-50 rounded-2xl border border-primary-100 shadow-sm space-y-3">
            <h3 className="text-lg font-semibold text-primary-900">
              Your Impact
            </h3>
            <p className="text-sm md:text-md text-gray-800 leading-relaxed">
              {product.impact}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

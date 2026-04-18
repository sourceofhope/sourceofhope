"use client";

import { useState } from "react";
import { CheckIcon, PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useCartActions } from "@/context/StoreCartContext";
import Overlay from "@/components/ui/Overlay";
import ExpressiveLink from "@/components/ui/expressive/ExpressiveLink";
import Takeover from "@/components/ui/Takeover";
import Heading from "@/components/ui/Heading";
import { type SanityProduct } from "@/lib/sanity-content";

interface StorefrontProductCardProps {
  product: SanityProduct;
}

export default function StorefrontProductCard({
  product,
}: StorefrontProductCardProps) {
  const [added, setAdded] = useState(false);
  const [active, setActive] = useState(false);
  const { addToCart } = useCartActions();

  const priceValue = Number(product.price || 0);
  const src = product.image?.sourceUrl;
  const alt = product.image?.altText || product.title;

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      name: product.title,
      price: priceValue,
      quantity: 1,
      image: src || "/v2/core/placeholder.webp",
      size: product.size,
    };

    if (typeof window !== "undefined") {
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
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
    addToCart(cartItem);
  };

  return (
    <>
      <Link
        href={`/store/product/${product.slug}`}
        className="group relative hidden md:flex flex-col no-underline! overflow-hidden rounded-2xl bg-primary-800 shadow-md transition-all duration-500 hover:shadow-xl">
        <div className="relative aspect-square overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src || "/v2/core/placeholder.webp"}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-opacity duration-700 opacity-100"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/10 via-black/5 to-transparent" />
        </div>
        <div
          className="relative flex flex-col group gap-2 p-5 text-neutral-50"
          onClick={handleAddToCart}>
          <Heading className="text-neutral-50">{product.title}</Heading>
          <p className="text-sm md:text-md">${priceValue.toFixed(2)}</p>
          <button
            className="clsAddToCart text-sm md:text-md inline-flex h-fit w-full items-center gap-3 font-bold"
            id="add-to-cart-button">
            Add To Cart
            <PlusIcon className="opacity-0 group-hover:opacity-100 duration-300 transition-opacity aspect-square w-[1em]" />
          </button>
        </div>
      </Link>

      <div
        onClick={() => setActive(true)}
        className="group relative md:hidden flex flex-col no-underline! overflow-hidden rounded-2xl bg-neutral-900 shadow-md transition-all duration-500 hover:shadow-xl">
        <div
          className="relative aspect-square overflow-hidden"
          onClick={handleAddToCart}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src || "/v2/core/placeholder.webp"}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-opacity duration-700 opacity-100"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/10 via-black/5 to-transparent" />
        </div>
        <div className="relative flex flex-col gap-2 p-5 text-neutral-50">
          <Heading className="text-neutral-50">{product.title}</Heading>
          <p className="text-sm md:text-md">${priceValue.toFixed(2)}</p>
          <span className="text-sm md:text-md inline-flex w-full justify-between items-center gap-1 font-semibold">
            <span>Preview Product</span>
          </span>
        </div>
      </div>

      <Takeover
        className="bg-neutral-400 rounded-2xl px-5 py-3 w-fit h-fit text-neutral-600 flex justify-between gap-3 items-center"
        active={added}
        setActive={setAdded}>
        <p>Added To Cart</p>
        <CheckIcon className="size-5 shrink-0" />
      </Takeover>

      <Overlay active={active} setActive={setActive}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-neutral-900">
              {product.title}
            </h2>

            <button
              onClick={() => setActive(false)}
              className="rounded-full p-2 hover:bg-neutral-200 transition">
              <XMarkIcon className="size-5 text-neutral-600" />
            </button>
          </div>
          <div className="flex flex-row justify-between">
            <p className="text-md font-semibold text-primary-800">
              ${priceValue.toFixed(2)}
            </p>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {product.shortDescription}
          </p>
          <div className="flex justify-end w-fit">
            <ExpressiveLink
              ariaLabel={`Learn more about ${product.title} at the source of hope`}
              to={`/store/product/${product.slug}`}
              className="font-semibold text-accent-700 hover:text-accent-800 transition-colors duration-750">
              Shop &apos;{product.title}&apos;
            </ExpressiveLink>
          </div>
        </div>
      </Overlay>
    </>
  );
}

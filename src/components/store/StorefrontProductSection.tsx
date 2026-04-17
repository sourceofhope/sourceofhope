"use client";

import { useEffect, useState } from "react";
import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";
import { CheckIcon, PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useCartActions } from "@/context/StoreCartContext";
import Overlay from "@/components/ui/Overlay";
import ExpressiveLink from "@/components/ui/ExpressiveLink";
import Takeover from "@/components/ui/Takeover";

interface Product {
  id: number;
  slug: string;
  acf?: {
    title: string;
    price: string;
    shortdescription?: string;
    size?: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      alt_text: string;
      source_url: string;
    }>;
  };
}

interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
}

export default function StorefrontProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/product-cat");
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products based on selected category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = "/api/product?per_page=100";

        const response = await fetch(url);
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => fetchProducts());
    } else {
      setTimeout(fetchProducts, 1);
    }
  }, []);

  return (
    <section className="w-full px-5 lg:px-35 pt-25 mb-10">
      <div className="mb-10 flex flex-col gap-5 max-w-2xl">
        <div className="grid gap-1">
          <Title>Storefront</Title>
          <Heading>Shop With Purpose</Heading>
        </div>
      </div>

      <div className="w-full min-h-80 flex items-center">
        {loading && (
          <div className="w-full text-center text-neutral-400">
            Loading products
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="w-full text-center text-neutral-400">
            No products available
          </div>
        )}

        {!loading && products.length > 0 && (
          <article className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </article>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [loaded, setLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const [active, setActive] = useState(false);
  const { addToCart } = useCartActions();
  const image = product._embedded?.["wp:featuredmedia"]?.[0];
  const src = image?.source_url;

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const priceValue = parseFloat(product.acf?.price || "0");

    const cartItem = {
      id: String(product.id),
      slug: product.slug,
      title: product.acf?.title || "Untitled Product",
      name: product.acf?.title || "Untitled Product",
      price: priceValue,
      quantity: 1,
      image: src || "/v2/core/placeholder.webp",
    };

    if (product.acf?.size) {
      (cartItem as any).size = product.acf.size;
    }

    // Push to dataLayer for GA4
    if (typeof window !== "undefined") {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ ecommerce: null });
      (window as any).dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          currency: "USD",
          value: priceValue,
          items: [
            {
              item_id: String(product.id),
              item_name: product.acf?.title || "Untitled Product",
              price: priceValue,
              quantity: 1,
            },
          ],
        },
      });
    }

    setAdded(true);
    addToCart(cartItem);
  };

  return (
    <>
      <Link
        href={`/store/product/${product.slug}`}
        className="group relative hidden md:flex flex-col !no-underline overflow-hidden rounded-2xl bg-neutral-900 shadow-md transition-all duration-500 hover:shadow-xl">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={src || "/v2/core/placeholder.webp"}
            alt={image?.alt_text || ""}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-transparent" />
        </div>
        <div
          className="relative flex flex-col group gap-2 p-5 text-neutral-50"
          onClick={handleAddToCart}>
          <Heading className="text-neutral-50">{product.acf?.title}</Heading>
          <p className="text-sm md:text-md">
            ${parseFloat(product.acf?.price || "0").toFixed(2)}
          </p>
          <button
            className="clsAddToCart text-sm md:text-md inline-flex h-fit w-full items-center gap-3 font-bold"
            id="add-to-cart-button">
            Add To Cart
            <PlusIcon className="opacity-0 group-hover:opacity-100 duration-300 transition-opacity aspect-square w-[1em]" />
          </button>
        </div>
      </Link>

      {/* Mobile */}
      <div
        onClick={() => setActive(true)}
        className="group relative md:hidden flex flex-col !no-underline overflow-hidden rounded-2xl bg-neutral-900 shadow-md transition-all duration-500 hover:shadow-xl">
        <div
          className="relative aspect-square overflow-hidden"
          onClick={handleAddToCart}>
          <img
            src={src || "/v2/core/placeholder.webp"}
            alt={image?.alt_text || ""}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-transparent" />
        </div>
        <div className="relative flex flex-col gap-2 p-5 text-neutral-50">
          <Heading className="text-neutral-50">{product.acf?.title}</Heading>
          <p className="text-sm md:text-md">
            ${parseFloat(product.acf?.price || "0").toFixed(2)}
          </p>
          <span className="text-sm md:text-md inline-flex w-full justify-between items-center gap-1 font-semibold">
            <span>Preview Product</span>
          </span>
        </div>
      </div>

      {/* Added to cart indicator */}
      <Takeover
        className="bg-neutral-400 rounded-2xl px-5 py-3 w-fit h-fit text-neutral-600 flex justify-between gap-3 items-center"
        active={added}
        setActive={setAdded}>
        <p>Added To Cart</p>
        <CheckIcon className="size-5 shrink-0" />
      </Takeover>

      {/* Product preview modal */}
      <Overlay active={active} setActive={setActive}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-neutral-900">
              {product.acf?.title}
            </h2>

            <button
              onClick={() => setActive(false)}
              className="rounded-full p-2 hover:bg-neutral-200 transition">
              <XMarkIcon className="size-5 text-neutral-600" />
            </button>
          </div>
          <div className="flex flex-row justify-between">
            <p className="text-md font-semibold text-primary-800">
              ${parseFloat(product.acf?.price || "0").toFixed(2)}
            </p>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {product.acf?.shortdescription}
          </p>
          <div className="flex justify-end w-fit">
            <ExpressiveLink
              ariaLabel={`Learn more about ${product.acf?.title} at the source of hope`}
              to={`/store/product/${product.slug}`}
              className="font-semibold text-accent-700 hover:text-accent-800 transition-colors duration-750">
              Shop &apos;{product.acf?.title}&apos;
            </ExpressiveLink>
          </div>
        </div>
      </Overlay>
    </>
  );
}

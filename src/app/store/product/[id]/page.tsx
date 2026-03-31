'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckIcon, HeartIcon, PlusIcon } from '@heroicons/react/20/solid';
import Title from '@/components/ui/Title';
import Heading from '@/components/ui/Heading';
import { LinkButton, AnchorButton } from '@/components/ui/Button';
import { useCartActions } from '@/context/StoreCartContext';
import { useHeaderContext } from '@/context/HeaderContext';
import Cart from '@/components/store/Cart';
import Takeover from '@/components/ui/Takeover';
import Loader from '@/components/structure/Loader';

interface Product {
  id: string;
  slug: string;
  acf: {
    title: string;
    price: number;
    shortdescription: string;
    longdescription: string;
    impact: string;
    size?: string;
  };
  _embedded?: {
    'wp:featuredmedia': Array<{
      alt_text: string;
      source_url: string;
    }>;
  };
}

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const { addToCart } = useCartActions();
  const headerContext = useHeaderContext();
  const setIsBlocking = headerContext?.setIsBlocking;

  // Set blocking state on page load
  useEffect(() => {
    if (setIsBlocking) {
      setIsBlocking(true);
      return () => setIsBlocking(false);
    }
  }, [setIsBlocking]);

  // Fetch product data
  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/product/${id}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data);
        setError(false);
      } catch (err) {
        console.error('Failed to load product:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product) return;

    const cartItem = {
      id: product.id,
      slug: product.slug,
      title: product.acf.title,
      name: product.acf.title,
      price: product.acf.price,
      quantity: 1,
      image: product._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      size: product.acf.size,
    };

    // Push to Google Tag Manager
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ ecommerce: null });
    (window as any).dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'USD',
        value: product.acf.price,
        items: [
          {
            item_id: String(product.id),
            item_name: product.acf.title,
            price: product.acf.price,
            quantity: 1,
          },
        ],
      },
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
    addToCart(cartItem);
  };

  if (loading) {
    return (
      <>
        <Cart />
        <Loader />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Cart />
        <section className="w-full min-h-screen flex flex-col py-5 items-center justify-center text-center px-5">
          <div className="max-w-xl">
            <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center shadow-sm">
              <HeartIcon className="w-10 h-10 text-accent-500" />
            </div>

            <Title>We Can&apos;t Find That Product</Title>
            <p className="text-gray-700 leading-relaxed mb-10">
              We couldn&apos;t find the product you were looking for, but every visit
              here still supports our mission.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <LinkButton
                href="/store"
                text="Browse our Store"
                full
              />

              <AnchorButton
                href="https://donate.stripe.com/8wM5kHal16fC4so8ww"
                text="Make a Donation"
                full
              />
            </div>
          </div>
        </section>
      </>
    );
  }

  const imageUrl = product._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const imageAlt = product._embedded?.['wp:featuredmedia']?.[0]?.alt_text || product.acf.title;

  return (
    <>
      <Cart />
      <Takeover
        className="bg-neutral-400 rounded-2xl px-5 py-3 w-fit h-fit text-neutral-600 flex justify-between gap-3 items-center"
        active={added}
        setActive={setAdded}
      >
        <p>Added To Cart</p>
        <CheckIcon className="size-5 shrink-0" />
      </Takeover>

      <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 p-5 lg:px-35 pt-25">
        {/* Product Image */}
        <div className="w-full flex justify-center lg:justify-start">
          <div className="w-full max-w-2xl">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-neutral-200 flex items-center justify-center">
                  <span className="text-neutral-400">No image available</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-3 self-start">
          <Title>{product.acf.title}</Title>
          <Heading>${parseFloat(String(product.acf.price)).toFixed(2)}</Heading>
          <p className="text-gray-700 text-sm md:text-md">
            {product.acf.shortdescription}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-5 mt-5">
            <button
              onClick={handleAddToCart}
              aria-label="Add To Cart"
              className="clsAddToCart group inline-flex items-center rounded-2xl px-10 py-5 bg-emerald-500 hover:bg-emerald-600 transition-all duration-700 w-full font-semibold text-neutral-50"
            >
              <span className="flex w-full gap-3 items-center justify-between text-sm md:text-md">
                <span>Add To Cart</span>
                <PlusIcon className="w-[1em] h-[1em] transition-transform duration-500" />
              </span>
            </button>
            <AnchorButton
              href="https://donate.stripe.com/8wM5kHal16fC4so8ww"
              text="Make a Donation"
              full
            />
          </div>

          {/* Long Description */}
          <div className="mt-5 text-gray-800 leading-relaxed text-sm md:text-md">
            {product.acf.longdescription}
          </div>
        </div>

        {/* Impact Section */}
        <div className="lg:col-span-2">
          <div className="p-5 bg-primary-50 rounded-2xl border border-primary-100 shadow-sm space-y-3">
            <h3 className="text-lg font-semibold text-primary-900">
              Your Impact
            </h3>
            <p className="text-sm md:text-md text-gray-800 leading-relaxed">
              {product.acf.impact}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

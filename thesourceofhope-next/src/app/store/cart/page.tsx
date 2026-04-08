'use client';

import { useEffect, useState } from 'react';
import { ShoppingBagIcon } from '@heroicons/react/20/solid';
import Title from '@/components/ui/Title';
import { LinkButton } from '@/components/ui/Button';
import { useCartActions, SHIPPING_OPTIONS } from '@/context/StoreCartContext';
import { useHeaderContext } from '@/context/HeaderContext';
import CartItemsSection from '@/components/store/cart/CartItemsSection';
import CartShippingSection from '@/components/store/cart/CartShippingSection';
import CartSummarySection from '@/components/store/cart/CartSummarySection';

export default function CartPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const {
    cart: cartItems,
    processingFee: applyFee,
    shippingMethod,
    updateCartItem,
    removeFromCart,
    updateShippingMethod,
    updateProcessingFee,
    getCartCost,
    getShippingCost,
    getProcessingFeeCost,
    getCartTotal,
    getTaxCost,
  } = useCartActions();

  const headerContext = useHeaderContext();
  const setIsBlocking = headerContext?.setIsBlocking;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (setIsBlocking) {
      setIsBlocking(true);
      return () => setIsBlocking(false);
    }
  }, [setIsBlocking]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItem(id, { quantity: newQuantity });
  };

  const removeItem = (id: string) => {
    removeFromCart(id);
  };

  const updateSize = (id: string, newSize: string) => {
    updateCartItem(id, { size: newSize });
  };

  const subtotal = getCartCost();
  const shipping = getShippingCost();
  const tax = getTaxCost();
  const processingFee = getProcessingFeeCost();
  const total = getCartTotal();

  // Server renders empty state, client shows actual state after hydration
  // Only show full cart UI after client hydration completes
  const showEmpty = !isHydrated;

  return (
    <div className="min-h-screen bg-neutral-50 pt-25 px-5 md:px-10 lg:px-35">
      {showEmpty ? (
        <div className="w-full min-h-screen flex flex-col py-5 items-center justify-center text-center">
          <div className="max-w-xl">
            <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center shadow-sm">
              <ShoppingBagIcon className="w-10 h-10 text-accent-500" />
            </div>

            <Title>Your Cart is Empty</Title>
            <p className="text-gray-700 leading-relaxed mb-10">
              You don&apos;t have any items in your shopping cart yet. Visit our
              Storefront to view our full selection.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <LinkButton
                href="/store"
                text="Browse our Store"
                full
              />

              <LinkButton
                href="/donate"
                text="Make a Donation"
                full
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-1">
          <Title>Shopping Cart</Title>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-5 pb-5">
          <div className="lg:col-span-2">
            <CartItemsSection
              items={cartItems}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              updateSize={updateSize}
            />
          </div>
          <div className="lg:col-span-1">
            <CartShippingSection
              shippingMethod={shippingMethod}
              setShippingMethod={updateShippingMethod}
              setApplyFee={updateProcessingFee}
              applyFee={applyFee}
              processingFee={processingFee}
              shippingOptions={SHIPPING_OPTIONS}
            />
            <CartSummarySection
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              fee={processingFee}
            />
            <div className="mt-6">
              <div className="mb-6">
                <a
                  href="/store/checkout"
                  className="w-full !no-underline block px-5 py-4 rounded-xl font-bold text-white text-lg text-center bg-accent-500 hover:bg-accent-600 hover:shadow-lg transition-all duration-300"
                >
                  Proceed to Checkout
                </a>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}

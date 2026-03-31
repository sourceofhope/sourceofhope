'use client';

import { useEffect, useState } from 'react';
import Title from '@/components/ui/Title';
import { useCartActions } from '@/context/StoreCartContext';
import { useHeaderContext } from '@/context/HeaderContext';
import Cart from '@/components/store/Cart';
import ExpressCheckoutSection from '@/components/store/checkout/ExpressCheckoutSection';
import SelfCheckoutSection from '@/components/store/checkout/SelfCheckoutSection';
import CheckoutDetailsSection from '@/components/store/checkout/CheckoutDetailsSection';

export default function CheckoutPage() {
  const [isHydrated, setIsHydrated] = useState(false);

  const {
    cart,
    shippingMethod,
    getCartCost,
    getTaxCost,
    getProcessingFeeCost,
    getCartTotal,
    getCartItemCount,
    getShippingCost,
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

  const subtotal = getCartCost();
  const shipping = getShippingCost();
  const tax = getTaxCost();
  const processingFee = getProcessingFeeCost();
  const total = getCartTotal();

  // Server renders empty state, client shows actual state after hydration
  const showEmpty = !isHydrated || cart.length === 0;

  return (
    <>
      <Cart />
      {showEmpty ? (
        <section className="w-full min-h-screen flex flex-col py-5 items-center justify-center text-center px-5">
          <div className="text-center py-12">
            <Title>Your Cart is Empty</Title>
            <p className="text-neutral-600 mb-6">
              Add some items to your cart to checkout.
            </p>
            <a
              href="/store"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-2xl transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        </section>
      ) : (
        <div className="min-h-screen bg-neutral-50 pt-30 p-5 md:px-10 lg:px-15">
          {/* 3-Column Layout: Left (Express) | Center (Checkout Form) | Right (Order Summary) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10">
            {/* Left Column: Express Checkout - 25% */}
            <div className="lg:col-span-3 space-y-6">
              <ExpressCheckoutSection
                total={total}
                items={cart}
                processingFee={processingFee}
                shippingMethod={shippingMethod}
                shippingCost={shipping}
                taxAmount={tax}
              />
            </div>

            {/* Center Column: Main Checkout Form - 50% */}
            <div className="lg:col-span-6 space-y-6">
              <SelfCheckoutSection
                cart={cart}
                getCartItemCount={getCartItemCount}
                subtotal={subtotal}
                shippingMethod={shippingMethod}
                shippingCost={shipping}
                taxAmount={tax}
                processingFee={processingFee}
                total={total}
              />
            </div>

            {/* Right Column: Order Summary - 25% */}
            <div className="lg:col-span-3 space-y-6">
              <CheckoutDetailsSection
                cart={cart}
                getCartItemCount={getCartItemCount}
                subtotal={subtotal}
                shippingMethod={shippingMethod}
                shippingCost={shipping}
                taxAmount={tax}
                processingFee={processingFee}
                total={total}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

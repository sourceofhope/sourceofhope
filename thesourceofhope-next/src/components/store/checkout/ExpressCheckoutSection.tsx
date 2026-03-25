'use client';

import { useState, useEffect } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import Heading from '@/components/ui/Heading';
import { CartItem } from '@/context/StoreCartContext';
import {
  FaPaypal,
  FaStripeS,
  FaApplePay,
  FaGooglePay,
  FaLock,
} from 'react-icons/fa';

interface CheckoutProvider {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

interface ExpressCheckoutSectionProps {
  total: number;
  items: CartItem[];
  processingFee: number;
  shippingMethod: string;
  shippingCost: number;
  taxAmount: number;
}

// Icon component map for different payment methods
const iconMap = {
  stripe: <FaStripeS className="size-10 md:size-8" />,
  paypal: <FaPaypal className="size-10 md:size-8" />,
  googlepay: <FaGooglePay className="size-10 md:size-8" />,
  applepay: <FaApplePay className="size-10 md:size-8" />,
};

export default function ExpressCheckoutSection({
  total,
  items,
  processingFee,
  shippingMethod,
  shippingCost,
  taxAmount,
}: ExpressCheckoutSectionProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutProviders, setCheckoutProviders] = useState<CheckoutProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const response = await fetch('/api/checkout-providers');
        const data = await response.json();
        
        console.log('Checkout API Response:', data);
        
        if (data?.data && Array.isArray(data.data)) {
          console.log('Providers loaded:', data.data);
          setCheckoutProviders(data.data);
        } else {
          console.warn('No providers found or invalid format:', data);
          setCheckoutProviders([]);
        }
      } catch (err) {
        console.error('Failed to load checkout providers:', err);
        setError('Failed to load payment options');
        setCheckoutProviders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProviders();
  }, []);

  const handleExpressCheckout = async (method: string) => {
    setIsProcessing(true);
    setSelectedMethod(method);
    setError(null);

    const successUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/store/success`;
    const cancelUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/store/checkout`;

    if (method === 'Stripe') {
      await handleStripeCheckout(successUrl, cancelUrl);
    } else if (method === 'PayPal') {
      await handlePaypalCheckout(successUrl, cancelUrl);
    } else if (method === 'Google Pay') {
      // TODO: Google Pay express checkout logic
      setIsProcessing(false);
    } else if (method === 'Apple Pay') {
      // TODO: Apple Pay express checkout logic
      setIsProcessing(false);
    }
  };

  const handleStripeCheckout = async (successUrl: string, cancelUrl: string) => {
    try {
      const response = await fetch('/api/checkout/create-stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingMethod,
          shippingCost,
          taxAmount,
          processingFee,
          successUrl,
          cancelUrl,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setIsProcessing(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Failed to create checkout session');
        setIsProcessing(false);
      }
    } catch (err) {
      setError('Failed to process Stripe checkout');
      setIsProcessing(false);
    }
  };

  const handlePaypalCheckout = async (successUrl: string, cancelUrl: string) => {
    try {
      const response = await fetch('/api/checkout/create-paypal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingMethod,
          shippingCost,
          taxAmount,
          processingFee,
          successUrl,
          cancelUrl,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setIsProcessing(false);
        return;
      }

      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        setError('Failed to create PayPal order');
        setIsProcessing(false);
      }
    } catch (err) {
      setError('Failed to process PayPal checkout');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-neutral-50 md:sticky md:top-25 rounded-2xl shadow-md p-6">
      <Heading className="text-xl mb-4">Express</Heading>
      <p className="text-neutral-600 text-sm mb-6">
        Choose your preferred payment and checkout in seconds
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-neutral-500">Loading payment options...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {checkoutProviders
            .filter((method) => method.enabled)
            .map((method) => (
              <button
                key={method.id}
                onClick={() => handleExpressCheckout(method.name)}
                disabled={isProcessing || !method.enabled}
                className={`
                  flex flex-col items-center justify-center gap-1
                  ${method.enabled && !isProcessing ? 'text-accent-500 hover:scale-105' : 'text-neutral-500 bg-neutral-200'}
                  rounded-xl px-3 py-3
                  font-semibold text-xs
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transform active:scale-95
                  shadow-sm hover:shadow-md
                `}
              >
                {iconMap[method.icon as keyof typeof iconMap]}
              </button>
            ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-neutral-50 rounded-xl">
        <p className="text-sm text-neutral-600 md:text-center flex items-center justify-center gap-2">
          All transactions are secure
          <FaLock className="text-accent-500" />
        </p>
      </div>
    </div>
  );
}

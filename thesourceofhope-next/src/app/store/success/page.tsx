'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Heading from '@/components/ui/Heading';
import { useCartActions } from '@/context/StoreCartContext';
import { useHeaderContext } from '@/context/HeaderContext';

type OrderStatus = 'complete' | 'open' | 'processing' | 'error' | null;

interface StatusResponse {
  status: string;
  customer_email?: string;
  amount?: number;
  currency?: string;
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const hasProcessed = useRef(false);

  const fetchStripeSessionStatus = async (sessionId: string) => {
      const response = await fetch(
        `/api/checkout/retrieve-stripe-session-status?session_id=${sessionId}`,
      );
      return response.json();
  };

  const fetchPaypalOrderStatus = async (token: string) => {
    const response = await fetch(`/api/checkout/retrieve-paypal-order-status?token=${token}`);
    return response.json();
  };

  const fetchPaymentIntentStatus = async (paymentIntentId: string) => {
    const response = await fetch(
      `/api/checkout/retrieve-stripe-payment-intent-status?payment_intent=${paymentIntentId}`,
    );
    return response.json();
  };

  const { clearCart, updateProcessingFee, cart, getCartTotal, getTaxCost, getShippingCost } =
    useCartActions();
  const headerContext = useHeaderContext();

  useEffect(() => {
    if (headerContext?.setIsBlocking) {
      headerContext.setIsBlocking(true);
      return () => {
        if (headerContext?.setIsBlocking) {
          headerContext.setIsBlocking(false);
        }
      };
    }
  }, [headerContext]);

  useEffect(() => {
    // Prevent duplicate processing on re-renders
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    const paypalToken = urlParams.get('token');
    const paymentIntent = urlParams.get('payment_intent');
    const email = sessionStorage.getItem('checkoutEmail') || '';
    sessionStorage.removeItem('checkoutEmail');

    // If no payment identifier, not a valid success page
    if (!sessionId && !paypalToken && !paymentIntent) {
      setIsLoading(false);
      return;
    }

    // Handle Stripe Checkout Session success
    if (sessionId) {
      fetchStripeSessionStatus(sessionId)
        .then((response) => {
          if (response.error) {
            console.error('Error fetching Stripe session status:', response.error);
            setStatus('error');
            return;
          }
          const statusMap: { [key: string]: OrderStatus } = {
            complete: 'complete',
            expired: 'error',
            open: 'open',
          };
          setStatus((statusMap[response.status] as OrderStatus) || 'processing');
          setCustomerEmail(response.customer_email || email);
        })
        .catch((error) => {
          console.error('Error fetching Stripe session status:', error);
          setStatus('error');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    // Handle PayPal checkout success
    else if (paypalToken) {
      fetchPaypalOrderStatus(paypalToken)
        .then((response) => {
          if (response.error) {
            console.error('Error fetching PayPal order status:', response.error);
            setStatus('error');
            return;
          }
          setStatus(response.status as OrderStatus);
          setCustomerEmail(response.customer_email || email);
        })
        .catch((error) => {
          console.error('Error fetching PayPal order status:', error);
          setStatus('error');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    // Handle Stripe Payment Intent success
    else if (paymentIntent) {
      fetchPaymentIntentStatus(paymentIntent)
        .then((response) => {
          if (response.error) {
            console.error('Error fetching Payment Intent status:', response.error);
            setStatus('error');
            return;
          }
          const statusMap: { [key: string]: OrderStatus } = {
            succeeded: 'complete',
            processing: 'processing',
            requires_payment_method: 'error',
          };
          setStatus((statusMap[response.status] as OrderStatus) || 'processing');
          setCustomerEmail(response.customer_email || email);
        })
        .catch((error) => {
          console.error('Error fetching Payment Intent status:', error);
          setStatus('error');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (status === 'complete') {
      const urlParams = new URLSearchParams(window.location.search);
      const transactionId =
        urlParams.get('session_id') || urlParams.get('token') || urlParams.get('payment_intent') || 'unknown';

      // Google Analytics tracking
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({ ecommerce: null });
        (window as any).dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: transactionId,
            value: getCartTotal(),
            tax: getTaxCost(),
            shipping: getShippingCost(),
            currency: 'USD',
            items: cart.map((item) => ({
              item_id: String(item.id),
              item_name: item.title,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        });
      }

      clearCart();
      updateProcessingFee(false);
    }
  }, [status]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-700">Loading...</div>
      </div>
    );
  }

  if (status === 'open') {
    router.push('/store/checkout');
    return null;
  }

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-5 pt-25 py-10">
        <div className="max-w-2xl w-full bg-neutral-100 rounded-2xl shadow-lg p-5 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="animate-spin h-12 w-12 text-yellow-600" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <Heading className="mb-4">Payment Processing</Heading>
          <p className="text-neutral-700 mb-6 text-sm md:text-md">
            Your payment is being processed. You'll receive an email confirmation once it's complete.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-5 pt-25 py-10">
        <div className="max-w-2xl w-full bg-neutral-100 rounded-2xl shadow-lg p-5 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <Heading className="mb-4">Payment Error</Heading>
          <p className="text-neutral-700 mb-6 text-sm md:text-md">
            There was an issue processing your payment. Please try again or contact support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/store/checkout')}
              className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-neutral-300 hover:bg-neutral-400 text-neutral-900 font-bold rounded-xl transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-5 pt-25 py-10">
      <div className="max-w-2xl w-full bg-neutral-100 rounded-2xl shadow-lg p-5 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircleIcon className="w-12 h-12 text-green-600" />
        </div>

        <Heading className="mb-4">Order Successful!</Heading>

        <p className="text-neutral-700 mb-6 text-sm md:text-md text-left">
          Thank you for your purchase! We've received your order and will send you a confirmation email
          shortly.
        </p>

        <div className="bg-neutral-200 border-2 border-accent-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-neutral-900 mb-2 text-sm md:text-md">What's Next?</h3>
          <ul className="text-left text-neutral-700 space-y-1 text-sm md:text-md">
            <li className="flex items-start gap-2">
              <span className="text-accent-600 font-bold">•</span>
              <span>
                You'll receive an order confirmation email with your receipt
                {customerEmail && ` to: `}
                <strong>{customerEmail}</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-600 font-bold">•</span>
              <span>We'll send you shipping updates as your order is processed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-600 font-bold">•</span>
              <span>Your order will be shipped according to the method you selected</span>
            </li>
          </ul>
        </div>

        <p className="text-sm text-neutral-600 mb-8 text-left">
          Your support helps us provide food, education, and wellness programs to families in need. Thank
          you for making a difference!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push('/store')}
            className="px-6 py-3 bg-neutral-300 hover:bg-neutral-400 text-neutral-900 font-bold rounded-xl transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Heading from '@/components/ui/Heading';
import { CartItem } from '@/context/StoreCartContext';

interface SelfCheckoutSectionProps {
  cart: CartItem[];
  getCartItemCount: () => number;
  subtotal: number;
  shippingMethod: string;
  shippingCost: number;
  taxAmount: number;
  processingFee: number;
  total: number;
}

interface CheckoutAddress {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface PaymentFormProps {
  clientSecret: string;
  total: number;
  processingFee: number;
  onSuccess: (paymentIntent: any) => void;
}

function PaymentForm({ clientSecret, total, processingFee, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'An error occurred');
      setIsProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/store/success`,
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message || 'Payment failed');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-800 font-semibold">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-neutral-300 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
            Processing...
          </span>
        ) : (
          `Complete Purchase • $${total.toFixed(2)}`
        )}
      </button>

      <div className="text-center">
        <p className="text-xs text-neutral-500">
          Your payment information is encrypted and secure
        </p>
      </div>
    </form>
  );
}

export default function SelfCheckoutSection({
  cart,
  getCartItemCount,
  subtotal,
  shippingMethod,
  shippingCost,
  taxAmount,
  processingFee,
  total,
}: SelfCheckoutSectionProps) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
  });

  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pretotal = parseFloat((subtotal + shippingCost + taxAmount).toFixed(2));

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateZipCode = (zipCode: string) => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipCode.length === 0 || zipRegex.test(zipCode);
  };

  const isFormValid = () => {
    return (
      formData.email &&
      formData.firstName &&
      formData.lastName &&
      formData.address &&
      formData.city &&
      formData.state &&
      formData.zipCode &&
      validateEmail(formData.email) &&
      validateZipCode(formData.zipCode)
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const initializePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch Stripe publishable key
      const keyResponse = await fetch('/api/checkout/retrieve-stripe-publishable-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const keyData = await keyResponse.json();

      if (keyData.error || !keyData.publishableKey) {
        throw new Error('Failed to load payment system');
      }

      const stripe = await loadStripe(keyData.publishableKey);
      setStripePromise(stripe);

      // Create Payment Intent
      const response = await fetch('/api/checkout/create-stripe-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          shippingMethod,
          shippingCost,
          taxAmount,
          processingFee,
          subtotal,
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          billingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          totalAmount: total.toFixed(2),
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (data.error || !data.clientSecret) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      // Store email in sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('checkoutEmail', formData.email);
      }

      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize payment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditInformation = () => {
    setClientSecret(null);
    setStripePromise(null);
    setError(null);
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    // Redirect to success page
    if (typeof window !== 'undefined') {
      window.location.href = `/store/success?payment_intent=${paymentIntent.id}`;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <Heading className="text-xl mb-6">Self-Checkout</Heading>

      {!clientSecret ? (
        <>
          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="font-semibold text-neutral-900 mb-4">
              Contact Information
            </h3>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-accent-500 focus:outline-none mb-4"
              required
            />
          </div>

          {/* Shipping Address */}
          <div className="mb-6">
            <h3 className="font-semibold text-neutral-900 mb-4">
              Shipping Address
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-accent-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-accent-500 focus:outline-none"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Street Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-accent-500 focus:outline-none"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-accent-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="State / Province"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-accent-500 focus:outline-none"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="ZIP / Postal Code"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-accent-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-800 font-semibold">{error}</p>
            </div>
          )}

          <button
            onClick={initializePayment}
            disabled={!isFormValid() || isLoading}
            className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-neutral-300 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Continue to Payment'}
          </button>
        </>
      ) : (
        stripePromise &&
        clientSecret && (
          <>
            {/* Review Contact Information */}
            <div className="mb-6 bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-neutral-900">
                  Contact & Shipping Information
                </h3>
                <button
                  type="button"
                  onClick={handleEditInformation}
                  className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors"
                  aria-label="Edit contact information"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2 text-sm text-neutral-700">
                <div>
                  <span className="font-medium">Email:</span> {formData.email}
                </div>
                <div>
                  <span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}
                </div>
                <div>
                  <span className="font-medium">Address:</span> {formData.address}
                </div>
                <div>
                  <span className="font-medium">City, State ZIP:</span> {formData.city}, {formData.state} {formData.zipCode}
                </div>
                {processingFee > 0 && (
                  <div className="pt-2 border-t border-neutral-300">
                    <span className="text-accent-600 font-medium text-xs">
                      ✓ Supporting 100% of mission (+${processingFee.toFixed(2)} processing support)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Form */}
            <div className="mb-4">
              <h3 className="font-semibold text-neutral-900 mb-4">
                Payment Information
              </h3>

              {/* Order Summary */}
              <div className="bg-neutral-50 rounded-xl p-4 mb-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Total</span>
                    <span className="font-medium">${pretotal.toFixed(2)}</span>
                  </div>

                  {processingFee > 0 && (
                    <div className="flex justify-between text-accent-600">
                      <span>Processing Support (3%)</span>
                      <span className="font-medium">${processingFee.toFixed(2)}</span>
                    </div>
                  )}
                  {processingFee > 0 && (
                    <div className="border-t border-neutral-300 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm
                  clientSecret={clientSecret}
                  total={total}
                  processingFee={processingFee}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </div>
          </>
        )
      )}
    </div>
  );
}

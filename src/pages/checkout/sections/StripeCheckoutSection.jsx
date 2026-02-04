import { useCallback, useEffect, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { createStripeCheckoutSession, fetchStripePublishableKey } from '../../../lib/api/checkout';

export default function CheckoutForm({ items, shippingMethod, shippingCost, taxAmount }) {
    const fetchPublishableKey = async () => {
      const response = await fetchStripePublishableKey();
      if (response.error || !response.data) {
        throw new Error(
          response.error || "Failed to retrieve Stripe publishable key",
        );
      }
      return response.data.publishableKey;
    };

    const stripePromise = useMemo(
      async () =>
        loadStripe(
          await fetchPublishableKey(),
        ),
      [],
    );
    const returnUrl = `${window.location.origin}/store/success`;


  const fetchClientSecret = useCallback(async () => {
    // Create a Checkout Session
    const response = await createStripeCheckoutSession({
      items,
      shippingMethod,
      shippingCost,
      taxAmount,
      return_url: returnUrl,
    });
    console.log("StripeCheckoutSection response:", response);

    if (response.error || !response.data) {
      throw new Error(response.error || "Failed to create checkout session");
    }

    return response.data.clientSecret;
  }, [items, shippingMethod, shippingCost, taxAmount, returnUrl]);

  const options = { fetchClientSecret };

  return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={options}
        >
          <EmbeddedCheckout className="h-full" />
        </EmbeddedCheckoutProvider>
      </div>
  )
}
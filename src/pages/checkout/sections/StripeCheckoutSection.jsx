import { useCallback, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { createStripeCheckoutSession } from '../../../lib/api/checkout';

export default function CheckoutForm({ items, shippingMethod, shippingCost, taxAmount }) {
    const stripePromise = useMemo(() => 
      loadStripe("pk_test_51SosHLJnHm4FhZYkiJEHSpznMJVwY0Jf6WKPss4xu0rO4bCSJ7kaBF0tfaApghBMeJnitZPHW9cE4dmE9eFl7sfd00ayEJ1cTx"),
      []
    );
    const returnUrl = `${window.location.origin}/store/checkout`;


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
    return response.data.clientSecret;
  }, [items, shippingMethod, shippingCost, taxAmount, returnUrl]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
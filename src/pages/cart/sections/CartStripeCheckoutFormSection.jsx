import {useCallback} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

export default CartStripeCheckoutForm = (  items,
  shippingMethod,
  shipping,
  tax,) => {
    const stripePromise = loadStripe("pk_test_51SosHLJnHm4FhZYkiJEHSpznMJVwY0Jf6WKPss4xu0rO4bCSJ7kaBF0tfaApghBMeJnitZPHW9cE4dmE9eFl7sfd00ayEJ1cTx");
    const successUrl = `${window.location.origin}/store/checkout`;
    const cancelUrl = `${window.location.origin}/store/success`;

      const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/create-checkout-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
    }, []);

    const options = {fetchClientSecret};

    return (
      <div id="checkout">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    );
}



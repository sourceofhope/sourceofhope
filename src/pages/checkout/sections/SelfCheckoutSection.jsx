import { useState } from "react";
import Heading from "../../../components/ui/text/Heading";
import LocalInput from "../../../components/ui/LocalInput";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  createPaymentIntent,
  fetchStripePublishableKey,
} from "../../../lib/api/checkout";

function PaymentForm({ clientSecret, total, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setIsProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/store/success`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
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
        className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-neutral-300 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed">
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

export default function SelfCheckoutSection({ total, cart }) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
  });

  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load Stripe and create Payment Intent when form is complete
  const initializePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch Stripe publishable key
      const keyResponse = await fetchStripePublishableKey();
      if (keyResponse.error || !keyResponse.data) {
        throw new Error("Failed to load payment system");
      }

      const stripe = await loadStripe(keyResponse.data.publishableKey);
      setStripePromise(stripe);

      // Create Payment Intent
      const response = await createPaymentIntent({
        items: cart,
        shippingMethod: "standard",
        shippingCost: 0,
        taxAmount: total * 0.0825,
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
      });

      if (response.error || !response.data) {
        throw new Error(response.error || "Failed to initialize payment");
      }

      setClientSecret(response.data.clientSecret);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    // Redirect to success page
    window.location.href = `/store/success?payment_intent=${paymentIntent.id}`;
  };

  const validateEmail = (event) => {
    const email = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateZipCode = (event) => {
    const zipCode = event.target.value;
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
      validateEmail({ target: { value: formData.email } }) &&
      validateZipCode({ target: { value: formData.zipCode } })
    );
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
            <LocalInput
              title="Email"
              htmlFor="email"
              type="email"
              onChange={validateEmail}
              setFormData={setFormData}
              className="w-full"
            />
          </div>

          {/* Shipping Address */}
          <div className="mb-6">
            <h3 className="font-semibold text-neutral-900 mb-4">
              Shipping Address
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LocalInput
                  title="First Name"
                  htmlFor="firstName"
                  type="text"
                  onChange={() => true}
                  setFormData={setFormData}
                />
                <LocalInput
                  title="Last Name"
                  htmlFor="lastName"
                  type="text"
                  onChange={() => true}
                  setFormData={setFormData}
                />
              </div>
              <LocalInput
                title="Street Address"
                htmlFor="address"
                type="text"
                onChange={() => true}
                setFormData={setFormData}
                className="w-full"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LocalInput
                  title="City"
                  htmlFor="city"
                  type="text"
                  onChange={() => true}
                  setFormData={setFormData}
                />
                <LocalInput
                  title="State / Province"
                  htmlFor="state"
                  type="text"
                  onChange={() => true}
                  setFormData={setFormData}
                />
              </div>
              <LocalInput
                title="ZIP / Postal Code"
                htmlFor="zipCode"
                type="text"
                onChange={validateZipCode}
                setFormData={setFormData}
                className="w-full"
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
            className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-neutral-300 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed">
            {isLoading ? "Loading..." : "Continue to Payment"}
          </button>
        </>
      ) : (
        stripePromise &&
        clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              clientSecret={clientSecret}
              total={total}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        )
      )}
    </div>
  );
}

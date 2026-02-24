import { useState, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { FaLock, FaEdit } from "react-icons/fa";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  createMembershipPaymentIntent,
  fetchStripePublishableKey,
} from "../../../lib/api/checkout";

const MEMBERSHIP_AMOUNTS = {
  bronze: 50,
  silver: 199,
  gold: 500,
};

const MEMBERSHIP_NAMES = {
  bronze: "Hope Advocate [Bronze Pin]",
  silver: "Hope Professional [Silver Pin]",
  gold: "Hope Enterprise Partner [Gold Pin]",
};

function PaymentForm({ clientSecret, amount, membershipName, onSuccess }) {
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
        return_url: `${window.location.origin}/form/success`,
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
          `Complete Membership • $${amount.toFixed(2)}/month`
        )}
      </button>

      <div className="text-center">
        <p className="text-xs text-neutral-500">
          Your payment information is encrypted and secure
          <FaLock className="text-accent-500 inline-block ml-1" />
        </p>
        <p className="text-xs text-neutral-400 mt-2">
          Recurring monthly charge • You can cancel anytime
        </p>
      </div>
    </form>
  );
}

export default function MembershipCheckoutSection({ formData, onEdit, onSuccess }) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const initializingRef = useRef(false);

  const membershipAmount = MEMBERSHIP_AMOUNTS[formData.membership] || 0;
  const membershipName = MEMBERSHIP_NAMES[formData.membership] || "Membership";

  // Initialize payment when component mounts
  useEffect(() => {
    // Prevent duplicate calls in React StrictMode
    if (initializingRef.current) {
      return;
    }
    initializingRef.current = true;

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

        // Create Membership Subscription Setup Intent
        const response = await createMembershipPaymentIntent({
          membershipType: formData.membership,
          amount: membershipAmount,
          firstName: formData.fname,
          lastName: formData.lname,
          email: formData.email,
          phone: formData.phone,
        });

        if (response.error || !response.data) {
          throw new Error(response.error || "Failed to initialize payment");
        }

        setClientSecret(response.data.clientSecret);
      } catch (err) {
        setError(err.message);
        initializingRef.current = false; // Reset on error so user can retry
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  }, []);

  const handlePaymentSuccess = (setupIntent) => {
    onSuccess(setupIntent);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-accent-500" viewBox="0 0 24 24">
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
          <p className="text-neutral-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-800 font-semibold">{error}</p>
        </div>
        <button
          onClick={onEdit}
          className="w-full bg-neutral-500 hover:bg-neutral-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Review Information */}
      <div className="mb-6 bg-neutral-50 rounded-xl p-4 border border-neutral-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-neutral-900">Your Information</h3>
          <button
            type="button"
            onClick={onEdit}
            className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors"
            aria-label="Edit information">
            <FaEdit className="size-5" />
          </button>
        </div>
        <div className="space-y-2 text-sm text-neutral-700">
          <div>
            <span className="font-medium">Name:</span> {formData.fname} {formData.lname}
          </div>
          <div>
            <span className="font-medium">Email:</span> {formData.email}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {formData.phone}
          </div>
          <div className="pt-2 border-t border-neutral-300">
            <span className="font-medium">Membership:</span> {membershipName}
          </div>
        </div>
      </div>

      {/* Membership Summary */}
      <div className="mb-6 bg-accent-50 rounded-xl p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-neutral-700 font-medium">{membershipName}</span>
            <span className="text-xl font-bold text-accent-700">
              ${membershipAmount.toFixed(2)}<span className="text-sm font-normal">/month</span>
            </span>
          </div>
          <p className="text-xs text-neutral-600">
            Recurring monthly billing • You can cancel anytime
          </p>
        </div>
      </div>

      {/* Payment Form */}
      <div className="mb-4">
        <h3 className="font-semibold text-neutral-900 mb-4">Payment Information</h3>
        {stripePromise && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              clientSecret={clientSecret}
              amount={membershipAmount}
              membershipName={membershipName}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}

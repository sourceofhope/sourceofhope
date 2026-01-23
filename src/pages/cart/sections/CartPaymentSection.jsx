import { use, useState } from "react";
// import {
//   CreditCardIcon,
//   BanknotesIcon,
// } from "@heroicons/react/24/outline";
import { FaPaypal, FaStripeS } from "react-icons/fa";
import {
  createStripeCheckoutSession,
  createPaypalCheckoutSession,
} from "../../../lib/api/checkout";

export default function CartPaymentSection({
  items,
  shippingMethod,
  paymentMethod,
  setPaymentMethod,
  total,
  subtotal,
  shipping,
  tax,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  // Read selected payment provider from URL params
  const [selectedProvider, setSelectedProvider] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("selected") || "stripe";
  });

  const checkoutProviders = [
    {
      id: "stripe",
      name: "Stripe Checkout",
      icon: FaStripeS,
      description: "Credit/Debit Cards",
    },
    {
      id: "paypal",
      name: "PayPal Checkout",
      icon: FaPaypal,
      description: "PayPal Account",
    },
  ];

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const successUrl = `${window.location.origin}/store/cart/success`;
      const cancelUrl = `${window.location.origin}/store/cart?selected=${selectedProvider}`;
      if (selectedProvider === "stripe") {
        const response = await createStripeCheckoutSession({
          items,
          shippingMethod,
          shippingCost: shipping,
          taxAmount: tax,
          successUrl,
          cancelUrl,
        });

        if (response.error) {
          setError(response.error);
          setIsProcessing(false);
          return;
        }

        // Redirect to Stripe Checkout
        if (response.data?.url) {
          window.location.href = response.data.url;
        } else {
          setError("Failed to create checkout session");
          setIsProcessing(false);
        }
      } else if (selectedProvider === "paypal") {
        // For PayPal, we'll redirect directly to PayPal's hosted checkout
        const response = await createPaypalCheckoutSession({
          items,
          shippingMethod,
          shippingCost: shipping,
          taxAmount: tax,
          successUrl,
          cancelUrl,
        });

        if (response.error) {
          setError(response.error);
          setIsProcessing(false);
          return;
        }

        // Redirect to PayPal Checkout
        if (response.data?.approvalUrl) {
          window.location.href = response.data.approvalUrl;
        } else {
          setError("Failed to create PayPal checkout");
          setIsProcessing(false);
        }
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
      {/* Payment Provider Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-neutral-800">
          Select Payment Method
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checkoutProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              className={`p-4 border-2 rounded-xl transition-all duration-300 text-left ${
                selectedProvider === provider.id
                  ? "border-accent-500 bg-accent-50 shadow-md"
                  : "border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
              }`}>
              <div className="flex items-start gap-3">
                <provider.icon
                  className={`w-6 h-6 flex-shrink-0 ${
                    selectedProvider === provider.id
                      ? "text-accent-600"
                      : "text-neutral-400"
                  }`}
                />
                <div className="flex-1">
                  <div className="font-semibold text-neutral-900">
                    {provider.name}
                  </div>
                  <div className="text-sm text-neutral-600 mt-1">
                    {provider.description}
                  </div>
                </div>
                {selectedProvider === provider.id && (
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-semibold">{error}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-semibold">{error}</p>
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={isProcessing}
        className={`w-full px-5 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 ${
          isProcessing
            ? "bg-neutral-400 cursor-not-allowed"
            : "bg-accent-500 hover:bg-accent-600 hover:shadow-lg"
        }`}>
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
            Processing
          </span>
        ) : (
          "Proceed to Checkout"
        )}
      </button>

      <p className="text-xs text-neutral-500 text-center mt-4">
        Your payment information is secure and encrypted
      </p>
    </div>
  );
}

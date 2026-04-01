import { useState } from "react";
import { Link } from "react-router-dom";
import Heading from "../../../components/ui/text/Heading";
import { FaPaypal, FaStripeS, FaApplePay, FaGooglePay } from "react-icons/fa";
import { createStripeCheckout } from "../../../lib/api/checkout.js";
import { createPaypalCheckout } from "../../../lib/api/checkout.js";

export default function CartPaymentSection({
  items,
  shippingMethod,
  shipping,
  tax,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const checkoutProviders = [
    {
      id: "stripe",
      name: "Stripe",
      icon: FaStripeS,
      description: "Linked Stripe Account",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: FaPaypal,
      description: "Linked PayPal Account",
    },
    {
      id: "googlepay",
      name: "Google",
      icon: FaGooglePay,
      description: "Linked Google Pay Account",
    },
    {
      id: "applepay",
      name: "Apple",
      icon: FaApplePay,
      description: "Linked Apple Pay Account",
    },
  ];

  const handleStripeCheckout = async (successUrl, cancelUrl) => {
    const response = await createStripeCheckout({
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

    if (response.data?.url) {
      window.location.href = response.data.url;
    } else {
      setError("Failed to create checkout session");
      setIsProcessing(false);
    }
  };

  const handlePaypalCheckout = async (successUrl, cancelUrl) => {
    const response = await createPaypalCheckout({
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

    if (response.data?.approvalUrl) {
      window.location.href = response.data.approvalUrl;
    } else {
      setError("Failed to create PayPal checkout");
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 mt-6">
      {/* Payment Provider Selection */}
      <div className="mb-6">
        <Heading className="flex flex-col gap-1 mb-5">Express checkout</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checkoutProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={async () => {
                setIsProcessing(true);
                setError(null);
                const successUrl = `${window.location.origin}/store/cart/success`;
                const cancelUrl = `${window.location.origin}/store/cart?shipping=${shippingMethod}`;

                if (provider.id === "stripe") {
                  await handleStripeCheckout(successUrl, cancelUrl);
                } else if (provider.id === "paypal") {
                  await handlePaypalCheckout(successUrl, cancelUrl);
                }
              }}
              disabled={isProcessing}
              className={`p-4 border-2 rounded-xl transition-all duration-300 text-left ${
                isProcessing
                  ? "border-neutral-300 bg-neutral-100 cursor-not-allowed opacity-50"
                  : "border-neutral-200 hover:border-accent-500 hover:bg-accent-50 hover:shadow-md"
              }`}>
              <div className="flex items-start gap-3">
                <provider.icon className="w-6 h-6 flex-shrink-0 text-accent-600" />
                <div className="flex-1">
                  <div className="font-semibold text-accent-600">
                    {provider.name}
                  </div>
                </div>
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
      <h3 className="text-lg font-semibold mb-4 text-neutral-800">Or</h3>
      <Link
        to="/store/checkout"
        className="w-full block px-5 py-4 rounded-xl font-bold text-white text-lg text-center bg-accent-500 hover:bg-accent-600 hover:shadow-lg transition-all duration-300">
        Proceed to Checkout
      </Link>
    </div>
  );
}

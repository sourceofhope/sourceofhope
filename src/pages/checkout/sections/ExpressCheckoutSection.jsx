import { useState } from "react";
import Heading from "../../../components/ui/text/Heading";
import { FaPaypal, FaStripeS, FaApplePay, FaGooglePay } from "react-icons/fa";
import {
  createStripeCheckout,
  createPaypalCheckout,
} from "../../../lib/api/checkout.js";

export default function ExpressCheckoutSection({
  items,
  shippingMethod,
  shippingCost,
  taxAmount,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [error, setError] = useState(null);

  const checkoutProviders = [
    {
      id: "stripe",
      name: "Stripe",
      icon: <FaStripeS className="size-10 md:size-8" />,
      description: "Linked Stripe Account",
      enabled: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <FaPaypal className="size-10 md:size-8" />,
      description: "Linked PayPal Account",
      enabled: true,
    },
    {
      id: "googlepay",
      name: "",
      icon: <FaGooglePay className="size-10 md:size-8" />,
      description: "Linked Google Pay Account",
      enabled: false,
    },
    {
      id: "applepay",
      name: "",
      icon: <FaApplePay className="size-10 md:size-8" />,
      description: "Linked Apple Pay Account",
      enabled: false,
    },
  ];

  const handleExpressCheckout = async (method) => {
    setIsProcessing(true);
    setSelectedMethod(method);
    setError(null);

    const successUrl = `${window.location.origin}/store/success`;
    const cancelUrl = `${window.location.origin}/store/checkout`;

    if (method === "Stripe") {
      await handleStripeCheckout(successUrl, cancelUrl);
    } else if (method === "PayPal") {
      await handlePaypalCheckout(successUrl, cancelUrl);
    } else if (method === "Google Pay") {
      // TODO: Google Pay express checkout logic here
    } else if (method === "Apple Pay") {
      // TODO: Apple Pay express checkout logic here
    }

    // Simulate payment processing
    setTimeout(() => {
      alert(`${method} checkout initiated! Total: $${total.toFixed(2)}`);
      setIsProcessing(false);
      setSelectedMethod(null);
    }, 1500);
  };

  const handleStripeCheckout = async (successUrl, cancelUrl) => {
    const response = await createStripeCheckout({
      items,
      shippingMethod,
      shippingCost: shippingCost,
      taxAmount: taxAmount,
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
      shippingCost: shippingCost,
      taxAmount: taxAmount,
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
    <div className="bg-neutral-50 md:sticky md:top-25 rounded-2xl shadow-md p-6">
      <Heading className="text-xl mb-4">Express</Heading>
      <p className="text-neutral-600 text-sm mb-6">
        Choose your preferred payment and checkout in seconds
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {checkoutProviders.map((method) => (
          <button
            key={method.id}
            onClick={() => handleExpressCheckout(method.name)}
            disabled={isProcessing}
            className={`
              flex flex-col items-center justify-center gap-1
              ${method.bgColor} ${method.hoverColor}
              ${method.enabled ? "text-accent-500" : "text-neutral-500 bg-neutral-200 hover:scale-none hover:shadow-sm"}
              rounded-xl px-3 py-3
              font-semibold text-xs
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              transform hover:scale-105 active:scale-95
              shadow-sm hover:shadow-md
            `}>
            {method.icon}
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
        <p className="text-sm text-neutral-600 text-center">
          All transactions are securely stored
        </p>
      </div>
    </div>
  );
}

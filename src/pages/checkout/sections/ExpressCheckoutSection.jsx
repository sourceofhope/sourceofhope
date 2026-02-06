import { useState } from "react";
import Heading from "../../../components/ui/text/Heading";
import {FaPaypal, FaStripeS, FaApplePay, FaGooglePay} from "react-icons/fa";
import { createStripeCheckout, createPaypalCheckout } from "../../../lib/api/checkout.js";

export default function ExpressCheckoutSection({  items,
  shippingMethod,
  shippingCost,
  taxAmount}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
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
        name: "",
        icon: FaGooglePay,
        description: "Linked Google Pay Account",
      },
      {
        id: "applepay",
        name: "",
        icon: FaApplePay,
        description: "Linked Apple Pay Account",
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
      // Implement Google Pay express checkout logic here
    } else if (method === "Apple Pay") {
      // Implement Apple Pay express checkout logic here
    }

    // Simulate payment processing
    setTimeout(() => {
      alert(`${method} checkout initiated! Total: $${total.toFixed(2)}`);
      setIsProcessing(false);
      setSelectedMethod(null);
    }, 1500);
  };
  //     id: "paypal",
  //     name: "PayPal",
  //     icon: "🅿️",
  //     bgColor: "bg-[#0070ba]",
  //     hoverColor: "hover:bg-[#005ea6]",
  //   },
  //   {
  //     id: "stripe",
  //     name: "Stripe",
  //     icon: "💳",
  //     bgColor: "bg-[#635bff]",
  //     hoverColor: "hover:bg-[#5145e5]",
  //   },
  //   {
  //     id: "googlepay",
  //     name: "Google Pay",
  //     icon: "🅖",
  //     bgColor: "bg-white border-2 border-neutral-300 text-neutral-900",
  //     hoverColor: "hover:bg-neutral-50",
  //   },
  //   {
  //     id: "applepay",
  //     name: "Apple Pay",
  //     icon: "🍎",
  //     bgColor: "bg-black",
  //     hoverColor: "hover:bg-neutral-800",
  //   },
  // ];

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
    <div className="bg-white rounded-2xl shadow-md p-6">
      <Heading className="text-xl mb-4">Express</Heading>
      <p className="text-neutral-600 text-sm mb-6">
        Choose your preferred payment method for quick checkout
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
              ${method.id === "googlepay" ? "text-neutral-900" : "text-white"}
              rounded-xl px-3 py-3
              font-semibold text-xs
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              transform hover:scale-105 active:scale-95
              shadow-sm hover:shadow-md
            `}
          >
            <div className="flex items-start gap-3">
              <method.icon className="w-6 h-6 flex-shrink-0 text-accent-600" />
              <div className="flex-1">
                <div className="font-semibold text-accent-600">
                  {method.name}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
        <p className="text-xs text-neutral-600 text-center">
          🔒 All transactions are secure and encrypted. Your payment information
          is never stored on our servers.
        </p>
      </div>
    </div>
  );
}

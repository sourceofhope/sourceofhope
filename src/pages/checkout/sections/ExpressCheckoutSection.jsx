import { useState } from "react";
import Heading from "../../../components/ui/text/Heading";

export default function ExpressCheckoutSection({ total }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleExpressCheckout = async (method) => {
    setIsProcessing(true);
    setSelectedMethod(method);

    // Simulate payment processing
    setTimeout(() => {
      alert(`${method} checkout initiated! Total: $${total.toFixed(2)}`);
      setIsProcessing(false);
      setSelectedMethod(null);
    }, 1500);
  };

  const paymentMethods = [
    {
      id: "paypal",
      name: "PayPal",
      icon: "🅿️",
      bgColor: "bg-[#0070ba]",
      hoverColor: "hover:bg-[#005ea6]",
    },
    {
      id: "stripe",
      name: "Stripe",
      icon: "💳",
      bgColor: "bg-[#635bff]",
      hoverColor: "hover:bg-[#5145e5]",
    },
    {
      id: "googlepay",
      name: "Google Pay",
      icon: "🅖",
      bgColor: "bg-white border-2 border-neutral-300 text-neutral-900",
      hoverColor: "hover:bg-neutral-50",
    },
    {
      id: "applepay",
      name: "Apple Pay",
      icon: "🍎",
      bgColor: "bg-black",
      hoverColor: "hover:bg-neutral-800",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <Heading className="text-xl mb-4">Express Checkout</Heading>
      <p className="text-neutral-600 text-sm mb-6">
        Choose your preferred payment method for quick checkout
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {paymentMethods.map((method) => (
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
            `}>
            <span className="text-2xl">{method.icon}</span>
            <span className="text-center leading-tight">
              {isProcessing && selectedMethod === method.name
                ? "Processing..."
                : method.name}
            </span>
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

import { useState } from "react";
import {
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

export default function CartPaymentSection({
  items,
  shippingMethod,
  paymentMethod,
  setPaymentMethod,
  total,
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: "credit-card",
      name: "Credit/Debit Card",
      icon: CreditCardIcon,
      description: "Visa, Mastercard, Amex",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: BanknotesIcon,
      description: "Pay with your PayPal account",
    },
    {
      id: "apple-pay",
      name: "Apple Pay",
      icon: DevicePhoneMobileIcon,
      description: "Fast and secure checkout",
    },
  ];

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert("Processing payment... This is a demo.");
      console.log(`Items in checkout:`, items);
      console.log(`Shipping method: ${shippingMethod}`);
      console.log(`Payment method: ${paymentMethod}`);
      console.log(`Total amount: $${total.toFixed(2)}`);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
      {/* <h3 className="font-urbanist font-bold text-neutral-900 text-xl mb-4">
        Payment Method
      </h3> */}

      {/* <div className="space-y-3 mb-6">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <label
              key={method.id}
              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === method.id
                  ? 'border-accent-500 bg-accent-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}>
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 accent-accent-500"
              />
              <Icon className="w-6 h-6 text-neutral-700" />
              <div className="flex-1">
                <p className="font-semibold text-neutral-900">{method.name}</p>
                <p className="text-xs text-neutral-600">{method.description}</p>
              </div>
            </label>
          );
        })}
      </div> */}

      {/* Payment Form based on selected method */}
      {/* {paymentMethod === 'credit-card' && (
        <div className="space-y-4 mb-6 p-4 bg-neutral-50 rounded-lg">
          <div>
            <label className="text-sm font-semibold text-neutral-700 block mb-1">
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-accent-500 focus:outline-none"
              maxLength="19"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-neutral-700 block mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-accent-500 focus:outline-none"
                maxLength="5"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-neutral-700 block mb-1">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-accent-500 focus:outline-none"
                maxLength="4"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-neutral-700 block mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-accent-500 focus:outline-none"
            />
          </div>
        </div>
      )} */}
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

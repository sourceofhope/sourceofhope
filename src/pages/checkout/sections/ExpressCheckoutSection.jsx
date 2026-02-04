import { useState } from "react";
import Heading from "../../../components/ui/text/Heading";
import {FaPaypal, FaStripeS, FaApplePay, FaGooglePay} from "react-icons/fa";
import { createStripeCheckout, createPaypalCheckout } from "../../../lib/api/checkout.js";

export default function ExpressCheckoutSection({  items,
  shippingMethod,
  shipping,
  tax}) {
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


    // <div className="bg-white p-6 mt-6">
    //   {/* Payment Provider Selection */}
    //   <div className="mb-6">
    //     <Heading className="flex flex-col gap-1 mb-5">Express checkout</Heading>
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //       {checkoutProviders.map((provider) => (
    //         <button
    //           key={provider.id}
    //           onClick={async () => {
    //             setIsProcessing(true);
    //             setError(null);
    //             const successUrl = `${window.location.origin}/store/cart/success`;
    //             const cancelUrl = `${window.location.origin}/store/cart?shipping=${shippingMethod}`;

    //             if (provider.id === "stripe") {
    //               await handleStripeCheckout(successUrl, cancelUrl);
    //             } else if (provider.id === "paypal") {
    //               await handlePaypalCheckout(successUrl, cancelUrl);
    //             }
    //           }}
    //           disabled={isProcessing}
    //           className={`p-4 border-2 rounded-xl transition-all duration-300 text-left ${
    //             isProcessing
    //               ? "border-neutral-300 bg-neutral-100 cursor-not-allowed opacity-50"
    //               : "border-neutral-200 hover:border-accent-500 hover:bg-accent-50 hover:shadow-md"
    //           }`}
    //         >
    //           <div className="flex items-start gap-3">
    //             <provider.icon className="w-6 h-6 flex-shrink-0 text-accent-600" />
    //             <div className="flex-1">
    //               <div className="font-semibold text-accent-600">
    //                 {provider.name}
    //               </div>
    //             </div>
    //           </div>
    //         </button>
    //       ))}
    //     </div>
    //   </div>
    //   {error && (
    //     <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
    //       <p className="text-sm text-red-800 font-semibold">{error}</p>
    //     </div>
    //   )}
    //   <h3 className="text-lg font-semibold mb-4 text-neutral-800">Or</h3>
    //   <Link
    //     to="/store/checkout"
    //     className="w-full block px-5 py-4 rounded-xl font-bold text-white text-lg text-center bg-accent-500 hover:bg-accent-600 hover:shadow-lg transition-all duration-300"
    //   >
    //     Proceed to Checkout
    //   </Link>
    // </div>
  );
}

import { useState, useEffect } from "react";
import Heading from "../../../components/ui/text/Heading";
import {
  FaPaypal,
  FaStripeS,
  FaApplePay,
  FaGooglePay,
  FaLock,
} from "react-icons/fa";
import {
  createStripeCheckout,
  createPaypalCheckout,
  fetchCheckoutProviders,
} from "../../../lib/api/checkout.js";

const iconMap = {
  stripe: <FaStripeS className="size-10 md:size-8" />,
  paypal: <FaPaypal className="size-10 md:size-8" />,
  googlepay: <FaGooglePay className="size-10 md:size-8" />,
  applepay: <FaApplePay className="size-10 md:size-8" />,
};

export default function ExpressCheckoutSection({
  items,
  shippingMethod,
  shippingCost,
  taxAmount,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [error, setError] = useState(null);
  const [checkoutProviders, setCheckoutProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [coverProcessingFee, setCoverProcessingFee] = useState(false);

  // Calculate processing fee (3%)
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const processingFee = coverProcessingFee
    ? (subtotal + taxAmount + shippingCost) * 0.03
    : 0;

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const response = await fetchCheckoutProviders();
        console.log("Fetched checkout providers:", response.data);
        if (response.data?.data && Array.isArray(response.data.data)) {
          setCheckoutProviders(response.data.data);
        } else {
          console.error("Invalid provider data format:", response.data);
          setCheckoutProviders([]);
        }
      } catch (err) {
        console.error("Failed to load checkout providers:", err);
        setError("Failed to load payment options");
        setCheckoutProviders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProviders();
  }, []);

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
  };

  const handleStripeCheckout = async (successUrl, cancelUrl) => {
    const response = await createStripeCheckout({
      items,
      shippingMethod,
      shippingCost: shippingCost,
      taxAmount: taxAmount,
      processingFee: processingFee,
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
      processingFee: processingFee,
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

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-neutral-500">Loading payment options...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {checkoutProviders
            .filter((method) => method.enabled)
            .map((method) => (
              <button
                key={method.id}
                onClick={() => handleExpressCheckout(method.name)}
                disabled={isProcessing || !method.enabled}
                className={`
                flex flex-col items-center justify-center gap-1
                ${method.enabled ? "text-accent-500 hover:scale-105" : "text-neutral-500 bg-neutral-200"}
                rounded-xl px-3 py-3
                font-semibold text-xs
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                transform active:scale-95
                shadow-sm hover:shadow-md
              `}>
                {iconMap[method.icon]}
              </button>
            ))}
        </div>
      )}

      {/* Processing Fee Support */}
      <div className="mt-5 h-35 bg-accent-50 border border-accent-200 rounded-xl p-4">
        <h4 className="font-semibold text-neutral-900 mb-2 text-sm">
          Support the mission
        </h4>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={coverProcessingFee}
            onChange={(e) => setCoverProcessingFee(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-accent-600 border-neutral-300 rounded focus:ring-accent-500 cursor-pointer"
          />
          <span className="hidden md:block text-xs text-neutral-800 group-hover:text-accent-700 transition-colors">
            Yes, I would like to cover the processing fee
            {
              <span
                className={`${coverProcessingFee ? "opacity-100" : "opacity-0"} block text-xs text-accent-600 font-medium mt-1`}>
                +${processingFee.toFixed(2)} processing support
              </span>
            }
          </span>
        </label>
      </div>

      <div className="mt-8 p-4 bg-neutral-50 rounded-xl">
        <p className="text-sm text-neutral-600 md:text-center flex items-center justify-center gap-2">
          All transactions are secure
          <FaLock className="text-accent-500" />
        </p>
      </div>
    </div>
  );
}

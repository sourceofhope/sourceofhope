import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { CANONICAL, CANONICAL_URL } from "../../routes";
import Title from "../../components/ui/text/Title";
import { LinkButton } from "../../components/ui/Button";
import { useCartActions } from "../../context/StoreCartContext";
import { useSetHeaderBlocking } from "../../components/structure/Header";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import {
  fetchStripeSessionStatus,
  fetchPaypalOrderStatus,
  fetchPaymentIntentStatus,
} from "../../lib/api/checkout";

export default function CartSuccessPage() {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const hasProcessed = useRef(false);

  const { clearCart } = useCartActions();
  const setBlocking = useSetHeaderBlocking();

  useEffect(() => {
    // Prevent duplicate processing on re-renders
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    const paypalToken = urlParams.get('token');
    const paymentIntent = urlParams.get('payment_intent');
    const email = sessionStorage.getItem('checkoutEmail') || ''; // Retrieve email from session storage
    sessionStorage.removeItem('checkoutEmail'); // Clean up after use

    // If no payment identifier, not a valid success page
    if (!sessionId && !paypalToken && !paymentIntent) {
      setIsLoading(false);
      return;
    }

    // Handle Stripe Checkout Session success
    if (sessionId) {
      fetchStripeSessionStatus(sessionId)
        .then((response) => {
          if (response.error) {
            console.error(
              "Error fetching Stripe session status:",
              response.error,
            );
            setStatus("error");
            return;
          }
          setStatus(response.data.status);
          setCustomerEmail(response.data.customer_email || email);
        })
        .catch((error) => {
          console.error("Error fetching Stripe session status:", error);
          setStatus("error");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    // Handle PayPal checkout success
    else if (paypalToken) {
      fetchPaypalOrderStatus(paypalToken)
        .then((response) => {
          if (response.error) {
            console.error(
              "Error fetching PayPal order status:",
              response.error,
            );
            setStatus("error");
            return;
          }
          setStatus(response.data.status);
          setCustomerEmail(response.data.customer_email || email);
        })
        .catch((error) => {
          console.error("Error fetching PayPal order status:", error);
          setStatus("error");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    // Handle Stripe Payment Intent success
    else if (paymentIntent) {
      fetchPaymentIntentStatus(paymentIntent)
        .then((response) => {
          if (response.error) {
            console.error(
              "Error fetching Payment Intent status:",
              response.error,
            );
            setStatus("error");
            return;
          }
          
          console.log('Payment Intent status response:', response.data);
          // Map Payment Intent status to checkout status
          const piStatus = response.data.status;

          if (piStatus === 'succeeded') {
            setStatus('complete');
            setCustomerEmail(email);
          } else if (piStatus === 'processing') {
            setStatus('processing');
            setCustomerEmail(email);
          } else if (piStatus === 'requires_payment_method') {
            setStatus('open');
          } else {
            setStatus("error");
          }
          
        })
        .catch((error) => {
          console.error("Error fetching Payment Intent status:", error);
          setStatus("error");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    setBlocking(true);
    return () => setBlocking(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === "complete") {
      clearCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-700">Loading...</div>
      </div>
    );
  }

  if (status === "open") {
    return <Navigate to="/store/checkout" />;
  }

  if (status === "processing") {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-5 pt-25 py-10">
        <div className="max-w-2xl w-full bg-neutral-100 rounded-2xl shadow-lg p-5 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg
              className="animate-spin h-12 w-12 text-yellow-600"
              viewBox="0 0 24 24">
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
          </div>
          <Title className="mb-4">Payment Processing</Title>
          <p className="text-neutral-700 mb-6 text-sm md:text-md">
            Your payment is being processed. You'll receive an email
            confirmation once it's complete.
          </p>
          <LinkButton to={CANONICAL.home.absolute} text="Back to Home" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-5 pt-25 py-10">
        <div className="max-w-2xl w-full bg-neutral-100 rounded-2xl shadow-lg p-5 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <Title className="mb-4">Payment Error</Title>
          <p className="text-neutral-700 mb-6 text-sm md:text-md">
            There was an issue processing your payment. Please try again or
            contact support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkButton
              to={CANONICAL.storefront.checkout.absolute}
              text="Try Again"
            />
            <LinkButton
              to={CANONICAL.home.absolute}
              text="Back to Home"
              variant="secondary"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order Successful | The Source of Hope</title>
        <meta name="description" content="Thank you for your purchase!" />
        <link rel="canonical" href={`${CANONICAL_URL.storefront.cart}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${CANONICAL_URL.storefront.cart}`} />
        <meta
          property="og:title"
          content="Order Successful | The Source of Hope"
        />
        <meta
          property="og:description"
          content="Thank you for your purchase! Your support helps us provide food, education, and wellness programs to families in need."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`${CANONICAL_URL.storefront.cart}`} />
        <meta
          name="twitter:title"
          content="Order Successful | The Source of Hope"
        />
        <meta
          name="twitter:description"
          content="Thank you for your purchase! Your support helps us provide food, education, and wellness programs to families in need."
        />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-5 pt-25 py-10">
        <div className="max-w-2xl w-full bg-neutral-100 rounded-2xl shadow-lg p-5 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>

          <Title className="mb-4">Order Successful!</Title>

          <p className="text-neutral-700 mb-6 text-sm md:text-md text-left">
            Thank you for your purchase! We've received your order and will send
            you a confirmation email shortly.
          </p>

          <div className="bg-neutral-200 border-2 border-accent-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-neutral-900 mb-2 text-sm md:text-md">
              What's Next?
            </h3>
            <ul className="text-left text-neutral-700 space-y-1 text-sm md:text-md">
              <li className="flex items-start gap-2">
                <span className="text-accent-600 font-bold">•</span>
                <span>
                  You'll receive an order confirmation email with your receipt
                  {customerEmail && ` to your email: `}
                  <strong>{customerEmail}</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-600 font-bold">•</span>
                <span>
                  We'll send you shipping updates as your order is processed
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-600 font-bold">•</span>
                <span>
                  Your order will be shipped according to the method you
                  selected
                </span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-neutral-600 mb-8 text-left">
            Your support helps us provide food, education, and wellness programs
            to families in need. Thank you for making a difference!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkButton to={CANONICAL.home.absolute} text="Back to Home" />
            <LinkButton
              to={CANONICAL.storefront.absolute}
              text="Continue Shopping"
              variant="secondary"
            />
          </div>
        </div>
      </div>
    </>
  );
}

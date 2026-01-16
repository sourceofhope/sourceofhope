import { useEffect} from "react";
import { Helmet } from "react-helmet";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { CANONICAL, CANONICAL_URL } from "../../routes";
import Title from "../../components/ui/text/Title";
import { LinkButton } from "../../components/ui/Button";
import { useCartActions } from "../../context/StoreCartContext";
import { useSetHeaderBlocking } from "../../components/structure/Header";

export default function CartSuccessPage() {
  const { clearCart } = useCartActions();

  const setBlocking = useSetHeaderBlocking();
  
    useEffect(() => {
      setBlocking(true);
      return () => setBlocking(false);
    }, [setBlocking]);

  useEffect(() => {
    // Clear the cart after successful purchase
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>Order Successful | The Source of Hope</title>
        <meta name="description" content="Thank you for your purchase!" />
        <link rel="canonical" href={`${CANONICAL_URL.storefront.cart}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${CANONICAL_URL.storefront.cart}`} />
        <meta property="og:title" content="Order Successful | The Source of Hope" />
        <meta
          property="og:description"
          content="Thank you for your purchase! Your support helps us provide food, education, and wellness programs to families in need."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`${CANONICAL_URL.storefront.cart}`} />
        <meta name="twitter:title" content="Order Successful | The Source of Hope" />
        <meta
          name="twitter:description"
          content="Thank you for your purchase! Your support helps us provide food, education, and wellness programs to families in need."
        />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-5 py-20">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>

          <Title className="mb-4">Order Successful!</Title>

          <p className="text-lg text-neutral-700 mb-6">
            Thank you for your purchase! We've received your order and will
            send you a confirmation email shortly.
          </p>

          <div className="bg-accent-50 border-2 border-accent-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-neutral-900 mb-2">What's Next?</h3>
            <ul className="text-left text-neutral-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent-600 font-bold">•</span>
                <span>
                  You'll receive an order confirmation email with your receipt
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
                  Your order will be shipped according to the method you selected
                </span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-neutral-600 mb-8">
            Your support helps us provide food, education, and wellness
            programs to families in need. Thank you for making a difference!
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

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FaEdit, FaLock } from "react-icons/fa";
import { CheckCircleIcon, ShieldCheckIcon } from "@heroicons/react/20/solid";
import {
  createMembershipPaymentIntent,
  fetchStripePublishableKey,
} from "../../../lib/api/checkout";
import Heading from "../../../components/ui/text/Heading";
import Title from "../../../components/ui/text/Title";
import LocalInput from "../../../components/ui/LocalInput";
import { Link } from "react-router-dom";

// ─── Stripe inner payment form ───────────────────────────────────────────────

function MembershipPaymentForm({ amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setIsProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/members`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-800 font-semibold">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-neutral-300 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed">
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
            Processing...
          </span>
        ) : (
          `Start Monthly Support • $${Number(amount).toFixed(0)}/mo`
        )}
      </button>

      <div className="text-center">
        <p className="text-xs text-neutral-500">
          Your payment information is encrypted and secure
          <FaLock className="text-accent-500 inline-block ml-1" />
        </p>
      </div>
    </form>
  );
}

// ─── Success view ─────────────────────────────────────────────────────────────

function SuccessView({ selection, email }) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8 text-center grid gap-5">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div className="grid gap-2">
        <Title>Thank you for your support!</Title>
        <p className="text-neutral-700">
          Your monthly support of{" "}
          <strong>${Number(selection.amount).toFixed(0)}/mo</strong> as{" "}
          <strong>{selection.planName}</strong> has been set up.
        </p>
        <p className="text-sm text-neutral-600">
          A confirmation will be sent to <strong>{email}</strong>.
        </p>
      </div>
      <p className="text-xs text-neutral-500">
        You can manage or cancel your support at any time by contacting us.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Link
          to="/"
          className="px-6 py-3 rounded-xl font-bold text-white bg-accent-500 hover:bg-accent-600 transition-colors text-sm">
          Back to Home
        </Link>
        <a
          href="/members"
          className="px-6 py-3 rounded-xl font-bold text-neutral-900 bg-neutral-200 hover:bg-neutral-300 transition-colors text-sm">
          Explore Memberships
        </a>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * @param {Object}   selection            - The chosen plan/amount
 * @param {string}   selection.type       - "individual" | "company"
 * @param {number}   selection.amount     - Monthly amount in USD
 * @param {string}   selection.planName   - Display name for the plan
 * @param {string}   [selection.planId]   - Plan identifier (company tier id or "individual")
 * @param {string}   [selection.note]     - Short description of the plan
 * @param {string[]} [selection.makesPossible] - Bullet points shown in the sidebar
 * @param {Function} onBack               - Callback to return to plan selection
 */
export default function MembersCheckoutSection({ selection, onBack }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (e) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);

  const isFormValid = () =>
    formData.email &&
    formData.firstName &&
    formData.lastName &&
    validateEmail({ target: { value: formData.email } });

  const initializePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const keyResponse = await fetchStripePublishableKey();
      if (keyResponse.error || !keyResponse.data) {
        throw new Error("Failed to load payment system");
      }

      const stripe = await loadStripe(keyResponse.data.publishableKey);
      setStripePromise(stripe);

      const response = await createMembershipPaymentIntent({
        membershipType: selection.planId || "individual",
        amount: selection.amount,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      });

      if (response.error || !response.data) {
        throw new Error(response.error || "Failed to initialize payment");
      }

      sessionStorage.setItem("membershipEmail", formData.email);
      setClientSecret(response.data.clientSecret);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditContact = () => {
    setClientSecret(null);
    setStripePromise(null);
    setError(null);
  };

  const handlePaymentSuccess = (paymentIntent) => {
    sessionStorage.setItem("membershipPaymentIntent", paymentIntent.id);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return <SuccessView selection={selection} email={formData.email} />;
  }

  return (
    <div className="w-full grid lg:grid-cols-[1fr_360px] gap-6 items-start">
      {/* ── Main card ── */}
      <div className="bg-white rounded-2xl shadow-md p-6 grid gap-6">
        <Heading className="text-xl">Complete your monthly support</Heading>

        {/* Selected plan summary */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 grid gap-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              Selected plan
            </p>
            <button
              type="button"
              onClick={onBack}
              className="text-accent-600 hover:text-accent-700 text-xs font-medium transition-colors flex items-center gap-1">
              <FaEdit className="size-5" />
            </button>
          </div>
          <p className="font-bold text-neutral-900">{selection.planName}</p>
          <div className="flex items-end gap-1">
            <p className="text-2xl font-extrabold">
              ${Number(selection.amount).toFixed(0)}
            </p>
            <span className="text-sm font-semibold text-neutral-600 mb-0.5">
              /mo
            </span>
          </div>
          {selection.note && (
            <p className="text-xs text-neutral-600">{selection.note}</p>
          )}
        </div>

        {/* ── Step 1: Contact form ── */}
        {!clientSecret ? (
          <>
            <div className="grid gap-4">
              <h3 className="font-semibold text-neutral-900">
                Your information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LocalInput
                  title="First Name"
                  htmlFor="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={() => true}
                  setFormData={setFormData}
                />
                <LocalInput
                  title="Last Name"
                  htmlFor="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={() => true}
                  setFormData={setFormData}
                />
              </div>
              <LocalInput
                title="Email"
                htmlFor="email"
                type="email"
                value={formData.email}
                onChange={validateEmail}
                setFormData={setFormData}
              />
              <LocalInput
                title="Phone (optional)"
                htmlFor="phone"
                type="tel"
                value={formData.phone}
                onChange={() => true}
                setFormData={setFormData}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-800 font-semibold">{error}</p>
              </div>
            )}

            <button
              onClick={initializePayment}
              disabled={!isFormValid() || isLoading}
              className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-neutral-300 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed">
              {isLoading ? "Loading..." : "Continue to Payment"}
            </button>
          </>
        ) : (
          // ── Step 2: Review + Stripe payment ──
          stripePromise &&
          clientSecret && (
            <>
              {/* Contact review */}
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-neutral-900">
                    Your information
                  </h3>
                  <button
                    type="button"
                    onClick={handleEditContact}
                    className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors"
                    aria-label="Edit contact information">
                    <FaEdit className="size-5" />
                  </button>
                </div>
                <div className="space-y-1 text-sm text-neutral-700">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {formData.firstName} {formData.lastName}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {formData.email}
                  </div>
                  {formData.phone && (
                    <div>
                      <span className="font-medium">Phone:</span>{" "}
                      {formData.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment form */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4">
                  Payment Information
                </h3>
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-800 font-semibold">
                      {error}
                    </p>
                  </div>
                )}
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <MembershipPaymentForm
                    amount={selection.amount}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              </div>
            </>
          )
        )}
      </div>

      {/* ── Sticky sidebar summary ── */}
      <aside className="hidden lg:block sticky top-24">
        <div className="bg-neutral-100 rounded-2xl shadow-sm p-5 grid gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="grid gap-1">
              <Heading>{selection.planName}</Heading>
              <p className="text-sm text-neutral-600">
                {selection.type === "company"
                  ? "Company Partnership"
                  : "Individual Support"}{" "}
                • Monthly
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-neutral-200 text-neutral-900 shrink-0">
              <ShieldCheckIcon className="w-4 h-4" />
              Monthly
            </span>
          </div>

          <div className="border-t border-neutral-200 pt-3 grid gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Monthly amount</span>
              <span className="font-bold">
                ${Number(selection.amount).toFixed(0)}/mo
              </span>
            </div>
            <div className="flex justify-between text-xs text-neutral-500">
              <span>Billing cycle</span>
              <span>Monthly • Cancel anytime</span>
            </div>
          </div>

          {selection.makesPossible && selection.makesPossible.length > 0 && (
            <div className="border-t border-neutral-200 pt-3 grid gap-2">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Your support helps with
              </p>
              <ul className="grid gap-1">
                {selection.makesPossible.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-neutral-700">
                    <CheckCircleIcon className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-neutral-500">
            This is a recurring monthly gift supporting a 501(c)(3) nonprofit
            mission. You can manage or cancel anytime.
          </p>
        </div>

        {/* Mobile sticky bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-10 bg-neutral-100 shadow-lg p-4 flex items-center justify-between gap-3">
          <div className="grid">
            <p className="text-xs text-neutral-600">Supporting</p>
            <p className="font-extrabold leading-tight">{selection.planName}</p>
            <p className="text-sm text-neutral-600">
              ${Number(selection.amount).toFixed(0)}/mo
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-3 rounded-xl font-bold text-neutral-900 bg-neutral-200 hover:bg-neutral-300 text-sm">
            Change
          </button>
        </div>
      </aside>
    </div>
  );
}

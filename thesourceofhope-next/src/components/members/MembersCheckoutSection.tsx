'use client';

import Heading from "@/components/ui/Heading";
import Title from "@/components/ui/Title";
import Bold from "@/components/ui/Bold";
import Link from "next/link";
import { useState } from "react";
import {
  loadStripe,
  Stripe,
  StripeElements,
} from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CheckCircleIcon, ShieldCheckIcon } from "@heroicons/react/20/solid";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function MembershipPaymentForm({ amount, onSuccess }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || "An error occurred");
      setIsProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } =
      await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/members`,
        },
        redirect: "if_required",
      });

    if (confirmError) {
      setError(confirmError.message || "An error occurred");
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
        </p>
      </div>
    </form>
  );
}

function SuccessView({ selection, email }: any) {
  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8 text-center grid gap-5">
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
          href="/"
          className="px-6 py-3 rounded-xl font-bold text-white bg-accent-500 hover:bg-accent-600 transition-colors text-sm">
          Back to Home
        </Link>
        <Link
          href="/members"
          className="px-6 py-3 rounded-xl font-bold text-neutral-900 bg-neutral-200 hover:bg-neutral-300 transition-colors text-sm">
          Explore Memberships
        </Link>
      </div>
    </div>
  );
}

export default function MembersCheckoutSection({ selection, onBack }: any) {
  const isCompany = selection.type === "company";
  const [formData, setFormData] = useState(() =>
    isCompany
      ? {
          companyName: "",
          contactName: "",
          companyInfo: "",
          email: "",
          phone: "",
        }
      : { firstName: "", lastName: "", email: "", phone: "" }
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showContactForm, setShowContactForm] = useState(true);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = () => {
    const emailOk = !!(formData.email && validateEmail(formData.email));
    if (isCompany) {
      return emailOk && !!formData.companyName && !!formData.contactName;
    }
    return emailOk && !!formData.firstName && !!formData.lastName;
  };

  const initializePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch Stripe publishable key
      const keyResponse = await fetch(
        "/api/checkout/retrieve-stripe-publishable-key",
        {
          method: "POST",
        }
      );

      if (!keyResponse.ok) {
        throw new Error("Failed to retrieve Stripe key");
      }

      const keyData = await keyResponse.json();
      if (keyData.error || !keyData.publishableKey) {
        throw new Error(
          keyData.error || "Failed to initialize payment processor"
        );
      }

      // Create payment intent
      const intentResponse = await fetch(
        "/api/checkout/create-membership-payment-intent",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: selection.amount,
            type: selection.type,
            formData,
          }),
        }
      );

      if (!intentResponse.ok) {
        throw new Error("Failed to create payment intent");
      }

      const intentData = await intentResponse.json();
      if (intentData.error || !intentData.clientSecret) {
        throw new Error(
          intentData.error || "Failed to create payment intent"
        );
      }

      setClientSecret(intentData.clientSecret);
      setShowContactForm(false);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditContact = () => {
    setShowContactForm(true);
    setClientSecret(null);
    setError(null);
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    setIsSuccess(true);
  };

  if (isSuccess) {
    return <SuccessView selection={selection} email={formData.email} />;
  }

  return (
    <div className="grid gap-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <Title>Complete your membership</Title>
        </div>
        <button
          onClick={onBack}
          className="text-neutral-600 hover:text-neutral-900 underline">
          Back
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Main Form */}
        <div className="grid gap-6">
          {/* Plan Summary */}
          <div className="bg-neutral-100 rounded-2xl p-5 grid gap-3">
            <Heading className="text-lg">Membership details</Heading>
            <div className="grid gap-2">
              <p className="text-sm text-neutral-600">Plan</p>
              <p className="font-semibold text-lg">{selection.planName}</p>
            </div>
            <div className="grid gap-2">
              <p className="text-sm text-neutral-600">Monthly amount</p>
              <p className="text-3xl font-extrabold">
                ${selection.amount}
                <span className="text-base font-semibold text-neutral-600">
                  /mo
                </span>
              </p>
            </div>
          </div>

          {/* Contact Form or Payment Form */}
          {showContactForm ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                initializePayment();
              }}
              className="bg-neutral-50 rounded-2xl p-5 grid gap-4">
              <Heading className="text-lg">
                {isCompany ? "Company Information" : "Personal Information"}
              </Heading>

              {isCompany ? (
                <>
                  <div className="grid gap-2">
                    <label
                      htmlFor="companyName"
                      className="text-sm font-semibold text-neutral-900">
                      Company Name
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                      required
                      className="bg-white rounded-xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="Your Company"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="companyInfo"
                      className="text-sm font-semibold text-neutral-900">
                      Company Info (optional)
                    </label>
                    <textarea
                      id="companyInfo"
                      value={formData.companyInfo}
                      onChange={(e) =>
                        setFormData({ ...formData, companyInfo: e.target.value })
                      }
                      rows={3}
                      className="bg-white rounded-xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="Tell us about your company..."
                    />
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="contactName"
                      className="text-sm font-semibold text-neutral-900">
                      Contact Name
                    </label>
                    <input
                      id="contactName"
                      type="text"
                      value={formData.contactName}
                      onChange={(e) =>
                        setFormData({ ...formData, contactName: e.target.value })
                      }
                      required
                      className="bg-white rounded-xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="Your Name"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-neutral-900">
                      Contact Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="bg-white rounded-xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-semibold text-neutral-900">
                      Contact Phone (optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="bg-white rounded-xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-semibold text-neutral-900">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        required
                        className="bg-white rounded-xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-500"
                        placeholder="John"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="lastName"
                        className="text-sm font-semibold text-neutral-900">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        required
                        className="bg-white rounded-xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-neutral-900">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="bg-white rounded-xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-semibold text-neutral-900">
                      Phone (optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="bg-white rounded-xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-800 font-semibold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-neutral-300 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed">
                {isLoading ? (
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
                    Initializing...
                  </span>
                ) : (
                  "Continue to Payment"
                )}
              </button>
            </form>
          ) : clientSecret ? (
            <div className="bg-neutral-50 rounded-2xl p-5 grid gap-4">
              <div className="flex items-center justify-between">
                <Heading className="text-lg">Payment Method</Heading>
                <button
                  type="button"
                  onClick={handleEditContact}
                  className="text-sm text-neutral-600 hover:text-neutral-900 underline">
                  Edit
                </button>
              </div>

              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "light",
                  },
                }}>
                <MembershipPaymentForm
                  amount={selection.amount}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </div>
          ) : null}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:grid gap-4">
          <div className="bg-neutral-100 rounded-2xl p-5 grid gap-4 sticky top-24">
            <div className="grid gap-2">
              <Heading className="text-lg">{selection.planName}</Heading>
              <p className="text-sm text-neutral-600">{selection.note}</p>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <p className="text-xs font-semibold text-neutral-600 mb-3">
                MONTHLY IMPACT
              </p>
              <ul className="space-y-2">
                {selection.makesPossible.map((item: string) => (
                  <li key={item} className="flex gap-2 text-sm">
                    <CheckCircleIcon className="w-5 h-5 text-accent-600 flex-shrink-0" />
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <p className="text-xs font-semibold text-accent-600">
                ✓ RECURRING MONTHLY
              </p>
              <p className="text-xs text-neutral-600 mt-2">
                Cancel anytime from your receipt email
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

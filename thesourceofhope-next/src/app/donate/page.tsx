'use client';

import { useState, useEffect, useRef } from 'react';
import { HeartIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Link from 'next/link';
import Title from '@/components/ui/Title';
import Heading from '@/components/ui/Heading';
import { useHeaderContext } from '@/context/HeaderContext';

const STANDARD_PROCESSING_RATE = 0.03;

const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

// ─── Payment form (rendered inside <Elements>) ──────────────────────────────

interface PaymentFormProps {
  total: number;
  onSuccess: (paymentIntentId: string) => void;
}

function PaymentForm({ total, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'An error occurred');
      setIsProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donate?success=true`,
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message || 'Payment failed');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
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
        className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-neutral-300 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
      >
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
          `Donate $${total.toFixed(2)}`
        )}
      </button>

      <p className="text-xs text-neutral-500 text-center">
        Your payment information is encrypted and secure. The Source of Hope is
        a 501(c)(3) nonprofit organization. Your donation may be tax-deductible
        to the extent permitted by law.
      </p>
    </form>
  );
}

// ─── Main donate page ────────────────────────────────────────────────────────

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState('');
  const [coverFee, setCoverFee] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dedication, setDedication] = useState('');

  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);

  const headerContext = useHeaderContext();
  const setIsBlocking = headerContext?.setIsBlocking;

  useEffect(() => {
    if (setIsBlocking) {
      setIsBlocking(true);
      return () => setIsBlocking(false);
    }
  }, [setIsBlocking]);

  // Resolved donation amount
  const donationAmount =
    selectedAmount !== null
      ? selectedAmount
      : parseFloat(customAmount) || 0;

  // Track the amount/fee that were used when the PaymentIntent was created.
  // If either changes after initialization, invalidate the intent so a fresh
  // one is created with the correct amount — preventing UI/Stripe mismatches.
  const intentAmountRef = useRef<number | null>(null);
  const intentCoverFeeRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!clientSecret) return;
    if (
      intentAmountRef.current !== donationAmount ||
      intentCoverFeeRef.current !== coverFee
    ) {
      setClientSecret(null);
      setStripePromise(null);
      setLoadError(null);
      intentAmountRef.current = null;
      intentCoverFeeRef.current = null;
    }
  }, [donationAmount, coverFee, clientSecret]);

  const processingFee = parseFloat(
    (donationAmount * STANDARD_PROCESSING_RATE).toFixed(2),
  );
  const total = parseFloat(
    (donationAmount + (coverFee ? processingFee : 0)).toFixed(2),
  );

  const isFormValid =
    donationAmount >= 0.5 &&
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isCoolingDown = Date.now() < cooldownUntil;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleInitializePayment = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      // Load publishable key
      const keyResponse = await fetch(
        '/api/checkout/retrieve-stripe-publishable-key',
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      );
      const keyData = await keyResponse.json();

      if (keyData.error || !keyData.publishableKey) {
        throw new Error('Failed to load payment system');
      }

      setStripePromise(loadStripe(keyData.publishableKey));

      // Create donation payment intent
      const response = await fetch(
        '/api/checkout/create-donation-payment-intent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: donationAmount,
            processingFee,
            coverFee,
            email,
            firstName,
            lastName,
            dedication: dedication.trim() || undefined,
          }),
        },
      );

      const data = await response.json();

      if (data.error || !data.clientSecret) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      intentAmountRef.current = donationAmount;
      intentCoverFeeRef.current = coverFee;
      setClientSecret(data.clientSecret);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to initialize payment');
    } finally {
      setIsLoading(false);
      // 15-second cooldown after every attempt to slow rapid re-clicking.
      setCooldownUntil(Date.now() + 15_000);
    }
  };

  const handleEditDonation = () => {
    setClientSecret(null);
    setStripePromise(null);
    setLoadError(null);
    intentAmountRef.current = null;
    intentCoverFeeRef.current = null;
  };

  const handlePaymentSuccess = () => {
    setIsSuccess(true);
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-25 px-5 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl ring-1 ring-neutral-200 shadow-[0_8px_60px_-12px_rgba(0,0,0,0.18)] p-10 text-center">
          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-accent-500 flex items-center justify-center shadow-lg">
            <CheckCircleIcon className="w-12 h-12 text-white" />
          </div>
          <Heading className="mb-1">Donation Received</Heading>
          <Title className="mb-4">Thank You!</Title>
          <p className="text-neutral-700 leading-relaxed mb-2">
            Your donation of{' '}
            <strong className="text-accent-600">${donationAmount.toFixed(2)}</strong> has been received.
          </p>
          <p className="text-sm text-neutral-500 mb-8">
            A receipt will be sent to <strong>{email}</strong>. Your generosity
            makes a real difference in our community.
          </p>
          <div className="w-full h-px bg-neutral-100 mb-8" />
          <Link
            href="/"
            className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 no-underline!"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ── Main form ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50 pt-25 px-5 md:px-10 lg:px-20 pb-16">
      <div className="max-w-[70%] mx-auto">
        {/* Page header */}
        <div className="flex flex-col gap-1 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
              <HeartIcon className="w-5 h-5 text-accent-500" />
            </div>
            <Title>Make a Donation</Title>
          </div>
          <p className="text-neutral-600 leading-relaxed mt-2">
            Your gift supports meals, wellness care, education, and community
            outreach programs right here in our community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: amount + donor info */}
          <div className="lg:col-span-3 space-y-6">

            {/* Amount selection */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <Heading className="mb-4">Choose an Amount</Heading>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      selectedAmount === amount
                        ? 'bg-accent-500 text-white shadow-sm'
                        : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-semibold">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="w-full pl-7 pr-4 py-3 border-2 border-neutral-300 rounded-xl focus:border-accent-500 focus:outline-none text-neutral-900"
                />
              </div>
            </div>

            {/* Donor information */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <Heading className="mb-4">Your Information</Heading>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="grid gap-1">
                  <label htmlFor="donate-first-name" className="text-sm font-semibold text-neutral-800">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="donate-first-name"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-accent-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <label htmlFor="donate-last-name" className="text-sm font-semibold text-neutral-800">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="donate-last-name"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-accent-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-1 mb-4">
                <label htmlFor="donate-email" className="text-sm font-semibold text-neutral-800">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="donate-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-accent-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid gap-1">
                <label htmlFor="donate-dedication" className="text-sm font-semibold text-neutral-800">
                  Dedication / In Memory of{' '}
                  <span className="text-neutral-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="donate-dedication"
                  rows={2}
                  maxLength={500}
                  placeholder="e.g. In loving memory of Jane Doe"
                  value={dedication}
                  onChange={(e) => setDedication(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg focus:border-accent-500 focus:outline-none resize-none text-neutral-900 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Right: summary + cover-fee + payment */}
          <div className="lg:col-span-2 space-y-5">

            {/* Cover fee */}
            <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 pt-5">
              <h4 className="font-semibold text-neutral-900 mb-2 text-sm">
                Support the mission
              </h4>
              <p className="text-xs text-neutral-700 mb-3">
                Online payments include a{' '}
                <strong>3% processing cost</strong> charged by the credit card
                companies. You may choose to add this small amount so your full
                donation goes directly to serving the community.
              </p>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={coverFee}
                  onChange={(e) => setCoverFee(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-accent-600 border-neutral-300 rounded focus:ring-accent-500 cursor-pointer"
                />
                <span className="text-xs md:text-sm text-neutral-800 group-hover:text-accent-700 transition-colors">
                  Yes, I would like to cover the processing fee
                  <span
                    className={`${coverFee ? 'opacity-100' : 'opacity-0'} block text-xs text-accent-600 font-medium mt-1`}
                  >
                    +${processingFee.toFixed(2)} processing support
                  </span>
                </span>
              </label>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl shadow-md p-5">
              <Heading className="mb-4">Summary</Heading>
              <div className="space-y-2 text-sm text-neutral-700">
                <div className="flex justify-between">
                  <span>Donation</span>
                  <span>${donationAmount > 0 ? donationAmount.toFixed(2) : '—'}</span>
                </div>
                {coverFee && (
                  <div className="flex justify-between text-accent-600">
                    <span>Processing fee</span>
                    <span>+${processingFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-neutral-200 pt-2 mt-2 flex justify-between font-bold text-neutral-900">
                  <span>Total</span>
                  <span>${total > 0 ? total.toFixed(2) : '—'}</span>
                </div>
              </div>
            </div>

            {/* Payment section */}
            <div className="bg-white rounded-2xl shadow-md p-5">
              {clientSecret && stripePromise ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <Heading>Payment</Heading>
                    <button
                      onClick={handleEditDonation}
                      className="text-xs text-accent-600 hover:text-accent-700 underline"
                    >
                      Edit
                    </button>
                  </div>
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance: { theme: 'stripe' } }}
                  >
                    <PaymentForm
                      total={total}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                </>
              ) : (
                <>
                  <Heading className="mb-4">Payment</Heading>

                  {loadError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                      <p className="text-sm text-red-800 font-semibold">
                        {loadError}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleInitializePayment}
                    disabled={!isFormValid || isLoading || isCoolingDown}
                    className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-neutral-300 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
                  >
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
                        Loading...
                      </span>
                    ) : isCoolingDown ? (
                      'Please wait a moment...'
                    ) : donationAmount > 0 ? (
                      `Continue to Payment • $${total.toFixed(2)}`
                    ) : (
                      'Enter an amount to continue'
                    )}
                  </button>

                  {!isFormValid && donationAmount > 0 && !isCoolingDown && (
                    <p className="text-xs text-neutral-500 text-center mt-2">
                      Please fill in your name and email to continue.
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Legal */}
            <p className="text-xs text-neutral-500 text-center leading-relaxed px-1">
              The Source of Hope is a 501(c)(3) nonprofit organization. Donations
              are tax-deductible to the extent permitted by applicable law. No
              goods or services were provided in exchange for this contribution.
              By submitting payment you authorize The Source of Hope to charge
              the stated amount to your payment method. All transactions are
              processed securely through Stripe. You will receive an email
              receipt upon successful payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

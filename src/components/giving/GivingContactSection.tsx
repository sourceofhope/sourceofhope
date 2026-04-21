'use client';

import { useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import PageSection from '@/components/ui/PageSection';
import Title from '@/components/ui/Title';
import Heading from '@/components/ui/Heading';

const STATUS = {
  IDLE: 'IDLE',
  SUBMITTING: 'SUBMITTING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

const GIVING_OPTIONS = [
  'Bequest in a will or trust',
  'Beneficiary designation (retirement/insurance)',
  'Charitable gift annuity',
  'Other / Not sure yet',
];

export default function GivingContactSection() {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    givingType: '',
    message: '',
  });

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) =>
    phone.length === 0 || phone.length >= 10;

  const isFormValid =
    formData.fname &&
    formData.lname &&
    formData.email &&
    validateEmail(formData.email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setStatus(STATUS.SUBMITTING);

    const lines = [
      `Planned Giving Interest Form`,
      `Name: ${formData.fname} ${formData.lname}`,
      `Email: ${formData.email}`,
      formData.phone ? `Phone: ${formData.phone}` : null,
      formData.givingType ? `Giving Type: ${formData.givingType}` : null,
      formData.message ? `Message: ${formData.message}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.fname} ${formData.lname}`.trim(),
          email: formData.email,
          message: lines,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setStatus(STATUS.SUCCESS);
    } catch (error) {
      console.error('Email submission error:', error);
      setStatus(STATUS.ERROR);
    }
  };

  if (status === STATUS.SUCCESS) {
    return (
      <PageSection className="grid gap-5">
        <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center gap-4 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
          <Title>Thank You!</Title>
          <p className="text-neutral-600 text-sm md:text-md max-w-md">
            We&apos;ve received your inquiry about planned giving. A member of our
            team will reach out to you soon to continue the conversation.
          </p>
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection className="grid gap-8">
      <div className="grid gap-1">
        <Heading>GET IN TOUCH</Heading>
        <Title>Express Your Interest</Title>
        <p className="text-sm md:text-md text-neutral-600 max-w-xl mt-1">
          Ready to explore how a planned gift can make a lasting impact? Fill
          out the form below and we&apos;ll guide you through the next steps.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8 grid gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="grid gap-1">
            <label
              htmlFor="fname"
              className="text-sm md:text-md px-1 font-semibold select-none text-neutral-950">
              First Name
            </label>
            <input
              id="fname"
              type="text"
              required
              value={formData.fname}
              onChange={(e) =>
                setFormData({ ...formData, fname: e.target.value })
              }
              className="bg-neutral-50 rounded-2xl shadow-sm w-full h-[4ch] px-2 text-sm md:text-md text-neutral-800"
              placeholder="John"
            />
          </div>
          <div className="grid gap-1">
            <label
              htmlFor="lname"
              className="text-sm md:text-md px-1 font-semibold select-none text-neutral-950">
              Last Name
            </label>
            <input
              id="lname"
              type="text"
              required
              value={formData.lname}
              onChange={(e) =>
                setFormData({ ...formData, lname: e.target.value })
              }
              className="bg-neutral-50 rounded-2xl shadow-sm w-full h-[4ch] px-2 text-sm md:text-md text-neutral-800"
              placeholder="Doe"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="grid gap-1">
          <label
            htmlFor="email"
            className="text-sm md:text-md px-1 font-semibold select-none text-neutral-950">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-neutral-50 rounded-2xl shadow-sm w-full h-[4ch] px-2 text-sm md:text-md text-neutral-800"
            placeholder="you@example.com"
          />
        </div>

        {/* Phone Field */}
        <div className="grid gap-1">
          <label
            htmlFor="phone"
            className="text-sm md:text-md px-1 font-semibold select-none text-neutral-950">
            Phone Number (optional)
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="bg-neutral-50 rounded-2xl shadow-sm w-full h-[4ch] px-2 text-sm md:text-md text-neutral-800"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Giving Type */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="givingType"
            className="text-sm md:text-md px-1 font-semibold select-none text-neutral-950">
            I&apos;m interested in (optional)
          </label>
          <select
            id="givingType"
            value={formData.givingType}
            onChange={(e) =>
              setFormData({ ...formData, givingType: e.target.value })
            }
            className="bg-neutral-50 rounded-2xl shadow-sm w-full h-[4ch] px-2 text-sm md:text-md text-neutral-800">
            <option value="">Select a giving type…</option>
            {GIVING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Message Field */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="message"
            className="text-sm md:text-md px-1 font-semibold select-none text-neutral-950">
            Message (optional)
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={4}
            placeholder="Share any questions or thoughts…"
            className="bg-neutral-50 rounded-2xl shadow-sm w-full px-3 py-2 text-sm md:text-md text-neutral-800 resize-none"
          />
        </div>

        {/* Error State */}
        {status === STATUS.ERROR && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
            <span>
              Something went wrong. Please try again or contact us directly.
            </span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || status === STATUS.SUBMITTING}
          className="inline-flex items-center justify-center gap-2
            rounded-2xl px-10 py-4
            bg-accent-500 hover:bg-accent-600
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300 font-semibold text-neutral-50 text-sm md:text-md
            w-full sm:w-auto">
          {status === STATUS.SUBMITTING ? "Sending…" : "Submit Inquiry"}
        </button>
      </form>
    </PageSection>
  );
}

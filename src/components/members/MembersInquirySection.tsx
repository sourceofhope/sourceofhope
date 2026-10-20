"use client";

import { useState } from "react";
import Image from "next/image";
import { BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import HoneypotField, { readHoneypot } from "@/components/ui/HoneypotField";
import { ASSET_VERSION } from "@/lib/environment";

type Status = "IDLE" | "SUBMITTING" | "SUCCESS" | "INVALID" | "ERROR";

const INTERESTS = [
  "Monthly business sponsorship",
  "Donating gift cards to welcome new sponsors",
  "Offering a HOPE discount code",
  "A team volunteer day",
  "Paying by invoice or giving annually",
];

const EMPTY_FORM = {
  company: "",
  contact: "",
  email: "",
  phone: "",
  message: "",
  interests: [] as string[],
};

const inputClass =
  "w-full px-4 py-2 border-2 border-neutral-300 rounded-lg bg-neutral-50 text-neutral-900 focus:border-accent-500 focus:outline-none";
const labelClass = "text-sm font-semibold text-neutral-800";

export default function MembersInquirySection() {
  const [status, setStatus] = useState<Status>("IDLE");
  const [formData, setFormData] = useState(EMPTY_FORM);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const businessName = readHoneypot(e.currentTarget);

    if (
      !formData.company.trim() ||
      !formData.contact.trim() ||
      !validateEmail(formData.email)
    ) {
      setStatus("INVALID");
      return;
    }

    setStatus("SUBMITTING");

    try {
      const messageLines = [
        "Community Sponsor / Partner Inquiry",
        `Business: ${formData.company}`,
        `Contact: ${formData.contact}`,
        `Email: ${formData.email}`,
        formData.phone ? `Phone: ${formData.phone}` : null,
        formData.interests.length > 0
          ? `Interested in: ${formData.interests.join("; ")}`
          : null,
        formData.message ? `Message: ${formData.message}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.contact.trim(),
          email: formData.email,
          message: messageLines,
          businessName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setFormData(EMPTY_FORM);
      setStatus("SUCCESS");
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("ERROR");
    }
  };

  const handleInputChange = (
    field: Exclude<keyof typeof EMPTY_FORM, "interests">,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (status !== "IDLE" && status !== "SUBMITTING") setStatus("IDLE");
  };

  const toggleInterest = (interest: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interest]
        : prev.interests.filter((item) => item !== interest),
    }));
    if (status !== "IDLE" && status !== "SUBMITTING") setStatus("IDLE");
  };

  return (
    <PageSection
      id="partner-inquiry"
      className="py-15 gap-10 text-sm md:text-md lg:text-lg">
      <div className="grid gap-10 md:grid-cols-2 items-start">
        <div className="grid gap-5">
          <SectionHeading
            eyebrow="Let's talk"
            title="Bring your business to the table"
          />
          <div className="grid gap-5 text-neutral-600">
            <p>
              Whether you want to sponsor monthly, donate gift cards for new
              sponsors, offer a HOPE code, or bring your team to volunteer,
              we&apos;ll help you find the right fit.
            </p>
            <p>
              Prefer an invoice, an annual gift, or an employee matching
              program? Tell us here and our team will follow up.
            </p>
          </div>
          <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-sm">
            <Image
              src={`/${ASSET_VERSION}/servingHope/Carousel-3.webp`}
              alt="Volunteers in Source of Hope shirts stacking meal containers at a Serving Hope event"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid gap-5 rounded-2xl bg-neutral-100 p-5 md:p-8 shadow-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-3">
              <BuildingStorefrontIcon
                className="size-6 text-accent-500"
                aria-hidden="true"
              />
              <h3 className="font-urbanist text-xlg font-semibold text-primary-800">
                Start the Conversation
              </h3>
            </div>
            <p className="text-sm md:text-md text-neutral-600">
              Tell us a little about your business and how you&apos;d like to
              give back.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1 sm:col-span-2">
                <label htmlFor="cs-company" className={labelClass}>
                  Business or Organization <span className="text-red-500">*</span>
                </label>
                <input
                  id="cs-company"
                  type="text"
                  autoComplete="organization"
                  maxLength={120}
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="cs-contact" className={labelClass}>
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="cs-contact"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  value={formData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="cs-email" className={labelClass}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="cs-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="grid gap-1 sm:col-span-2">
                <label htmlFor="cs-phone" className={labelClass}>
                  Phone{" "}
                  <span className="text-neutral-400 font-normal">(optional)</span>
                </label>
                <input
                  id="cs-phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={30}
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <fieldset className="grid gap-2">
              <legend className={`${labelClass} mb-2`}>
                I&apos;m interested in{" "}
                <span className="text-neutral-400 font-normal">
                  (choose any)
                </span>
              </legend>
              {INTERESTS.map((interest) => (
                <label
                  key={interest}
                  className="flex items-start gap-3 text-sm text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={(e) => toggleInterest(interest, e.target.checked)}
                    className="mt-0.5 size-4 shrink-0 accent-accent-500 cursor-pointer"
                  />
                  <span>{interest}</span>
                </label>
              ))}
            </fieldset>

            <div className="grid gap-1">
              <label htmlFor="cs-message" className={labelClass}>
                Anything else we should know?{" "}
                <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="cs-message"
                rows={3}
                maxLength={2000}
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className={`${inputClass} resize-none text-sm`}
              />
            </div>
            <HoneypotField />
            <button
              type="submit"
              disabled={status === "SUBMITTING"}
              className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-neutral-300 disabled:cursor-not-allowed text-neutral-50 font-bold py-4 px-6 rounded-xl transition-all duration-300">
              {status === "SUBMITTING" ? "Sending…" : "Start the Conversation"}
            </button>
            <p role="status" aria-live="polite" className="text-sm empty:hidden">
              {status === "SUCCESS" && (
                <span className="text-accent-700 font-semibold">
                  Thank you! We&apos;ve received your note. A member of our team
                  will reach out to you soon.
                </span>
              )}
              {status === "INVALID" && (
                <span className="text-red-700 font-semibold">
                  Please fill in your business, your name, and a valid email
                  address.
                </span>
              )}
              {status === "ERROR" && (
                <span className="text-red-700 font-semibold">
                  Something went wrong sending your message. Please try again,
                  or email us at{" "}
                  <a className="underline" href="mailto:info@thesourceofhope.org">
                    info@thesourceofhope.org
                  </a>
                  .
                </span>
              )}
            </p>
          </form>
        </div>
      </div>
    </PageSection>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { SparklesIcon } from "@heroicons/react/24/solid";
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import Heading from "@/components/ui/Heading";
import { ASSET_VERSION } from "@/lib/environment";

type Status = "IDLE" | "SUBMITTING" | "SUCCESS" | "ERROR";

const EMPTY_FORM = {
  fname: "",
  lname: "",
  email: "",
  phone: "",
  message: "",
  infoCheck: false,
  contactCheck: false,
  // Honeypot: hidden from people, often filled in by bots.
  website: "",
};

const INPUT_CLASS =
  "w-full px-4 py-3 border-2 border-neutral-300 rounded-xl text-neutral-900 bg-neutral-50 placeholder-neutral-400 focus:outline-none focus:border-accent-500 transition-colors";

export default function FormSection() {
  const [status, setStatus] = useState<Status>("IDLE");
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.fname.trim() ||
      !formData.lname.trim() ||
      !validateEmail(formData.email)
    ) {
      setError("Please fill in all required fields with a valid email.");
      return;
    }

    setStatus("SUBMITTING");

    try {
      const messageLines = [
        "Planned Giving Interest Form",
        `Name: ${formData.fname} ${formData.lname}`,
        `Email: ${formData.email}`,
        formData.phone ? `Phone: ${formData.phone}` : null,
        formData.message ? `Message: ${formData.message}` : null,
        formData.infoCheck
          ? "Inquiry Type: Information about planned giving"
          : null,
        formData.contactCheck
          ? "Request: Please contact me to start a conversation"
          : null,
      ]
        .filter(Boolean)
        .join("\n");

      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.fname} ${formData.lname}`.trim(),
          email: formData.email,
          message: messageLines,
          website: formData.website,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setFormData(EMPTY_FORM);
      setStatus("SUCCESS");
    } catch (err) {
      console.error("Form submission error:", err);
      setError("Something went wrong. Please try again or contact us directly.");
      setStatus("ERROR");
    }
  };

  const handleInputChange = (
    field: keyof typeof EMPTY_FORM,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <PageSection className="py-15 gap-10">
      <div id="form-section" className="scroll-mt-24" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="grid gap-5">
          <SectionHeading
            eyebrow="Your story continues"
            title="A Legacy That Lives On"
          />
          <div className="grid gap-4 text-neutral-600">
            <p>
              Your legacy is more than what you leave behind. It&apos;s the
              lives you touch, the hope you inspire, and the future you help
              create.
            </p>
            <p>
              The people we serve today, and the volunteers who serve alongside
              us, are the living proof of what a legacy of hope can build.
            </p>
            <p className="font-semibold text-primary-800">
              Your story can be the reason someone else finds hope.
            </p>
          </div>
        </div>
        <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-md bg-neutral-200">
          <Image
            src={`/${ASSET_VERSION}/core/plannedgiving_storymedia.webp`}
            alt="Volunteers serving the community together"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-neutral-50 rounded-2xl p-5 md:p-8 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <SparklesIcon
              className="w-6 h-6 text-accent-500"
              aria-hidden="true"
            />
            <Heading>Let&apos;s Start a Conversation</Heading>
          </div>
          <p className="text-neutral-600 text-sm md:text-md mb-6">
            You don&apos;t need to have everything figured out today. We&apos;re
            here to listen, answer your questions, and help you explore the
            possibilities.
          </p>

          {status === "SUCCESS" ? (
            <p
              role="status"
              className="bg-accent-50 border border-accent-200 rounded-xl p-4 text-sm font-semibold text-accent-800">
              Thank you! We&apos;ve received your inquiry. A member of our team
              will reach out to you soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-3" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First name"
                  aria-label="First name"
                  autoComplete="given-name"
                  maxLength={50}
                  value={formData.fname}
                  onChange={(e) => handleInputChange("fname", e.target.value)}
                  required
                  className={INPUT_CLASS}
                />
                <input
                  type="text"
                  placeholder="Last name"
                  aria-label="Last name"
                  autoComplete="family-name"
                  maxLength={50}
                  value={formData.lname}
                  onChange={(e) => handleInputChange("lname", e.target.value)}
                  required
                  className={INPUT_CLASS}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  aria-label="Email address"
                  autoComplete="email"
                  maxLength={254}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className={INPUT_CLASS}
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  aria-label="Phone"
                  autoComplete="tel"
                  maxLength={30}
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
              <textarea
                placeholder="How can we help you?"
                aria-label="Message"
                maxLength={3000}
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className={`${INPUT_CLASS} resize-none min-h-28`}
              />
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="hidden"
              />
              <label className="flex items-start gap-3 text-sm text-neutral-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.infoCheck}
                  onChange={(e) =>
                    handleInputChange("infoCheck", e.target.checked)
                  }
                  className="w-4 h-4 accent-accent-500 mt-0.5 shrink-0 cursor-pointer"
                />
                <span>I&apos;d like information about planned giving.</span>
              </label>
              <label className="flex items-start gap-3 text-sm text-neutral-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.contactCheck}
                  onChange={(e) =>
                    handleInputChange("contactCheck", e.target.checked)
                  }
                  className="w-4 h-4 accent-accent-500 mt-0.5 shrink-0 cursor-pointer"
                />
                <span>Please contact me to start a conversation.</span>
              </label>

              {error && (
                <p
                  role="alert"
                  className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm font-semibold text-red-800">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "SUBMITTING"}
                className="mt-3 w-full rounded-2xl px-10 py-5 bg-accent-500 hover:bg-accent-600 text-neutral-50 font-semibold text-sm md:text-md transition-all duration-700 disabled:bg-neutral-300 disabled:cursor-not-allowed">
                {status === "SUBMITTING"
                  ? "Sending…"
                  : "LET'S TALK ABOUT YOUR LEGACY"}
              </button>
            </form>
          )}
        </div>

        <aside className="relative overflow-hidden bg-primary-800 text-neutral-300 rounded-2xl p-5 md:p-8 flex flex-col justify-center shadow-md">
          <span
            aria-hidden="true"
            className="font-serif text-8xl leading-none text-accent-300">
            &ldquo;
          </span>
          <blockquote className="font-urbanist text-xlg font-medium text-neutral-50 mb-5">
            Give a man a fish and you feed him for a day. Teach him how to fish
            and you feed him for a lifetime.
          </blockquote>
          <cite className="block text-sm not-italic tracking-wide">
            &mdash; Chinese proverb
          </cite>
          <SparklesIcon
            aria-hidden="true"
            className="absolute -right-4 -bottom-4 w-32 h-32 text-accent-300 opacity-15"
          />
        </aside>
      </div>
    </PageSection>
  );
}

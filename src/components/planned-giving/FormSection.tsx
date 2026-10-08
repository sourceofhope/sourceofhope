"use client";

import { useState } from "react";
import Image from "next/image";
import { SparklesIcon } from "@heroicons/react/24/solid";
import PageSection from "@/components/ui/PageSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { ASSET_VERSION } from "@/lib/environment";

type Status = "IDLE" | "SUBMITTING" | "SUCCESS" | "INVALID" | "ERROR";

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

const inputClass =
  "w-full px-4 py-2 border-2 border-neutral-300 rounded-lg bg-neutral-50 text-neutral-900 focus:border-accent-500 focus:outline-none";
const labelClass = "text-sm font-semibold text-neutral-800";

export default function FormSection() {
  const [status, setStatus] = useState<Status>("IDLE");
  const [formData, setFormData] = useState(EMPTY_FORM);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.fname.trim() ||
      !formData.lname.trim() ||
      !validateEmail(formData.email)
    ) {
      setStatus("INVALID");
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
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("ERROR");
    }
  };

  const handleInputChange = (
    field: keyof typeof EMPTY_FORM,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (status !== "IDLE" && status !== "SUBMITTING") setStatus("IDLE");
  };

  return (
    <PageSection
      id="form-section"
      className="py-10 gap-10 text-sm md:text-md lg:text-lg">
      <div className="grid gap-10 md:grid-cols-2 items-center">
        <div className="grid gap-5">
          <SectionHeading
            eyebrow="Your story continues"
            title="A Legacy That Lives On"
          />
          <div className="grid gap-5 text-neutral-600">
            <p>
              Your legacy is more than what you leave behind. It&apos;s the
              lives you touch, the hope you inspire, and the future you help
              create.
            </p>
            <p>
              The people we serve today, and the volunteers who serve alongside
              us, are the living proof of what a legacy of hope can build.
            </p>
          </div>
          <p className="font-semibold text-primary-800">
            Your story can be the reason someone else finds hope.
          </p>
        </div>
        <div className="relative w-full aspect-square md:aspect-4/3 rounded-2xl overflow-hidden shadow-sm">
          <Image
            src={`/${ASSET_VERSION}/plannedgiving/plannedgiving_storymedia.webp`}
            alt="Three Source of Hope volunteers in aprons and gloves smiling together in a kitchen"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="md:col-span-2 grid gap-5 rounded-2xl bg-neutral-100 p-5 md:p-8 shadow-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-3">
              <SparklesIcon className="size-6 text-accent-500" aria-hidden="true" />
              <h3 className="font-urbanist text-xlg font-semibold text-primary-800">
                Let&apos;s Start a Conversation
              </h3>
            </div>
            <p className="text-sm md:text-md text-neutral-600">
              You don&apos;t need to have everything figured out today.
              We&apos;re here to listen, answer your questions, and help you
              explore the possibilities.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1">
                <label htmlFor="pg-first-name" className={labelClass}>
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="pg-first-name"
                  type="text"
                  autoComplete="given-name"
                  maxLength={50}
                  value={formData.fname}
                  onChange={(e) => handleInputChange("fname", e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="pg-last-name" className={labelClass}>
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="pg-last-name"
                  type="text"
                  autoComplete="family-name"
                  maxLength={50}
                  value={formData.lname}
                  onChange={(e) => handleInputChange("lname", e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="pg-email" className={labelClass}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="pg-email"
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
              <div className="grid gap-1">
                <label htmlFor="pg-phone" className={labelClass}>
                  Phone{" "}
                  <span className="text-neutral-400 font-normal">(optional)</span>
                </label>
                <input
                  id="pg-phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={30}
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid gap-1">
              <label htmlFor="pg-message" className={labelClass}>
                How can we help you?{" "}
                <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="pg-message"
                rows={3}
                maxLength={2000}
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className={`${inputClass} resize-none text-sm`}
              />
            </div>
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
            <label className="flex items-start gap-3 text-sm text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.infoCheck}
                onChange={(e) =>
                  handleInputChange("infoCheck", e.target.checked)
                }
                className="mt-0.5 size-4 shrink-0 accent-accent-500 cursor-pointer"
              />
              <span>I&apos;d like information about planned giving.</span>
            </label>
            <label className="flex items-start gap-3 text-sm text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.contactCheck}
                onChange={(e) =>
                  handleInputChange("contactCheck", e.target.checked)
                }
                className="mt-0.5 size-4 shrink-0 accent-accent-500 cursor-pointer"
              />
              <span>Please contact me to start a conversation.</span>
            </label>
            <button
              type="submit"
              disabled={status === "SUBMITTING"}
              className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-neutral-300 disabled:cursor-not-allowed text-neutral-50 font-bold py-4 px-6 rounded-xl transition-all duration-300">
              {status === "SUBMITTING"
                ? "Sending…"
                : "Let's Talk About Your Legacy"}
            </button>
            <p role="status" aria-live="polite" className="text-sm empty:hidden">
              {status === "SUCCESS" && (
                <span className="text-accent-700 font-semibold">
                  Thank you! We&apos;ve received your inquiry. A member of our
                  team will reach out to you soon.
                </span>
              )}
              {status === "INVALID" && (
                <span className="text-red-700 font-semibold">
                  Please fill in your name and a valid email address.
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

        <aside className="relative overflow-hidden grid content-center gap-5 rounded-2xl bg-accent-800 p-5 md:p-8 text-neutral-50">
          <blockquote className="border-l-4 border-accent-300 pl-5 font-urbanist text-xlg font-medium leading-snug">
            Give a man a fish and you feed him for a day. Teach him how to fish
            and you feed him for a lifetime.
          </blockquote>
          <cite className="pl-6 text-sm not-italic text-neutral-300">
            &mdash; Chinese proverb
          </cite>
          <SparklesIcon
            aria-hidden="true"
            className="absolute -right-4 -bottom-4 size-32 text-accent-300 opacity-15"
          />
        </aside>
      </div>
    </PageSection>
  );
}

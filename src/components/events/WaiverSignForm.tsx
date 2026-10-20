"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import HookInput from "@/components/ui/HookInput";
import HoneypotField, { readHoneypot } from "@/components/ui/HoneypotField";
import { WAIVERS, type WaiverId } from "@/lib/waivers";

interface WaiverSignFormProps {
  waiverId: WaiverId;
  /** Event to reopen after signing; omit when signing from the documents list. */
  eventKey?: string;
  onCancel?: () => void;
}

interface FormValues {
  name: string;
  email: string;
  minor: boolean;
  guardianSignsHere: "here" | "email";
  guardianName: string;
  guardianEmail: string;
}

const EMAIL_RULE = {
  value: /^[^\s@<>"]{1,64}@[^\s@<>"]{1,255}\.[^\s@<>"]+$/,
  message: "Please enter a valid email address",
};

/**
 * Collects only what DocuSign needs to prepare the waiver (names and emails).
 * Everything else on the form (date of birth, phone, emergency contact,
 * initials, signatures) is filled in on DocuSign and never touches this site.
 */
export default function WaiverSignForm({ waiverId, eventKey, onCancel }: WaiverSignFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const pathname = usePathname();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: { minor: false, guardianSignsHere: "here" },
  });

  const minor = watch("minor");
  const guardianSignsHere = watch("guardianSignsHere");
  const waiver = WAIVERS[waiverId];

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/waiver/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          waiverId,
          eventKey,
          returnPath: pathname,
          name: values.name,
          email: values.email,
          minor: values.minor,
          guardian: values.minor
            ? {
                name: values.guardianName,
                email: values.guardianEmail,
                signsHere: values.guardianSignsHere === "here",
              }
            : undefined,
          businessName: readHoneypot(formRef.current),
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(
          data.error ||
            (response.status === 429
              ? "Too many attempts. Please wait a few minutes and try again."
              : "We couldn't start online signing. Please try again or download the PDF."),
        );
      }

      window.location.assign(data.url);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="relative grid gap-1 rounded-2xl bg-neutral-100 p-5 text-sm md:text-md"
      noValidate>
      <HoneypotField />
      <p className="mb-3 text-neutral-700">
        You&apos;ll be taken to DocuSign to review and sign the{" "}
        <strong>{waiver.title}</strong>. It takes about three minutes; please
        have your date of birth, phone number, and an emergency contact ready.
      </p>

      <HookInput
        title="Volunteer's full legal name"
        autoComplete="name"
        error={errors.name}
        {...register("name", {
          required: "Name is required",
          maxLength: { value: 120, message: "Name is too long" },
          validate: (value) => value.trim().length >= 2 || "Name is required",
        })}
      />
      <HookInput
        title="Volunteer's email"
        type="email"
        autoComplete="email"
        error={errors.email}
        {...register("email", { required: "Email is required", pattern: EMAIL_RULE })}
      />

      <label className="flex items-start gap-3 py-2 font-semibold text-neutral-900 select-none">
        <input
          type="checkbox"
          className="mt-1 size-4 accent-accent-600"
          {...register("minor")}
        />
        <span>The volunteer is under 18</span>
      </label>

      {minor && (
        <fieldset className="grid gap-1 rounded-xl border border-neutral-300 p-4">
          <legend className="px-1 font-semibold text-neutral-900">
            Parent or guardian
          </legend>
          <p className="mb-2 text-neutral-600">
            A parent or legal guardian must also sign.
          </p>
          <HookInput
            title="Guardian's full name"
            error={errors.guardianName}
            {...register("guardianName", {
              validate: (value) =>
                !minor || value.trim().length >= 2 || "Guardian's name is required",
              maxLength: { value: 120, message: "Name is too long" },
            })}
          />
          <HookInput
            title="Guardian's email"
            type="email"
            error={errors.guardianEmail}
            {...register("guardianEmail", {
              validate: (value) =>
                !minor || EMAIL_RULE.value.test(value.trim()) || EMAIL_RULE.message,
            })}
          />
          <div className="grid gap-2 pt-1" role="radiogroup" aria-label="How will the guardian sign?">
            <label className="flex items-start gap-3 select-none">
              <input
                type="radio"
                value="here"
                className="mt-1 size-4 accent-accent-600"
                {...register("guardianSignsHere")}
              />
              <span>The guardian is with me and will sign right after the volunteer</span>
            </label>
            <label className="flex items-start gap-3 select-none">
              <input
                type="radio"
                value="email"
                className="mt-1 size-4 accent-accent-600"
                {...register("guardianSignsHere")}
              />
              <span>Email the guardian a link to sign later</span>
            </label>
          </div>
          {guardianSignsHere === "email" && (
            <p className="text-neutral-600">
              DocuSign will email the guardian after the volunteer signs. The
              waiver is complete once they sign.
            </p>
          )}
        </fieldset>
      )}

      <p role="alert" className="text-sm text-red-700 empty:hidden">
        {error}
      </p>

      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl px-6 py-3 font-semibold text-primary-700 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent-500 px-6 py-3 font-semibold text-neutral-50 transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300">
          {submitting ? "Preparing your waiver..." : "Continue to DocuSign"}
          {!submitting && <ArrowTopRightOnSquareIcon className="size-4" aria-hidden="true" />}
        </button>
      </div>
    </form>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";

import HookInput from "../../../components/ui/HookInput";
import Title from "../../../components/ui/text/Title";

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { sendEmail } from "@/lib/api/email";

const formStatus = {
  IDLE: "IDLE",
  SUBMIT: "SUBMIT",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
};

export default function FormInputSection() {
  const [status, setStatus] = useState(formStatus.IDLE);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      membership: "",
      company: "",
    },
  });

  const isProcessing = status === formStatus.SUBMIT;

  async function onSubmit(formData) {
    setStatus(formStatus.SUBMIT);

    if (formData.company) {
      setStatus(formStatus.SUCCESS);
      reset();
      setTimeout(() => setStatus(formStatus.IDLE), 3000);
      return;
    }

    try {
      await sendEmail({
        name: `${formData.fname} ${formData.lname}`.trim(),
        email: formData.email,
        message: [
          `Membership: ${formData.membership || "Not provided"}`,
          `Phone: ${formData.phone || "Not provided"}`,
        ].join("\n"),
      });

      setStatus(formStatus.SUCCESS);
      reset();

      setTimeout(() => {
        setStatus(formStatus.IDLE);
      }, 5000);
    } catch (error) {
      console.error("Failed to send email:", error);
      setStatus(formStatus.ERROR);
    }
  }

  return (
    <section className="grid gap-5 w-full p-5 lg:px-36">
      <Title>Community Impact Form</Title>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid h-full gap-3 md:grid-cols-2">
        <HookInput
          title="First name"
          type="text"
          border={false}
          error={errors.fname}
          {...register("fname", {
            required: "First name is required",
            minLength: { value: 2, message: "Minimum 2 characters" },
            maxLength: { value: 50, message: "Maximum 50 characters" },
            pattern: {
              value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
              message: "Enter a valid name",
            },
          })}
        />

        <HookInput
          title="Last name"
          type="text"
          border={false}
          error={errors.lname}
          {...register("lname", {
            required: "Last name is required",
            minLength: { value: 2, message: "Minimum 2 characters" },
            maxLength: { value: 50, message: "Maximum 50 characters" },
            pattern: {
              value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
              message: "Enter a valid name",
            },
          })}
        />

        <HookInput
          title="Email address"
          type="email"
          border={false}
          error={errors.email}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Enter a valid email",
            },
          })}
        />

        <HookInput
          title="Phone number"
          type="tel"
          border={false}
          error={errors.phone}
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^[\d\s\-().+]+$/,
              message: "Enter a valid phone number",
            },
            minLength: { value: 10, message: "At least 10 digits" },
          })}
        />

        <div className="flex flex-col gap-1 w-full md:col-span-2">
          <label htmlFor="membership" className="text-sm font-semibold">
            Membership type
          </label>

          <select
            id="membership"
            className={`bg-neutral-50 rounded-2xl border-0 shadow-sm w-full h-[4ch] px-3 focus:outline-none focus:ring-2 focus:ring-accent-500 ${
              errors.membership ? "ring-2 ring-red-400" : ""
            }`}
            defaultValue=""
            {...register("membership")}>
            <option value="" disabled>
              Select membership (optional)
            </option>
            <option value="bronze">
              Hope Advocate [Bronze Pin] ($50/month)
            </option>
            <option value="silver">
              Hope Professional [Silver Pin] ($199/month)
            </option>
            <option value="gold">
              Hope Enterprise Partner [Gold Pin] ($500/month)
            </option>
          </select>
        </div>

        <input
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
          {...register("company")}
        />

        <div
          className="h-5 md:col-span-2"
          aria-live="polite"
          aria-atomic="true">
          {status === formStatus.SUCCESS && (
            <p className="text-sm text-green-700 flex items-center justify-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              Message sent.
            </p>
          )}

          {status === formStatus.ERROR && (
            <p className="text-sm text-red-700 flex items-center justify-center gap-2">
              <XCircleIcon className="w-5 h-5" />
              Something went wrong. Try again.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className={`md:col-span-2 w-full px-5 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 ${
            isProcessing
              ? "bg-neutral-400 cursor-not-allowed"
              : "bg-accent-500 hover:bg-accent-600 hover:shadow-lg"
          }`}>
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Sending
            </span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </section>
  );
}

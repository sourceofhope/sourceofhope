import { useState } from "react";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid";
import PageSection from "../../PageSection";
import LocalInput from "../../../components/ui/LocalInput";
import Title from "../../../components/ui/text/Title";
import Heading from "../../../components/ui/text/Heading";
import { sendEmail } from "@/lib/api/email";

const STATUS = {
  IDLE: "IDLE",
  SUBMITTING: "SUBMITTING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const GIVING_OPTIONS = [
  "Bequest in a will or trust",
  "Beneficiary designation (retirement/insurance)",
  "Charitable gift annuity",
  "Other / Not sure yet",
];

export default function PlanGivingContactSection() {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    givingType: "",
    message: "",
  });

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
  const validatePhone = (e) =>
    e.target.value.length === 0 || e.target.value.length >= 10;

  const isFormValid =
    formData.fname &&
    formData.lname &&
    formData.email &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleSubmit = async (e) => {
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
      .join("\n");

    try {
      await sendEmail({
        name: `${formData.fname} ${formData.lname}`.trim(),
        email: formData.email,
        message: lines,
      });
      setStatus(STATUS.SUCCESS);
    } catch {
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
            We've received your inquiry about planned giving. A member of our
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
          out the form below and we'll guide you through the next steps.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8 grid gap-5 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <LocalInput
            title="First Name"
            htmlFor="fname"
            type="text"
            setFormData={setFormData}
            value={formData.fname}
          />
          <LocalInput
            title="Last Name"
            htmlFor="lname"
            type="text"
            setFormData={setFormData}
            value={formData.lname}
          />
        </div>

        <LocalInput
          title="Email Address"
          htmlFor="email"
          type="email"
          onChange={validateEmail}
          setFormData={setFormData}
          value={formData.email}
        />

        <LocalInput
          title="Phone Number (optional)"
          htmlFor="phone"
          type="tel"
          onChange={validatePhone}
          setFormData={setFormData}
          value={formData.phone}
        />

        <div className="flex flex-col gap-1">
          <label
            htmlFor="givingType"
            className="text-sm md:text-md px-1 font-semibold select-none text-neutral-950">
            I'm interested in (optional)
          </label>
          <select
            id="givingType"
            name="givingType"
            value={formData.givingType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, givingType: e.target.value }))
            }
            className="bg-neutral-50 rounded-2xl shadow-sm w-full h-[4ch] px-2 text-sm md:text-md text-neutral-800">
            <option value="">Select a giving type…</option>
            {GIVING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="message"
            className="text-sm md:text-md px-1 font-semibold select-none text-neutral-950">
            Message (optional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
            placeholder="Share any questions or thoughts…"
            className="bg-neutral-50 rounded-2xl shadow-sm w-full px-3 py-2 text-sm md:text-md text-neutral-800 resize-none"
          />
        </div>

        {status === STATUS.ERROR && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
            <span>
              Something went wrong. Please try again or contact us directly.
            </span>
          </div>
        )}

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

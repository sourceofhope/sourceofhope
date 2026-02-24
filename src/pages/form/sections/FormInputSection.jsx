import { useState } from "react";
import LocalInput from "../../../components/ui/LocalInput";
import Title from "../../../components/ui/text/Title";
import MembershipCheckoutSection from "./MembershipCheckoutSection";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { sendEmail } from "@/lib/api/email";

const formStatus = {
  IDLE: "IDLE",
  SUBMIT: "SUBMIT",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  PAYMENT: "PAYMENT",
};

export default function FormInputSection() {
  const [status, setStatus] = useState(formStatus.IDLE);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    membership: "",
  });

  const isProcessing = status === formStatus.SUBMIT;
  const isPaymentStep = status === formStatus.PAYMENT;

  const validateEmail = (event) => {
    const email = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (event) => {
    const phone = event.target.value;
    return phone.length === 0 || phone.length >= 10;
  };

  const isFormValid = () => {
    return (
      formData.fname &&
      formData.lname &&
      formData.email &&
      formData.phone &&
      formData.membership &&
      validateEmail({ target: { value: formData.email } }) &&
      validatePhone({ target: { value: formData.phone } })
    );
  };

  const handleContinueToPayment = () => {
    if (!isFormValid()) return;
    setStatus(formStatus.PAYMENT);
  };

  const handleEditInformation = () => {
    setStatus(formStatus.IDLE);
  };

  const handlePaymentSuccess = async (subscription) => {
    console.log("Subscription successful:", subscription);
    
    // Send confirmation email
    try {
      await sendEmail({
        name: `${formData.fname} ${formData.lname}`.trim(),
        email: formData.email,
        message: [
          `Membership: ${formData.membership}`,
          `Phone: ${formData.phone}`,
          `Subscription ID: ${subscription.id}`,
        ].join("\n"),
      });
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
    }

    setStatus(formStatus.SUCCESS);
    
    setTimeout(() => {
      setStatus(formStatus.IDLE);
      setFormData({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        membership: "",
      });
    }, 5000);
  };

  // Success state
  if (status === formStatus.SUCCESS) {
    return (
      <section className="grid gap-5 w-full p-5 lg:px-36">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex items-center justify-center flex-col space-y-4">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold text-neutral-900">Success!</h2>
            <p className="text-neutral-600 text-center">
              Your membership has been activated. Welcome to the community!
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Payment step
  if (isPaymentStep) {
    return (
      <section className="grid gap-5 w-full p-5 lg:px-36">
        <Title>Complete Your Membership</Title>
        <MembershipCheckoutSection
          formData={formData}
          onEdit={handleEditInformation}
          onSuccess={handlePaymentSuccess}
        />
      </section>
    );
  }

  // Step 1: Form input
  return (
    <section className="grid gap-5 w-full p-5 lg:px-36">
      <Title>Community Impact Form</Title>
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-neutral-900 mb-4">Your Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LocalInput
              title="First Name"
              htmlFor="fname"
              type="text"
              value={formData.fname}
              onChange={() => true}
              setFormData={setFormData}
            />
            <LocalInput
              title="Last Name"
              htmlFor="lname"
              type="text"
              value={formData.lname}
              onChange={() => true}
              setFormData={setFormData}
            />
          </div>
          <LocalInput
            title="Email Address"
            htmlFor="email"
            type="email"
            value={formData.email}
            onChange={validateEmail}
            setFormData={setFormData}
            className="w-full"
          />
          <LocalInput
            title="Phone Number"
            htmlFor="phone"
            type="tel"
            value={formData.phone}
            onChange={validatePhone}
            setFormData={setFormData}
            className="w-full"
          />
          <div className="flex flex-col gap-1">
            <label
              htmlFor="membership"
              className="text-sm font-semibold text-neutral-900"
            >
              Membership Type *
            </label>
            <select
              value={formData.membership}
              onChange={(e) => setFormData({ ...formData, membership: e.target.value })}
              className="bg-neutral-50 rounded-xl border border-neutral-200 shadow-sm w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="">Select a membership</option>
              <option value="bronze">
                Hope Advocate [Bronze Pin] - $50/month
              </option>
              <option value="silver">
                Hope Professional [Silver Pin] - $199/month
              </option>
              <option value="gold">
                Hope Enterprise Partner [Gold Pin] - $500/month
              </option>
            </select>
          </div>

          <button
            onClick={handleContinueToPayment}
            disabled={!isFormValid() || isProcessing}
            className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-neutral-300 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Continue to Payment"}
          </button>
        </div>
      </div>
    </section>
  );
}

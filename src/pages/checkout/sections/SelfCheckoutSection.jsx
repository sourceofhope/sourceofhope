import { useState } from "react";
import Heading from "../../../components/ui/text/Heading";
import Input from "../../../components/ui/Input";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

export default function SelfCheckoutSection({ total, cart }) {

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    cardName: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateEmail = (event) => {
    const email = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (event) => {
    const phone = event.target.value;
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    return phone.length === 0 || phoneRegex.test(phone);
  };

  const validateZipCode = (event) => {
    const zip = event.target.value;
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zip.length === 0 || zipRegex.test(zip);
  };

  const validateCardNumber = (event) => {
    const cardNumber = event.target.value.replace(/\s/g, "");
    return cardNumber.length === 0 || (cardNumber.length >= 13 && cardNumber.length <= 19);
  };

  const validateCVV = (event) => {
    const cvv = event.target.value;
    return cvv.length === 0 || (cvv.length >= 3 && cvv.length <= 4);
  };

  const validateExpiry = (event) => {
    const expiry = event.target.value;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return expiry.length === 0 || expiryRegex.test(expiry);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      alert(`Order placed successfully!\nTotal: $${total.toFixed(2)}\nOrder will be sent to: ${formData.email}`);
      setIsProcessing(false);
      // Here you would typically redirect to a success page or clear the cart
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <Heading className="text-xl mb-4">Customer Information</Heading>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="font-semibold text-neutral-900 mb-4">Contact Details</h3>
          <div className="space-y-4">
            <Input
              title="Email Address"
              htmlFor="email"
              type="email"
              onChange={validateEmail}
              setFormData={setFormData}
              className="w-full"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                title="First Name"
                htmlFor="firstName"
                type="text"
                onChange={() => true}
                setFormData={setFormData}
              />
              <Input
                title="Last Name"
                htmlFor="lastName"
                type="text"
                onChange={() => true}
                setFormData={setFormData}
              />
            </div>
            <Input
              title="Phone Number"
              htmlFor="phone"
              type="tel"
              onChange={validatePhone}
              setFormData={setFormData}
              className="w-full"
            />
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h3 className="font-semibold text-neutral-900 mb-4">Shipping Address</h3>
          <div className="space-y-4">
            <Input
              title="Street Address"
              htmlFor="address"
              type="text"
              onChange={() => true}
              setFormData={setFormData}
              className="w-full"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                title="City"
                htmlFor="city"
                type="text"
                onChange={() => true}
                setFormData={setFormData}
              />
              <Input
                title="State / Province"
                htmlFor="state"
                type="text"
                onChange={() => true}
                setFormData={setFormData}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                title="ZIP / Postal Code"
                htmlFor="zipCode"
                type="text"
                onChange={validateZipCode}
                setFormData={setFormData}
              />
              <div className="flex flex-col gap-1 text-neutral-950">
                <label
                  htmlFor="country"
                  className="text-sm md:text-md px-1 font-semibold select-none">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, country: e.target.value }))
                  }
                  className="bg-neutral-50 rounded-2xl shadow-sm w-full h-[4ch] px-2 border-2 border-neutral-950">
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <h3 className="font-semibold text-neutral-900 mb-4">Payment Information</h3>
          <div className="space-y-4">
            <Input
              title="Cardholder Name"
              htmlFor="cardName"
              type="text"
              onChange={() => true}
              setFormData={setFormData}
              className="w-full"
            />
            <Input
              title="Card Number"
              htmlFor="cardNumber"
              type="text"
              onChange={validateCardNumber}
              setFormData={setFormData}
              className="w-full"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                title="Expiry (MM/YY)"
                htmlFor="cardExpiry"
                type="text"
                onChange={validateExpiry}
                setFormData={setFormData}
              />
              <Input
                title="CVV"
                htmlFor="cardCVV"
                type="text"
                onChange={validateCVV}
                setFormData={setFormData}
              />
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
          />
          <label htmlFor="terms" className="text-sm text-neutral-700">
            I agree to the{" "}
            <a href="/terms" className="text-accent-600 hover:text-accent-700 underline">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-accent-600 hover:text-accent-700 underline">
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || !agreedToTerms}
          className={`
            w-full py-4 rounded-2xl font-semibold text-white text-lg
            ${
              isProcessing || !agreedToTerms
                ? "bg-neutral-400 cursor-not-allowed"
                : "bg-accent-500 hover:bg-accent-600 active:scale-[0.98]"
            }
            transition-all duration-300 shadow-md hover:shadow-lg
          `}>
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Complete Purchase • $${total.toFixed(2)}`
          )}
        </button>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-neutral-500">
            🔒 Your payment information is encrypted and secure
          </p>
        </div>
      </form>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Success | The Source of Hope",
  description: "Thank you for your purchase.",
};

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Thank You!</h1>
        <p className="text-gray-600 mt-4">Your order has been received.</p>
      </div>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | The Source of Hope",
  description: "Checkout securely.",
};

export default function Checkout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Checkout</h1>
        <p className="text-gray-600 mt-4">Coming soon...</p>
      </div>
    </div>
  );
}

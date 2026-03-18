import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart | The Source of Hope",
  description: "View your shopping cart.",
};

export default function Cart() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Shopping Cart</h1>
        <p className="text-gray-600 mt-4">Coming soon...</p>
      </div>
    </div>
  );
}

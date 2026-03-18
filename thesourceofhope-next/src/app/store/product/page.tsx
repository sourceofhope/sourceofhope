import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product | The Source of Hope",
  description: "View product details.",
};

export default function Product() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Product</h1>
        <p className="text-gray-600 mt-4">Coming soon...</p>
      </div>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store | The Source of Hope",
  description: "Explore products and support The Source of Hope.",
};

export default function Store() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Store</h1>
        <p className="text-gray-600 mt-4">Coming soon...</p>
      </div>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Outdoor Hope | The Source of Hope",
  description: "Learn about our Outdoor Hope program.",
};

export default function OutdoorHope() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Outdoor Hope</h1>
        <p className="text-gray-600 mt-4">Coming soon...</p>
      </div>
    </div>
  );
}

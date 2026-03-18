import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wellness Hope | The Source of Hope",
  description: "Learn about our Wellness Hope program.",
};

export default function WellnessHope() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Wellness Hope</h1>
        <p className="text-gray-600 mt-4">Coming soon...</p>
      </div>
    </div>
  );
}

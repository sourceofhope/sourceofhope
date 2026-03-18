import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education Hope | The Source of Hope",
  description: "Learn about our Education Hope program.",
};

export default function EducationHope() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Education Hope</h1>
        <p className="text-gray-600 mt-4">Coming soon...</p>
      </div>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Give | The Source of Hope",
  description: "Support The Source of Hope's mission through donations.",
};

export default function Give() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Give</h1>
        <p className="text-gray-600 mt-4">Coming soon...</p>
      </div>
    </div>
  );
}

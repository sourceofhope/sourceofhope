import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | The Source of Hope",
  description: "Learn about The Source of Hope's mission and team.",
};

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="text-gray-600 mt-4">Coming soon...</p>
      </div>
    </div>
  );
}

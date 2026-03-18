import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team | The Source of Hope",
  description: "Meet our team members.",
};

export default function Team() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Team Members</h1>
        <p className="text-gray-600 mt-4">Coming soon...</p>
      </div>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Member | The Source of Hope",
  description: "Team member profile.",
};

export default function TeamMember({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Team Member</h1>
        <p className="text-gray-600 mt-4">Coming soon...</p>
      </div>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members | The Source of Hope",
  description: "Meet the volunteers and members of The Source of Hope.",
};

export default function Members() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Members</h1>
        <p className="text-gray-600 mt-4">Coming soon...</p>
      </div>
    </div>
  );
}

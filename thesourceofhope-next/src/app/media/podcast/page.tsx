import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podcast | The Source of Hope",
  description: "Listen to our podcast episodes.",
};

export default function Podcast() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Podcast</h1>
        <p className="text-gray-600 mt-4">Coming soon...</p>
      </div>
    </div>
  );
}

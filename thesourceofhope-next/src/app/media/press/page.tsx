import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press | The Source of Hope",
  description: "Read press releases and media coverage.",
};

export default function Press() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Press</h1>
        <p className="text-gray-600 mt-4">Coming soon...</p>
      </div>
    </div>
  );
}

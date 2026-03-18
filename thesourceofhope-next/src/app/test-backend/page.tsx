import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Backend | Development",
  description: "Test backend integration.",
};

export default function TestBackend() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Test Backend</h1>
        <p className="text-gray-600 mt-4">Development page</p>
      </div>
    </div>
  );
}

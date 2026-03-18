import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.thesourceofhope.org",
      },
    ],
  },
};

export default nextConfig;

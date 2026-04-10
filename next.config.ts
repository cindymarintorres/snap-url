import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix Turbopack workspace root detection (there are other package-lock.json files in parent dirs)
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Allow images from external sources for avatars
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;

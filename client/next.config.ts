import type { NextConfig } from "next";

const imageBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
const parsedImageBase = imageBase ? new URL(imageBase) : null;

const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(
  parsedImageBase?.hostname || "localhost"
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: parsedImageBase?.protocol.replace(":", "") || "http",
        hostname: parsedImageBase?.hostname || "localhost",
        port: parsedImageBase?.port || "8000",
      },
    ],
    // Disable optimization for localhost targets to avoid private IP blocking
    unoptimized: isLocalhost,
  },
};

export default nextConfig;

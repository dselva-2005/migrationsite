// next.config.ts
import type { NextConfig } from "next";

// Pull allowed image domains from environment variable
const allowedImageDomains: string[] =
  process.env.NEXT_PUBLIC_IMAGE_HOSTS?.split(",").map((h) => h.trim()) || [];

// Pull API base URL from environment (optional, useful for SSR calls)
const apiBaseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const nextConfig: NextConfig = {
  output:"standalone",
  reactStrictMode: true,
  images: {
    domains: allowedImageDomains,
    remotePatterns: [
      // Always allow your backend images
      {
        protocol: "http",
        hostname: "django",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "**",  // wildcard for all domains
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: apiBaseUrl,
  },
};

export default nextConfig;

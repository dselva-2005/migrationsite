import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Disable image optimization completely
  images: {
    unoptimized: true,
  },

  // Optional: Configure output if you're using static export
  output: 'standalone',
};

export default nextConfig;
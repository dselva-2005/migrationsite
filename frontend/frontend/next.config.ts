import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Disable image optimization completely
  images: {
    unoptimized: true,
  },

  // Optional: Configure output if you're using static export
  output: 'standalone',

  // Enforce consistent trailing slashes
  trailingSlash: false, // or false if you want no trailing slash
};

export default nextConfig;
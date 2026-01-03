import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: 'http',
        hostname: '192.168.1.113',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '192.168.1.113',
        port: '8000',
        pathname: '/media/**',
      },
    ],
    domains: ["migrationreviews.com", "placeimg.com", "picsum.photos", "consumersiteimages.trustpilot.net", "images.unsplash.com"], // add your image host here
  },
};

export default nextConfig;

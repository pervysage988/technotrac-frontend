import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Prevent ESLint errors from failing the build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ✅ Image optimization for remote sources
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000", // FastAPI backend (for local dev)
      },
    ],
  },
  // ✅ Static export for Firebase Hosting
  output: "export",
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ✅ Prevents ESLint errors from failing `npm run build`
    ignoreDuringBuilds: true,
  },
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
};

export default nextConfig;

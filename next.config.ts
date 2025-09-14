import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    // ✅ allow deploys even if eslint errors exist
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // ✅ disables next/image optimization (good for Vercel + Firebase)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
}

export default nextConfig

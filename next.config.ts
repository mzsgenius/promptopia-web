import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/adapter-pg", "pg"],
  typescript: { ignoreBuildErrors: true },
  // Enable caching for static generation
  output: "standalone",
  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Enable compression
  compress: true,
};

export default nextConfig;

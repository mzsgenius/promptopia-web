import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel serverless function config for Prisma
  serverExternalPackages: ["@prisma/adapter-pg", "pg"],
};

export default nextConfig;

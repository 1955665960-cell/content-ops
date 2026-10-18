import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 👇 强制忽略 TypeScript 和 ESLint 报错
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true, // 👈 强行忽略 TS 报错
  },
  eslint: {
    ignoreDuringBuilds: true, // 👈 强行忽略 ESLint 报错
  },
};

export default nextConfig;
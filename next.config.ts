import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  turbopack: {
    // Keep root discovery within this project, even with lockfiles in parent directories.
    root: __dirname,
  },
};
export default nextConfig;

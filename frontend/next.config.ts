import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // webpack: (config) => {
  //   config.resolve.fallback = {
  //     fs: false,       // Semaphore uses node-fs which breaks in browser
  //     readline: false, // Fixes other node-specific dependencies
  //   };
  //   return config;
  // },
};

export default nextConfig;

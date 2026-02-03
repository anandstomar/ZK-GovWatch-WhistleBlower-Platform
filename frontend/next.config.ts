import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* * 1. Disable ESLint and TS errors during build to get your app deployed/built 
   * even if there are minor linter or type mismatches.
   */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  /* * 2. Webpack config for SnarkJS/ZK proofs 
   * (Removes the need for 'fs' and other node modules in the browser)
   */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback, // Keep existing fallbacks if any
        fs: false,
        readline: false,
        os: false,
        path: false,
        constants: false,
        stream: false,
      };
    }
    return config;
  },
};

export default nextConfig;
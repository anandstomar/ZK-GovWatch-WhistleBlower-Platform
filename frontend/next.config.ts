/** @type {import('next').NextConfig} */
const nextConfig = {
  /* We remove the invalid 'experimental: { turbo }' block */

  /* Keep this! It is required for snarkjs to work in the browser */
  webpack: (config, { isServer  }) => {
    if (!isServer) {
      config.resolve.fallback = {
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
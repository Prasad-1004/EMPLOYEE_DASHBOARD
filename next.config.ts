import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.appwrite.io',
      },
    ],
  },

  poweredByHeader: false,
};

export default nextConfig;
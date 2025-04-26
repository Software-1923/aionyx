/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Allow Clerk authentication
  experimental: {
    serverComponentsExternalPackages: ['@clerk/nextjs']
  }
};

module.exports = nextConfig;
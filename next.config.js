/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  serverExternalPackages: ['@clerk/nextjs'], // Güncellenmiş ayar
  // Hono API configuration
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: '/api/hono/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
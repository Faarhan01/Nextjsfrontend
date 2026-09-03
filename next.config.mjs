/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '*',
    '*.run.app',
    'localhost:3000',
    '127.0.0.1:3000'
  ],
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion', 'recharts'],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

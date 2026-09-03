/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '*',
    '*.run.app',
    'ais-dev-6gn5ggip67oqekkhfx7fhc-396079311886.europe-west1.run.app',
    'ais-pre-6gn5ggip67oqekkhfx7fhc-396079311886.europe-west1.run.app',
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

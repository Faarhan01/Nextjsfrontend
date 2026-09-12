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
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  serverExternalPackages: [
    '@libsql/client',
    '@libsql/hrana-client',
    '@libsql/isomorphic-fetch',
    '@libsql/isomorphic-ws',
    '@libsql/win32-x64-msvc',
    'drizzle-kit',
  ],
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
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:9001'}/:path*`,
      },
    ];
  },
};

export default nextConfig;

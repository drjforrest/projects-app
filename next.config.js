/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For Docker deployment
  typescript: {
    ignoreBuildErrors: false, // Enforce type checking
  },
  eslint: {
    ignoreDuringBuilds: false, // Enforce linting
  },
  images: {
    unoptimized: false, // Enable image optimization
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        dns: false,
        fs: false,
        tls: false,
        'pg-native': false
      };
    }
    return config;
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    },
    typedRoutes: true
  }
}

module.exports = nextConfig 
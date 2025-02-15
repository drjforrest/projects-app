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
  experimental: {
    serverActions: true,
  }
}

module.exports = nextConfig 
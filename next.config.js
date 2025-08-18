/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use the modern key (was experimental.serverComponentsExternalPackages)
  serverExternalPackages: ['@google/generative-ai'],
  // Allow external image hosts used across the app
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com', port: '', pathname: '/**' },
    ],
  },
  // If you must keep webpack fallbacks, retain this block. Otherwise, you can remove it for Turbopack.
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },
}

module.exports = nextConfig
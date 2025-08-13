import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  serverActions: {
    bodySizeLimit: '2mb',
    
    // Allow more time for AI actions to complete
    // @ts-ignore
    default: {
      maxDuration: 120,
    },
    experimental: {
      maxDuration: 120,
    },
    test: {
        maxDuration: 120,
    }
  },
};

export default nextConfig;

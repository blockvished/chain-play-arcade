/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Ignore RN async storage on web
    config.resolve.alias['@react-native-async-storage/async-storage'] = false;
    // Ignore pino-pretty too (not needed in prod)
    config.resolve.alias['pino-pretty'] = false;
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

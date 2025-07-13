/** @type {import('next').NextConfig} */
const baseConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
}

// Check if we're using Turbopack
const isTurbopack = process.env.TURBOPACK === '1' || process.argv.includes('--turbo')

if (isTurbopack) {
  // Load Turbopack-specific configuration
  const turbopackConfig = require('./config.turbopack.js')
  module.exports = turbopackConfig
} else {
  // Standard webpack configuration
  if (process.env.ANALYZE === 'true') {
    const withBundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: true,
    })
    module.exports = withBundleAnalyzer(baseConfig)
  } else {
    module.exports = baseConfig
  }
}
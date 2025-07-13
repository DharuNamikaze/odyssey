/** @type {import('next').NextConfig} */
const turbopackConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    turbo: {
      // Turbopack-specific configurations
      loaders: {
        // Add custom loaders if needed
      },
      resolveAlias: {
        // Add path aliases if needed
      },
      // Memory settings for large projects
      memoryLimit: 8192, // 8GB in MB
    },
  },
}

// Bundle analysis for Turbopack
if (process.env.ANALYZE === 'true') {
  console.log('⚠️  Bundle analysis with Turbopack is currently limited.')
  console.log('💡 For full analysis, consider using webpack: ANALYZE=true npm run build')
  
  // Add any Turbopack-specific analysis configuration here
  // This is where future Turbopack bundle analysis tools will be configured
  
  // Experimental: Log build info
  turbopackConfig.onDemandEntries = {
    maxInactiveAge: 60 * 1000, // 1 minute
    pagesBufferLength: 5,
  }
}

module.exports = turbopackConfig
// ============================================================
// PRISM — NEXT.JS CONFIG
// Image domains, environment variables, and build settings.
// ============================================================

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow images from these domains
  images: {
    domains: ['localhost'],
  },

  // Expose these env vars to the browser
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',        value: 'DENY' },
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',      value: 'geolocation=(), microphone=(), camera=()' },
        ],
      },
    ]
  },
}

export default nextConfig
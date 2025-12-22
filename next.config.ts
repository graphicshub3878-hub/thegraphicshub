import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  // ✅ NEW correct place (NOT experimental)
  serverExternalPackages: ['nodemailer'],
}

export default nextConfig

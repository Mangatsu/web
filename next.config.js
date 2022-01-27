/** @type {import('next').NextConfig} */

const imageDomain = process.env.NEXT_MANGATSU_IMAGE_HOSTNAME || "localhost"
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [imageDomain],
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
}

module.exports = nextConfig

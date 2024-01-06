/** @type {import('next').NextConfig} */

const imageDomain = process.env.NEXT_MANGATSU_IMAGE_HOSTNAME
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      ...(imageDomain
        ? [
            {
              protocol: "https",
              hostname: imageDomain,
              pathname: "**",
            },
          ]
        : []),
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "**",
      },
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  output: "export",
}

export default nextConfig

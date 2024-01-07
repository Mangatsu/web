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
      { protocol: "http", hostname: "localhost", port: "5050", pathname: "**" },
      { protocol: "http", hostname: "127.0.0.1", port: "5050", pathname: "**" },
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  output: "standalone",
}

export default nextConfig

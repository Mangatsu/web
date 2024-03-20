/** @type {import('next').NextConfig} */

const imageDomain = process.env.NEXT_MANGATSU_IMAGE_HOSTNAME

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      ...(imageDomain ? [{ hostname: imageDomain, pathname: "**" }] : []),
      { hostname: "localhost", port: "**", pathname: "**" },
      { hostname: "127.0.0.1", port: "**", pathname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24,
  },
  output: "standalone",
}

export default nextConfig

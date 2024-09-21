/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["flagsapi.com", "media-2.api-sports.io"],
    unoptimized: true,
  },
};

module.exports = nextConfig;

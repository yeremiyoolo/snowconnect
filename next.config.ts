import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'store.storeimages.cdn-apple.com' },
      { protocol: 'https', hostname: 'images.samsung.com' },
      { protocol: 'https', hostname: 'fdn2.gsmarena.com' },
    ],
  },
};

export default nextConfig;
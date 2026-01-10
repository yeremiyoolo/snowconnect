// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'res.cloudinary.com', // Si usas Cloudinary para fotos
      'utfs.io',            // Si usas UploadThing
      'images.unsplash.com'
    ],
    // Habilita el soporte para blur placeholders de forma remota
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
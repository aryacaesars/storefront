import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // MinIO lokal jalan di 127.0.0.1 — Next 16 memblokir IP privat secara
    // default. Hanya untuk dev; di prod arahkan S3_PUBLIC_URL ke domain publik.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      // MinIO lokal (dev). Prod: tambahkan domain publik MinIO/CDN di sini.
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "9000",
        pathname: "/storefront-assets/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/storefront-assets/**",
      },
      // Foto mock untuk preview theme (dev preview + mock catalog).
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

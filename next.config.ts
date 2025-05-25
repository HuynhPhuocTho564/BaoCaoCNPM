import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: [
      "drive.google.com",
      "drive.usercontent.google.com",
      "lh3.googleusercontent.com",
      "placehold.co",
    ],
  },
  // Cấu hình cho Turbopack (stable)
  turbopack: {
    // Cấu hình resolve alias
    resolveAlias: {
      // Có thể thêm alias nếu cần
    },
  },

  async rewrites() {
    return [
      {
        source: "/fonts/:path*",
        destination: "https://fonts.gstatic.com/:path*",
      },
    ];
  },
};

export default nextConfig;

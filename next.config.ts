import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/checkout", destination: "/productos", permanent: false },
    ];
  },
};

export default nextConfig;

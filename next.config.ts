import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/gh/PokeAPI/sprites@master/sprites/pokemon/**',
      },
    ]
  }
};

export default nextConfig;

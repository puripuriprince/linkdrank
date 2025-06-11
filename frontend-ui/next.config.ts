import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "imgproxy.attic.sh",
      "picsum.photos",
      "media.licdn.com",
      "attic.sh",
      "images.unsplash.com",
      "linky-media.s3.us-east-2.amazonaws.com"
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Video thumbnails come from YouTube's image CDN.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Quiz banks are read from disk at request time until the database lands.
  outputFileTracingIncludes: {
    "/learn/**": ["./content/quiz-banks/**"],
  },
  images: {
    // Video thumbnails come from YouTube's image CDN.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
};

export default nextConfig;

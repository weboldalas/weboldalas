import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // the designs page was removed; keep old links and search results working
      { source: '/dizajnok', destination: '/referenciak', permanent: true },
    ]
  },
};

export default nextConfig;

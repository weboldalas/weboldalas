import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // the designs page was removed; keep old links and search results working
      { source: '/dizajnok', destination: '/referenciak', permanent: true },
      // prices are no longer published; the old pricing page leads to the contact form
      { source: '/arak', destination: '/kapcsolat', permanent: false },
    ]
  },
};

export default nextConfig;

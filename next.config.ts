import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // the designs page was removed; keep old links and search results working
      { source: '/dizajnok', destination: '/referenciak', permanent: true },
      // prices are not published; old pricing links lead to the contact page
      { source: '/arak', destination: '/kapcsolat', permanent: false },
      { source: '/en/pricing', destination: '/en/contact', permanent: false },
    ]
  },
};

export default nextConfig;

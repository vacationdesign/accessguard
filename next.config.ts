import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for serverless deployment
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium-min"],

  // Increase serverless function timeout for scanning
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // Headers for security and SEO
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

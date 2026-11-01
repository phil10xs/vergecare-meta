import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Docker images use standalone output.
  output: "standalone",
  serverExternalPackages: ["@aws-sdk/client-sesv2"],
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;

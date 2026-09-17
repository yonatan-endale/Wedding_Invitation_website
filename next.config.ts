import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Pin the project root so a lockfile in a parent folder isn't picked up.
  turbopack: { root: import.meta.dirname },
  outputFileTracingRoot: import.meta.dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default withNextIntl(nextConfig);

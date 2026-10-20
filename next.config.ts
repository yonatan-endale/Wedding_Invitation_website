import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Pin the project root so a lockfile in a parent folder isn't picked up.
  turbopack: { root: import.meta.dirname },
  outputFileTracingRoot: import.meta.dirname,
  // The admin's sites lived under /admin/couples before other event types; old bookmarks still land.
  async redirects() {
    return [{ source: "/admin/couples/:path*", destination: "/admin/sites/:path*", permanent: true }];
  },
  images: {
    // Vercel Hobby includes 5,000 image transformations a month. A short list of
    // widths and one quality keep each photo to a few variants, and a long cache
    // lifetime stops them being regenerated.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [64, 128, 256, 384],
    qualities: [75],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default withNextIntl(nextConfig);

import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import type { Configuration } from "webpack";
import path from "path";

const nextConfig: NextConfig = {
  webpack(config: Configuration) {
    // Not necessary anymore, created a relative hell in the site-guide/[slug]/page.tsx
    // Ensure 'resolve' exists
    config.resolve ??= {};

    // Ensure 'alias' exists and cast it as a string-keyed object
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@messages": path.resolve(__dirname, "messages"),
    } as Record<string, string>;

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.abertih.com",
        port: "",
        pathname: "/GB/img/slider/**",
      },
      {
        protocol: "https",
        hostname: "magicalmirleft.com",
        pathname: "/wp-content/uploads/2024/03/**",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
        pathname: "/www.nidaigle.com/wp-content/uploads/2020/06/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

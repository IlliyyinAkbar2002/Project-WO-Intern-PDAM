import type { NextConfig } from "next";

// NOTE: the project previously imported `flowbite-react/plugin/nextjs`.
// That package is not currently installed in `package.json`, which
// causes "Cannot find module 'flowbite-react/plugin/nextjs'" errors.
//
// If you want the Flowbite Next plugin, install `flowbite-react`
// (and `flowbite` if needed):
//   npm install flowbite-react flowbite
// Then restore the plugin import and export below.

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;

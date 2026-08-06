/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow LAN/mobile testing against the dev server (e.g. http://192.168.x.x:3000)
  allowedDevOrigins: ["192.168.1.60", "192.168.*"],
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "@radix-ui/react-icons",
      "framer-motion",
    ],
  },
};

export default nextConfig;

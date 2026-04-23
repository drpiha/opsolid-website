/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lean Docker image: only copies the runtime bundle, no node_modules.
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow wedding photo URLs (Google Photos, custom CDN, etc.)
    // Add domains as needed; `remotePatterns` is the modern replacement
    // for the deprecated `domains` config.
    remotePatterns: [
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "photos.google.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  async rewrites() {
    const weddingId = process.env.NEXT_PUBLIC_WEDDING_ID || "bretch-joyce";
    return [
      {
        source: `/${weddingId}`,
        destination: "/",
      },
    ];
  },
};

export default nextConfig;

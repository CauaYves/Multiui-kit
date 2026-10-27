/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@multiclubes/ui"],
  images: {
    // Imagens usadas pelos exemplos do shadcn/ui (examples/).
    remotePatterns: [
      { protocol: "https", hostname: "avatar.vercel.sh" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;

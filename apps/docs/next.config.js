/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@multiclubes/ui"],
  // Libera o servidor de dev para túneis do ngrok (só vale em `next dev`).
  allowedDevOrigins: ["*.ngrok-free.app"],
  images: {
    // Imagens usadas pelos exemplos do shadcn/ui (examples/).
    remotePatterns: [
      { protocol: "https", hostname: "avatar.vercel.sh" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;

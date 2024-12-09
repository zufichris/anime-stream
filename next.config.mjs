/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s4.anilist.co", // Correct hostname
        pathname: "/file/**", // Allow all paths under /file
      },
    ],
  },
};

export default nextConfig;

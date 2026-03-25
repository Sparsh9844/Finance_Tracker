/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "", // optional
        pathname: "/**", // allow all paths under randomuser.me
      },
    ],
  },
};

export default nextConfig;

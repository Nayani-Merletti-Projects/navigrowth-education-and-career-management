/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Keep this false if you're having issues, but consider changing to true for production
  basePath: "/navigrowth-education-and-career-management",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
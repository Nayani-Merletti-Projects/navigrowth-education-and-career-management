/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "/navigrowth-education-and-career-management",
  images: {
    unoptimized: true,
  },
  // Add this section:
  reactStrictMode: false, // This suppresses the warning, but it's not recommended for production
};

export default nextConfig;
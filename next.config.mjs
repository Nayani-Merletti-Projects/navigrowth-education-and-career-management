/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: "/navigrowth-education-and-career-management",
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        fs: false,
        path: false,
        os: false,
      };
    }

    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    return config;
  },
};

export default nextConfig;
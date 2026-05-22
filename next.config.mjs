/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // We can disable ESLint checks during build to make the dev/build process faster and more robust
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

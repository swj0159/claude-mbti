/** @type {import('next').NextConfig} */
const isVercel = process.env.VERCEL === '1';
const nextConfig = {
  output: 'export',
  basePath: isVercel ? '' : '/claude-mbti',
  assetPrefix: isVercel ? '' : '/claude-mbti',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
